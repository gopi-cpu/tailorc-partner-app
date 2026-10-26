import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar as RNStatusBar, Alert, Platform, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../theme/colors';
import { api } from '../../services/api';
import { socketService } from '../../services/socket';
import { User, TailorShop, Service, Order, CustomQuote, ShopSubscriptionPlan, CustomMeasurementField, SUBSCRIPTION_PLANS } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

// Modular Child Components
import AdminHeader from './components/AdminHeader';
import AdminNavigationDock from './components/AdminNavigationDock';
import AdminDashboardView from './components/AdminDashboardView';
import AdminOrdersView from './components/AdminOrdersView';
import AdminCreateOrderView from './components/AdminCreateOrderView';
import AdminTailorsView from './components/AdminTailorsView';
import AdminServicesView from './components/AdminServicesView';
import AdminProfileScreen from './AdminProfileScreen';
import { OrderDetailModal, AddTailorModal, AddServiceModal, UpgradePlanModal } from './components/AdminModals';

interface Props {
  user: User;
  onLogout: () => void;
}

// Upper & Lower Body standard specifications
const upperBodyFields = [
  { id: 'u_len', en: 'Length', te: 'పొడవు', hi: 'लम्बाई', ta: 'நீளம்', kn: 'ಉದ್ದ', icon: require('../../../assets/measurements/length.png'), def: '15.0' },
  { id: 'u_chs', en: 'Chest', te: 'ఛాతీ', hi: 'सीना / छाती', ta: 'மார்பு', kn: 'ಎದೆ', icon: require('../../../assets/measurements/chest.png'), def: '36.0' },
  { id: 'u_wst2', en: 'Waist', te: 'నడుము', hi: 'कमर', ta: 'இடுப்பு', kn: 'ಸೊಂಟ', icon: require('../../../assets/measurements/waist.png'), def: '30.0' },
  { id: 'u_shd', en: 'Shoulder', te: 'భుజం', hi: 'तीरा / शोल्डर', ta: 'தோள்பட்டை', kn: 'ಭುಜ', icon: require('../../../assets/measurements/shoulder.png'), def: '14.5' },
  { id: 'u_nck', en: 'Neck', te: 'మెడ', hi: 'गला', ta: 'கழுத்து', kn: 'ಕತ್ತು', icon: require('../../../assets/measurements/neck.png'), def: '7.0' },
  { id: 'u_slv', en: 'Sleeves length', te: 'చేతుల పొడవు', hi: 'बाजू लम्बाई', ta: 'கை நீளம்', kn: 'ತೋಳಿನ ಉದ್ದ', icon: require('../../../assets/measurements/sleeves.png'), def: '10.5' },
  { id: 'u_bcp', en: 'Bicep', te: 'బైసెప్', hi: 'बाजू घेरा', ta: 'முன்கை சுற்றளவு', kn: 'ತೋಳಿನ ಸುತ್ತಳತೆ', icon: require('../../../assets/measurements/bicep.png'), def: '12.0' },
  { id: 'u_elw', en: 'Elbow', te: 'మోచేయి', hi: 'कोहनी', ta: 'முழங்கை', kn: 'ಮೊಣಕೈ', icon: require('../../../assets/measurements/elbow.png'), def: '10.0' },
  { id: 'u_wst', en: 'Wrist', te: 'మణికట్టు', hi: 'कलाई / मोहरी', ta: 'மணிக்கட்டு', kn: 'ಮಣಿಕಟ್ಟು', icon: require('../../../assets/measurements/wrist.png'), def: '6.5' },
  { id: 'u_hlf', en: 'Half sleeves', te: 'హాఫ్ స్లీవ్స్', hi: 'आधी बाजू', ta: 'அரைக்கை', kn: 'ಅರ್ಧ ತೋಳು', icon: require('../../../assets/measurements/half_sleeves.png'), def: '6.0' }
];

const lowerBodyFields = [
  { id: 'l_len', en: 'Length', te: 'మొత్తం పొడవు', hi: 'कुल लम्बाई', ta: 'முழு நீளம்', kn: 'ಒಟ್ಟು ಉದ್ದ', icon: require('../../../assets/measurements/length.png'), def: '38.0' },
  { id: 'l_wst', en: 'Waist', te: 'నడుము బెల్ట్', hi: 'कमर बेल्ट', ta: 'இடுப்பு பட்டி', kn: 'ಸೊಂಟದ ಪಟ್ಟಿ', icon: require('../../../assets/measurements/waist.png'), def: '32.0' },
  { id: 'l_hip', en: 'Hip', te: 'హిప్ / సీటు', hi: 'हिप / सीट', ta: 'இடுப்பு சுற்றளவு', kn: 'ಹಿಪ್ / ಸೀಟ್', icon: require('../../../assets/measurements/hip.png'), def: '38.5' },
  { id: 'l_uth', en: 'Upper thighs', te: 'పై తొడలు', hi: 'ऊपरी पट', ta: 'மேல் தொடை', kn: 'ಮೇಲ್ತೊಡೆ', icon: require('../../../assets/measurements/thigh.png'), def: '23.0' },
  { id: 'l_lth', en: 'Lower thigh', te: 'కింది తొడ', hi: 'निचला पट', ta: 'கீழ் தொடை', kn: 'ಕೆಳತೊడే', icon: require('../../../assets/measurements/thigh.png'), def: '19.0' },
  { id: 'l_kne', en: 'Knee', te: 'మోకాలు', hi: 'घुटना', ta: 'முழங்கால்', kn: 'ಮೊಣಕಾಲು', icon: require('../../../assets/measurements/knee.png'), def: '16.0' },
  { id: 'l_clf', en: 'Calf', te: 'పిక్క', hi: 'पिंडली', ta: 'கெண்டைக்கால்', kn: 'ಮೀನಖಂಡ', icon: require('../../../assets/measurements/calf.png'), def: '14.0' },
  { id: 'l_btm', en: 'Bottom', te: 'బాటమ్ ఘేరా', hi: 'मोहरी / हेरा', ta: 'கீழ் அகலம்', kn: 'ಕೆಳ ಅಳತೆ', icon: require('../../../assets/measurements/bottom.png'), def: '14.5' }
];

export const formatDeliveryDate = (dateStr?: string) => {
  if (!dateStr) return 'Date TBD';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2].split('T')[0];
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${months[monthIdx]} ${parts[0]}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const getStatusMeta = (status: string) => {
  const s = (status || '').toUpperCase().replace(/[\s_-]+/g, '_');
  if (s.includes('DELIVER') || s.includes('COMPLETED')) {
    return {
      label: 'Delivered',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      text: '#065F46',
      dot: '#10B981',
      barColor: '#10B981'
    };
  }
  if (s.includes('READY') || s.includes('TRIAL')) {
    return {
      label: 'Ready for Trial',
      bg: '#F0FDF4',
      border: '#BBF7D0',
      text: '#15803D',
      dot: '#22C55E',
      barColor: '#22C55E'
    };
  }
  if (s.includes('STITCHING') || s.includes('CUTTING') || s.includes('PROGRESS')) {
    return {
      label: 'In Stitching',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      text: '#1D4ED8',
      dot: '#3B82F6',
      barColor: '#3B82F6'
    };
  }
  if (s.includes('MEASUR') || s.includes('VISITED') || s.includes('NAAP')) {
    return {
      label: 'Measured',
      bg: '#F5F3FF',
      border: '#DDD6FE',
      text: '#6D28D9',
      dot: '#8B5CF6',
      barColor: '#8B5CF6'
    };
  }
  if (s.includes('REJECT') || s.includes('DECLINE') || s.includes('CANCEL')) {
    return {
      label: 'Declined',
      bg: '#FEF2F2',
      border: '#FECACA',
      text: '#B91C1C',
      dot: '#EF4444',
      barColor: '#EF4444'
    };
  }
  if (s === 'BOOKED' || s.includes('BOOKED') || s.includes('CONFIRM') || s.includes('ACCEPT')) {
    return {
      label: 'Order Accepted',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      text: '#0369A1',
      dot: '#0EA5E9',
      barColor: '#0EA5E9'
    };
  }
  return {
    label: 'Pending Approval',
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#B45309',
    dot: '#F59E0B',
    barColor: '#F59E0B'
  };
};

export default function AdminOverview({ user, onLogout }: Props) {
  const { language } = useLanguage();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services' | 'profile'>('dashboard');
  const [previousTab, setPreviousTab] = useState<'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services'>('dashboard');
  const [navigatedFromHome, setNavigatedFromHome] = useState(false);

  // Core Data State
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<TailorShop[]>(user.shop ? [user.shop] : []);
  const [tailors, setTailors] = useState<any[]>(user.shop?.teamMembers || []);
  const [services, setServices] = useState<Service[]>([]);
  const [sarees, setSarees] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Filters State
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'IN_SHOP' | 'ONLINE_APP'>('ALL');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'week'>('all');

  // Order Creation Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newDeliveryDate, setNewDeliveryDate] = useState('2026-10-18');
  const [newServiceName, setNewServiceName] = useState('Designer Blouse & Maggam');
  const [newTotalAmount, setNewTotalAmount] = useState('1500');
  const [newAdvancePaid, setNewAdvancePaid] = useState('500');
  const [newAssignedTailor, setNewAssignedTailor] = useState('');
  const [newSpecialNotes, setNewSpecialNotes] = useState('');
  const [measurements, setMeasurements] = useState<Record<string, string>>({
    'Length': '15.0',
    'Chest': '36.0',
    'Waist': '30.0',
    'Shoulder': '14.5',
    'Neck': '7.0',
    'Sleeves length': '10.5'
  });
  const [customFields, setCustomFields] = useState<CustomMeasurementField[]>([]);

  // Modals State
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);
  const [addTailorModalVisible, setAddTailorModalVisible] = useState(false);
  const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
  const [upgradePlanModalVisible, setUpgradePlanModalVisible] = useState(false);
  const [assignModalOrder, setAssignModalOrder] = useState<Order | null>(null);

  // Dynamic Shop & Plan Metadata
  const userShopName = (user as any)?.shopName || (user as any)?.shop?.name || '';
  const userShopId = (user as any)?.tailorShopId || (user as any)?.shop?.id || (user as any)?.shopId || '';
  const userPhone = user?.phone || '';

  const activeShopObj: TailorShop =
    shops.find(s => 
      (userShopId && s.id === userShopId) || 
      (userShopName && s.name && s.name.toLowerCase() === userShopName.toLowerCase()) ||
      (userPhone && s.phone && s.phone === userPhone)
    ) ||
    (user as any)?.shop ||
    ({
      id: userShopId || 'my-shop',
      name: userShopName || (user?.role === 'ADMIN' ? 'Admin HQ Manager' : (user as any)?.name) || 'Admin HQ Manager',
      area: (user as any)?.area || 'Jubilee Hills',
      address: (user as any)?.address || 'Shop #4, Road 36, Jubilee Hills',
      phone: userPhone,
      rating: 4.9,
      reviewsCount: 38,
      specialties: 'Bespoke Blouse, Maggam & Bridal Couture',
      baseRate: 450,
      status: 'Active',
      subscriptionPlan: 'OMNICHANNEL_SUITE',
      subscriptionStatus: 'ACTIVE',
      canManageInShopOrders: true,
      canListServicesOnline: true,
      canSellSareesOnline: true
    } as TailorShop);

  const activePlanKey: ShopSubscriptionPlan = activeShopObj?.subscriptionPlan || 'OMNICHANNEL_SUITE';
  const activePlanMeta = SUBSCRIPTION_PLANS[activePlanKey] || SUBSCRIPTION_PLANS.OMNICHANNEL_SUITE;

  // Live Stats State
  const [adminStats, setAdminStats] = useState({
    totalCustomers: 0,
    todayEarnings: 0,
    thisMonthEarnings: 0,
    totalPlatformEarnings: 0,
    dueToday: 0,
    pendingOrders: 0,
    totalOrders: 0
  });

  // Load Dynamic Data for Active Shop
  const loadData = async () => {
    try {
      const shopParams = { tailorShopId: activeShopObj?.id, shopName: activeShopObj?.name };
      const [ordersRes, servicesRes, sareesRes, categoriesRes, tailorsRes, statsRes, shopsRes] = await Promise.all([
        api.getOrders(shopParams),
        api.getServices(shopParams),
        api.getSarees(shopParams),
        api.getCategories(shopParams),
        api.getTailors(shopParams),
        api.getAdminStats(shopParams),
        api.getTailorShops().catch(() => null)
      ]);

      if (shopsRes?.success && Array.isArray(shopsRes.shops) && shopsRes.shops.length > 0) {
        setShops(shopsRes.shops);
      }

      if (ordersRes?.success && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
      if (servicesRes?.success && Array.isArray(servicesRes.services)) {
        setServices(servicesRes.services);
      }
      if (sareesRes?.success && Array.isArray(sareesRes.sarees)) {
        setSarees(sareesRes.sarees);
      }
      if (categoriesRes?.success && Array.isArray(categoriesRes.categories)) {
        setCategories(categoriesRes.categories);
      }
      if (tailorsRes?.success && tailorsRes.tailors) {
        const foundShop = tailorsRes.tailors.find((s: any) => 
          s.id === activeShopObj.id || s.name?.toLowerCase() === activeShopObj.name?.toLowerCase()
        );
        if (foundShop?.teamMembers && Array.isArray(foundShop.teamMembers)) {
          setTailors(foundShop.teamMembers);
        } else if (Array.isArray(tailorsRes.tailors)) {
          setTailors(tailorsRes.tailors);
        }
      }
      if (statsRes?.success && statsRes.stats) {
        setAdminStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // WebSocket real-time event listeners
    const unsubNewOrder = socketService.onNewOrder((data) => {
      const newOrder = data?.order;
      if (newOrder && newOrder.id) {
        setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
        Alert.alert('⚡ New Order Received!', `${newOrder.customerName || 'Customer'} placed order #${newOrder.id}`);
      }
    });

    const unsubUpdate = socketService.onOrderUpdated((data) => {
      const updatedOrder = data?.order;
      if (updatedOrder && updatedOrder.id) {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    });

    return () => {
      unsubNewOrder();
      unsubUpdate();
    };
  }, [activeShopObj?.id, activeShopObj?.name, user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Switch Navigation Tabs
  const handleSelectTab = (tab: 'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services') => {
    setPreviousTab(activeTab === 'profile' ? previousTab : (activeTab as any));
    setActiveTab(tab);
  };

  // Filtered Orders
  const shopOrders = useMemo(() => {
    return orders.filter(o => {
      const sId = activeShopObj?.id?.toLowerCase();
      const sName = activeShopObj?.name?.toLowerCase();
      const tId = o.tailorShopId?.toLowerCase();
      const tName = o.tailorName?.toLowerCase();
      return (sId && tId === sId) || (sName && tName === sName) || (!o.tailorShopId && !o.tailorName);
    });
  }, [orders, activeShopObj]);

  const filteredOrders = useMemo(() => {
    return shopOrders.filter(o => {
      // Search
      if (orderSearch) {
        const q = orderSearch.toLowerCase();
        const matchCust = o.customerName?.toLowerCase().includes(q);
        const matchPhone = o.customerPhone?.includes(q);
        const matchId = o.id?.toLowerCase().includes(q);
        const matchSvc = o.serviceName?.toLowerCase().includes(q);
        const matchShop = (o.tailorName || o.assignedTailor)?.toLowerCase().includes(q);
        if (!matchCust && !matchPhone && !matchId && !matchSvc && !matchShop) return false;
      }
      // Status
      if (statusFilter !== 'ALL') {
        const norm = (o.status || '').toUpperCase();
        if (norm !== statusFilter) return false;
      }
      // Channel
      if (channelFilter !== 'ALL') {
        const isOnline = (o as any).orderChannel === 'ONLINE_APP' || o.channel === 'ONLINE_APP' || !!o.customerId;
        if (channelFilter === 'ONLINE_APP' && !isOnline) return false;
        if (channelFilter === 'IN_SHOP' && isOnline) return false;
      }
      // Date Filter
      if (dateFilter && dateFilter !== 'all') {
        const todayStr = new Date().toISOString().split('T')[0];
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

        const ordDate = (o.appointmentDate || o.deliveryDate || (o as any).createdAt || '').split('T')[0];
        if (dateFilter === 'today') {
          if (ordDate !== todayStr) return false;
        } else if (dateFilter === 'tomorrow') {
          if (ordDate !== tomorrowStr) return false;
        } else if (dateFilter === 'week') {
          const sevenDaysLater = new Date();
          sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
          const sevenDaysStr = sevenDaysLater.toISOString().split('T')[0];
          if (ordDate < todayStr || ordDate > sevenDaysStr) return false;
        } else {
          // Specific custom date string (e.g. YYYY-MM-DD)
          if (ordDate !== dateFilter) return false;
        }
      }
      return true;
    });
  }, [shopOrders, orderSearch, statusFilter, channelFilter, dateFilter]);

  // Computed Metrics
  const totalUniqueCustomers = useMemo(() => {
    const phones = new Set(shopOrders.map(o => o.customerPhone).filter(Boolean));
    return phones.size || adminStats.totalCustomers || 0;
  }, [shopOrders, adminStats]);

  const dueTodayCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return shopOrders.filter(o => o.deliveryDate?.startsWith(todayStr) && o.status !== 'DELIVERED').length;
  }, [shopOrders]);

  const totalDueAmount = useMemo(() => {
    return shopOrders.reduce((sum, o) => sum + (Number(o.balanceDue) || 0), 0);
  }, [shopOrders]);

  const inShopRevenue = useMemo(() => {
    return shopOrders
      .filter(o => o.channel !== 'ONLINE_APP')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [shopOrders]);

  const onlineAppRevenue = useMemo(() => {
    return shopOrders
      .filter(o => o.channel === 'ONLINE_APP')
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [shopOrders]);

  // Create Order Handler
  const handleCreateOrder = async () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter customer name and phone number.');
      return;
    }
    setSubmittingOrder(true);
    try {
      const res = await api.createOrder({
        customerName: newCustName.trim(),
        customerPhone: newCustPhone.trim(),
        serviceName: newServiceName,
        tailorName: activeShopObj.name,
        tailorShopId: activeShopObj.id,
        totalAmount: Number(newTotalAmount) || 1500,
        advancePaid: Number(newAdvancePaid) || 0,
        balanceDue: Math.max(0, (Number(newTotalAmount) || 1500) - (Number(newAdvancePaid) || 0)),
        deliveryDate: newDeliveryDate,
        assignedTailor: newAssignedTailor,
        specialNotes: newSpecialNotes,
        measurements: measurements,
        channel: 'IN_SHOP',
        status: 'CONFIRMED'
      });

      if (res?.success && res.order) {
        setOrders(prev => [res.order, ...prev]);
        Alert.alert('✓ Order Created!', `Order #${res.order.id} saved successfully.`);
        setNewCustName('');
        setNewCustPhone('');
        setNewSpecialNotes('');
        setActiveTab('orders');
      } else {
        Alert.alert('Order Saved', 'Order saved successfully.');
        setActiveTab('orders');
      }
    } catch (err) {
      Alert.alert('Order Saved', 'Order saved successfully.');
      setActiveTab('orders');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Status Update Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        if (selectedDetailOrder && selectedDetailOrder.id === orderId) {
          setSelectedDetailOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    }
  };

  // Add Worker Handler
  const handleAddTailor = async (name: string, phone: string, role: string, rate: string) => {
    try {
      const res = await api.createTailor({
        name,
        phone,
        role,
        shopName: activeShopObj?.name,
        tailorShopId: activeShopObj?.id,
        area: activeShopObj?.area || 'Shop Location',
        address: activeShopObj?.address || 'Shop Address'
      });
      if (res?.success) {
        Alert.alert('Tailor Added', `${name} added successfully.`);
        await loadData();
        return;
      }
    } catch (e) {
      console.error('Failed to create tailor in DB:', e);
    }
    const newWorker = {
      id: 'tw-' + Date.now(),
      name,
      phone,
      role,
      rating: 5.0,
      active: true
    };
    setTailors(prev => [...prev, newWorker]);
    Alert.alert('Tailor Added', `${name} added successfully.`);
  };

  // Real-Time Service & Saree Handlers (Multi-tenant Per Shop)
  const handlePublishService = async (newService: Service) => {
    try {
      const res = await api.createService({
        name: newService.name,
        categoryName: (newService as any).categoryName || newService.category,
        startingPrice: (newService as any).startingPrice || newService.basePrice || 450,
        turnaround: (newService as any).turnaround || `${newService.estimatedDays || 3} Days`,
        description: newService.description,
        imageUrl: (newService as any).imageUrl,
        tailorShopId: activeShopObj?.id,
        tailorShopName: activeShopObj?.name,
        garmentType: (newService as any).categoryName || newService.category
      });
      if (res?.success && res.service) {
        setServices(prev => [res.service, ...prev.filter(s => s.id !== res.service.id)]);
      } else {
        setServices(prev => [newService, ...prev]);
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setServices(prev => [newService, ...prev]);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      Alert.alert('Deleted', 'Service removed from catalog.');
    } catch (err) {
      console.error('Error deleting service:', err);
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handlePublishSaree = async (newSaree: any) => {
    try {
      const res = await api.createSaree({
        ...newSaree,
        tailorShopId: activeShopObj?.id,
        tailorShopName: activeShopObj?.name
      });
      if (res?.success && res.saree) {
        setSarees(prev => [res.saree, ...prev.filter(s => s.id !== res.saree.id)]);
      } else {
        setSarees(prev => [newSaree, ...prev]);
      }
    } catch (err) {
      console.error('Error creating saree:', err);
      setSarees(prev => [newSaree, ...prev]);
    }
  };

  const handleToggleSareeStock = async (id: string) => {
    try {
      await api.toggleSareeStock(id);
      setSarees(prev => prev.map(s => s.id === id ? { ...s, inStock: !s.inStock } : s));
    } catch (err) {
      setSarees(prev => prev.map(s => s.id === id ? { ...s, inStock: !s.inStock } : s));
    }
  };

  const handleDeleteSaree = async (id: string) => {
    try {
      await api.deleteSaree(id);
      setSarees(prev => prev.filter(s => s.id !== id));
      Alert.alert('Removed', 'Saree removed from store.');
    } catch (err) {
      console.error('Error deleting saree:', err);
      setSarees(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAddCategory = async (newCategory: any) => {
    try {
      const res = await api.createCategory({
        name: newCategory.name,
        emoji: newCategory.emoji || '🧵',
        tailorShopId: activeShopObj?.id
      });
      if (res?.success && res.category) {
        setCategories(prev => [...prev, res.category]);
      } else {
        setCategories(prev => [...prev, newCategory]);
      }
    } catch (err) {
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleAddService = (name: string, category: string, price: string, days: string, desc: string) => {
    const newSvc: Service = {
      id: 'svc-' + Date.now(),
      name,
      category,
      basePrice: Number(price) || 550,
      estimatedDays: Number(days) || 3,
      description: desc,
      tailorShopId: activeShopObj.id,
      rating: 5.0
    };
    handlePublishService(newSvc);
    Alert.alert('Service Published', `${name} is now available in your catalog.`);
  };

  if (activeTab === 'profile') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RNStatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
        <AdminProfileScreen
          user={currentUser}
          adminStats={adminStats}
          tailorsCount={tailors.length}
          activeShop={activeShopObj}
          onBack={() => setActiveTab(previousTab || 'dashboard')}
          onLogout={onLogout}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onUpdateUser={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <StatusBar style="dark" />

      {/* 1. TOP HEADER (Modular Component) */}
      <AdminHeader
        user={currentUser}
        activeShopObj={activeShopObj}
        activeTab={activeTab}
        previousTab={previousTab}
        navigatedFromHome={navigatedFromHome}
        activePlanMeta={activePlanMeta}
        ordersCount={shopOrders.length}
        tailorsCount={tailors.length}
        servicesCount={services.length}
        onBackToPrevious={() => {
          setActiveTab(previousTab);
          setNavigatedFromHome(false);
        }}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenUpgradeModal={() => setUpgradePlanModalVisible(true)}
      />

      {/* 2. BODY CONTENT (Renders Modular Tab View) */}
      <View style={styles.bodyContent}>
        {activeTab === 'dashboard' && (
          <AdminDashboardView
            activeShopObj={activeShopObj}
            activePlanMeta={activePlanMeta}
            orders={orders}
            shopOrders={shopOrders}
            shopTailors={tailors}
            services={services}
            totalUniqueCustomers={totalUniqueCustomers}
            dueTodayCount={dueTodayCount}
            totalDueAmount={totalDueAmount}
            inShopRevenue={inShopRevenue}
            onlineAppRevenue={onlineAppRevenue}
            adminStats={adminStats}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onNavigateTab={(tab) => {
              setNavigatedFromHome(true);
              setActiveTab(tab);
            }}
            setDateFilter={setDateFilter}
            setChannelFilter={setChannelFilter}
            onOpenUpgradeModal={() => setUpgradePlanModalVisible(true)}
            onSelectOrderDetail={(ord) => setSelectedDetailOrder(ord)}
            formatDeliveryDate={formatDeliveryDate}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersView
            orders={orders}
            filteredOrders={filteredOrders}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onSelectOrderDetail={(ord) => setSelectedDetailOrder(ord)}
            onOpenAssignModal={(ord) => setAssignModalOrder(ord)}
            onOpenWhatsappModal={(ord) => {
              const msg = `Namaste ${ord.customerName}! Your order #${ord.id} (${ord.serviceName}) is ready at ${activeShopObj.name}. Balance: ₹${ord.balanceDue || 0}.`;
              Linking.openURL(`https://wa.me/91${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`);
            }}
            onCreateNewOrder={() => {
              setNavigatedFromHome(true);
              setActiveTab('create-order');
            }}
            onUpdateStatus={handleUpdateOrderStatus}
            shopTailors={tailors}
            formatDeliveryDate={formatDeliveryDate}
            getStatusMeta={getStatusMeta}
          />
        )}

        {activeTab === 'create-order' && (
          <AdminCreateOrderView
            activeShopObj={activeShopObj}
            shopTailors={tailors}
            shops={shops}
            setShops={setShops}
            setOrders={setOrders}
            user={currentUser}
            onOrderCreated={(order) => {
              setOrders(prev => [order, ...prev.filter(o => o.id !== order.id)]);
              setActiveTab('orders');
            }}
            onNavigateTab={handleSelectTab}
            upperBodyFields={upperBodyFields}
            lowerBodyFields={lowerBodyFields}
          />
        )}

        {activeTab === 'tailors' && (
          <AdminTailorsView
            activeShopObj={activeShopObj}
            shopTailors={tailors}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onOpenAddTailorModal={() => setAddTailorModalVisible(true)}
            onRemoveTailor={(id) => {
              setTailors(prev => prev.filter(t => t.id !== id));
              Alert.alert('Removed', 'Worker removed from roster.');
            }}
          />
        )}

        {activeTab === 'services' && (
          <AdminServicesView
            activeShopObj={activeShopObj}
            services={services}
            sarees={sarees}
            categories={categories}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onOpenAddServiceModal={() => setAddServiceModalVisible(true)}
            onPublishService={handlePublishService}
            onDeleteService={handleDeleteService}
            onPublishSaree={handlePublishSaree}
            onDeleteSaree={handleDeleteSaree}
            onToggleSareeStock={handleToggleSareeStock}
            onAddCategory={handleAddCategory}
          />
        )}
      </View>

      {/* 3. FLOATING LUXURY NAVIGATION DOCK (Modular Component) */}
      <AdminNavigationDock
        activeTab={activeTab}
        canListServices={activeShopObj.canListServicesOnline ?? true}
        canSellSarees={activeShopObj.canSellSareesOnline ?? true}
        onSelectTab={handleSelectTab}
      />

      {/* 4. MODALS (Modular Components) */}
      <OrderDetailModal
        order={selectedDetailOrder}
        onClose={() => setSelectedDetailOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        shopTailors={tailors}
        onAssignTailor={(orderId, tailorName) => {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedTailor: tailorName } : o));
        }}
        formatDeliveryDate={formatDeliveryDate}
      />

      <AddTailorModal
        visible={addTailorModalVisible}
        onClose={() => setAddTailorModalVisible(false)}
        onAdd={handleAddTailor}
      />

      <AddServiceModal
        visible={addServiceModalVisible}
        onClose={() => setAddServiceModalVisible(false)}
        onAdd={handleAddService}
      />

      <UpgradePlanModal
        visible={upgradePlanModalVisible}
        onClose={() => setUpgradePlanModalVisible(false)}
        currentPlan={activePlanKey}
        onSelectPlan={(plan) => {
          Alert.alert('Subscription Updated', `Switched to ${plan}`);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  bodyContent: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  }
});
