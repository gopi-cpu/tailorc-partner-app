import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { TailorShop, CustomMeasurementField, Order, User } from '../../../types';
import { api } from '../../../services/api';

interface Props {
  activeShopObj: TailorShop;
  shopTailors: any[];
  shops?: TailorShop[];
  setShops?: React.Dispatch<React.SetStateAction<TailorShop[]>>;
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  user?: User;
  onOrderCreated?: (newOrder: Order) => void;
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services') => void;
  upperBodyFields?: any[];
  lowerBodyFields?: any[];
}

const defaultUpperBodyFields = [
  { id: 'u_len', en: 'Length', hi: 'लम्बाई', icon: require('../../../../assets/measurements/length.png'), def: '15.0' },
  { id: 'u_chs', en: 'Chest', hi: 'सीना / छाती', icon: require('../../../../assets/measurements/chest.png'), def: '36.0' },
  { id: 'u_wst2', en: 'Waist', hi: 'कमर', icon: require('../../../../assets/measurements/waist.png'), def: '30.0' },
  { id: 'u_shd', en: 'Shoulder', hi: 'तीरा / शोल्डर', icon: require('../../../../assets/measurements/shoulder.png'), def: '14.5' },
  { id: 'u_nck', en: 'Neck', hi: 'गला', icon: require('../../../../assets/measurements/neck.png'), def: '7.0' },
  { id: 'u_slv', en: 'Sleeves length', hi: 'बाजू लम्बाई', icon: require('../../../../assets/measurements/sleeves.png'), def: '10.5' },
  { id: 'u_bcp', en: 'Bicep', hi: 'बाजू घेरा', icon: require('../../../../assets/measurements/bicep.png'), def: '12.0' },
  { id: 'u_elw', en: 'Elbow', hi: 'कोहनी', icon: require('../../../../assets/measurements/elbow.png'), def: '10.0' },
  { id: 'u_wst', en: 'Wrist', hi: 'कलाई / मोहरी', icon: require('../../../../assets/measurements/wrist.png'), def: '6.5' },
  { id: 'u_hlf', en: 'Half sleeves', hi: 'आधी बाजू', icon: require('../../../../assets/measurements/half_sleeves.png'), def: '6.0' }
];

const defaultLowerBodyFields = [
  { id: 'l_len', en: 'Length', hi: 'कुल लम्बाई', icon: require('../../../../assets/measurements/length.png'), def: '38.0' },
  { id: 'l_wst', en: 'Waist', hi: 'कमर बेल्ट', icon: require('../../../../assets/measurements/waist.png'), def: '32.0' },
  { id: 'l_hip', en: 'Hip', hi: 'हिप / सीट', icon: require('../../../../assets/measurements/hip.png'), def: '38.5' },
  { id: 'l_uth', en: 'Upper thighs', hi: 'ऊपरी पट', icon: require('../../../../assets/measurements/thigh.png'), def: '23.0' },
  { id: 'l_lth', en: 'Lower thigh', hi: 'निचला पट', icon: require('../../../../assets/measurements/thigh.png'), def: '19.0' },
  { id: 'l_kne', en: 'Knee', hi: 'घुटना', icon: require('../../../../assets/measurements/knee.png'), def: '16.0' },
  { id: 'l_clf', en: 'Calf', hi: 'पिंडली', icon: require('../../../../assets/measurements/calf.png'), def: '14.0' },
  { id: 'l_btm', en: 'Bottom', hi: 'मोहरी / हेरा', icon: require('../../../../assets/measurements/bottom.png'), def: '14.5' }
];

export default function AdminCreateOrderView({
  activeShopObj,
  shopTailors = [],
  shops = [],
  setShops,
  setOrders,
  user,
  onOrderCreated,
  onNavigateTab,
  upperBodyFields = defaultUpperBodyFields,
  lowerBodyFields = defaultLowerBodyFields
}: Props) {
  // Tailor Assignment State
  const [tailorDropdownOpen, setTailorDropdownOpen] = useState(false);
  const [cosAssignedShop, setCosAssignedShop] = useState('');

  // Customer State
  const [cosCustName, setCosCustName] = useState('');
  const [cosCustPhone, setCosCustPhone] = useState('');

  // Item & Pricing State
  const [cosItemName, setCosItemName] = useState('');
  const [cosPrice, setCosPrice] = useState('');
  const [cosFabricCost, setCosFabricCost] = useState('');
  const [cosDiscount, setCosDiscount] = useState('');
  const [cosQty, setCosQty] = useState('1');
  const [cosTotalAmount, setCosTotalAmount] = useState('0');
  const [cosAdvancePaid, setCosAdvancePaid] = useState('0');
  const [cosDeliveryDate, setCosDeliveryDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [cosSpecialNotes, setCosSpecialNotes] = useState('');

  // Measurements State
  const [cosNaapTab, setCosNaapTab] = useState<'upper' | 'lower'>('upper');
  const [cosUpperNaap, setCosUpperNaap] = useState<Record<string, string>>({
    Length: '15.0',
    Shoulder: '14.5',
    'Sleeves length': '10.5',
    Bicep: '12.0',
    Elbow: '10.0',
    Wrist: '6.5',
    'Half sleeves': '6.0',
    Chest: '36.0',
    Waist: '30.0',
    Neck: '7.0'
  });
  const [cosLowerNaap, setCosLowerNaap] = useState<Record<string, string>>({
    Length: '38.0',
    Waist: '32.0',
    Hip: '38.5',
    'Upper thighs': '23.0',
    'Lower thigh': '19.0',
    Knee: '16.0',
    Calf: '14.0',
    Bottom: '14.5'
  });

  // Custom Measurement Modal State
  const [customMeasurementModalVisible, setCustomMeasurementModalVisible] = useState(false);
  const [newMeasurementEn, setNewMeasurementEn] = useState('');
  const [newMeasurementHi, setNewMeasurementHi] = useState('');
  const [newMeasurementBodyType, setNewMeasurementBodyType] = useState<'upper' | 'lower'>('upper');
  const [newMeasurementDef, setNewMeasurementDef] = useState('6.5');
  const [isSavingMeasurement, setIsSavingMeasurement] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Shop Custom Measurements extraction
  const shopCustomMeasurements = useMemo(() => {
    if (!activeShopObj || !activeShopObj.customMeasurements) return [];
    if (Array.isArray(activeShopObj.customMeasurements)) return activeShopObj.customMeasurements;
    try {
      return JSON.parse((activeShopObj as any).customMeasurementsJson || '[]');
    } catch {
      return [];
    }
  }, [activeShopObj]);

  const dynamicUpperBodyFields = useMemo(() => {
    const customUpper = shopCustomMeasurements
      .filter((m: any) => m.bodyType === 'upper')
      .map((m: any) => ({ ...m, isCustom: true }));
    return [...upperBodyFields, ...customUpper];
  }, [upperBodyFields, shopCustomMeasurements]);

  const dynamicLowerBodyFields = useMemo(() => {
    const customLower = shopCustomMeasurements
      .filter((m: any) => m.bodyType === 'lower')
      .map((m: any) => ({ ...m, isCustom: true }));
    return [...lowerBodyFields, ...customLower];
  }, [lowerBodyFields, shopCustomMeasurements]);

  // Helpers
  const handleQuickFillCustomer = () => {
    const demos = [
      { name: 'Kavya Reddy', phone: '+91 98490 12345' },
      { name: 'Ananya Varma', phone: '+91 97000 54321' },
      { name: 'Sunita Sharma', phone: '+91 99887 66554' }
    ];
    const pick = demos[Math.floor(Math.random() * demos.length)];
    setCosCustName(pick.name);
    setCosCustPhone(pick.phone);
    Alert.alert('Quick Fill', `Customer ${pick.name} loaded.`);
  };

  const handleAutoFillNaap = () => {
    const updatedUpper: Record<string, string> = {};
    dynamicUpperBodyFields.forEach(f => {
      updatedUpper[f.en] = (f.def ? f.def : (32 + Math.random() * 8).toFixed(1)) + '"';
    });
    setCosUpperNaap(updatedUpper);

    const updatedLower: Record<string, string> = {};
    dynamicLowerBodyFields.forEach(f => {
      updatedLower[f.en] = (f.def ? f.def : (30 + Math.random() * 10).toFixed(1)) + '"';
    });
    setCosLowerNaap(updatedLower);

    Alert.alert('Measurements Filled', 'Standard measurements loaded.');
  };

  const updateCalculatedTotal = (newPrice: string, newFabric: string, newDiscount: string, newQty: string) => {
    const p = parseFloat(newPrice) || 0;
    const f = parseFloat(newFabric) || 0;
    const d = parseFloat(newDiscount) || 0;
    const q = parseInt(newQty) || 1;
    const calculated = Math.max(0, (p + f) * q - d);
    setCosTotalAmount(String(calculated));
  };

  const handlePriceChange = (val: string) => {
    setCosPrice(val);
    updateCalculatedTotal(val, cosFabricCost, cosDiscount, cosQty);
  };

  const handleFabricCostChange = (val: string) => {
    setCosFabricCost(val);
    updateCalculatedTotal(cosPrice, val, cosDiscount, cosQty);
  };

  const handleDiscountChange = (val: string) => {
    setCosDiscount(val);
    updateCalculatedTotal(cosPrice, cosFabricCost, val, cosQty);
  };

  const handleQtyChange = (val: string) => {
    setCosQty(val);
    updateCalculatedTotal(cosPrice, cosFabricCost, cosDiscount, val);
  };

  // Add Custom Measurement
  const handleSaveCustomMeasurement = async () => {
    const name = newMeasurementEn.trim();
    if (!name) {
      Alert.alert('Field Name Required', 'Please enter a measurement name in English.');
      return;
    }

    if (!activeShopObj || !activeShopObj.id) {
      Alert.alert('No Active Shop', 'Please select an active shop.');
      return;
    }

    const newField: CustomMeasurementField = {
      id: 'cm_' + Date.now().toString().slice(-6),
      en: name,
      hi: newMeasurementHi.trim() || name,
      bodyType: newMeasurementBodyType,
      def: newMeasurementDef.trim() || '0.0'
    };

    const currentCustom = Array.isArray(activeShopObj.customMeasurements)
      ? [...activeShopObj.customMeasurements]
      : [];

    if (
      currentCustom.some(m => m.en.toLowerCase() === name.toLowerCase()) ||
      upperBodyFields.some(f => f.en.toLowerCase() === name.toLowerCase()) ||
      lowerBodyFields.some(f => f.en.toLowerCase() === name.toLowerCase())
    ) {
      Alert.alert('Duplicate Field', `Measurement field "${name}" already exists.`);
      return;
    }

    const updatedList = [...currentCustom, newField];
    setIsSavingMeasurement(true);

    try {
      await api.updateShopMeasurements(activeShopObj.id, updatedList);
      if (setShops) {
        setShops(prev => prev.map(s => {
          if (s.id === activeShopObj.id || s.name === activeShopObj.name) {
            return { ...s, customMeasurements: updatedList, customMeasurementsJson: JSON.stringify(updatedList) };
          }
          return s;
        }));
      }

      if (newMeasurementBodyType === 'upper') {
        setCosUpperNaap(prev => ({ ...prev, [name]: newMeasurementDef.trim() || '0.0' }));
      } else {
        setCosLowerNaap(prev => ({ ...prev, [name]: newMeasurementDef.trim() || '0.0' }));
      }

      setCustomMeasurementModalVisible(false);
      setNewMeasurementEn('');
      setNewMeasurementHi('');
      setNewMeasurementDef('6.5');
      Alert.alert('Measurement Field Added', `"${name}" added to ${activeShopObj.name}!`);
    } catch (err: any) {
      Alert.alert('Saved Locally', `"${name}" added to current session.`);
      setCustomMeasurementModalVisible(false);
    } finally {
      setIsSavingMeasurement(false);
    }
  };

  const handleDeleteCustomMeasurement = (fieldId: string, fieldName: string) => {
    Alert.alert(
      'Delete Measurement Field',
      `Are you sure you want to delete "${fieldName}" from ${activeShopObj?.name || 'this atelier'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const currentCustom = activeShopObj.customMeasurements || [];
            const updatedList = currentCustom.filter((m: any) => m.id !== fieldId);
            try {
              await api.updateShopMeasurements(activeShopObj.id, updatedList);
              if (setShops) {
                setShops(prev => prev.map(s => {
                  if (s.id === activeShopObj.id || s.name === activeShopObj.name) {
                    return { ...s, customMeasurements: updatedList, customMeasurementsJson: JSON.stringify(updatedList) };
                  }
                  return s;
                }));
              }
              Alert.alert('Measurement Deleted', `"${fieldName}" removed.`);
            } catch (err: any) {
              Alert.alert('Removed', `"${fieldName}" removed from current session.`);
            }
          }
        }
      ]
    );
  };

  // Submit Order
  const handleAdminCreateOrder = async () => {
    const itemName = cosItemName.trim();
    const priceStr = cosPrice.trim();
    let custName = cosCustName.trim();
    let custPhone = cosCustPhone.trim();

    if (!itemName) {
      Alert.alert('Item Name Required', 'Please enter the item or garment name.');
      return;
    }
    if (!priceStr || isNaN(Number(priceStr)) || Number(priceStr) < 0) {
      Alert.alert('Price Required', 'Please enter a valid stitching/item price.');
      return;
    }

    if (!custName) custName = 'Walk-in Customer';
    if (!custPhone) custPhone = '+91 98490 12345';

    setIsSubmittingOrder(true);

    const chosenTailor = cosAssignedShop
      ? shopTailors.find(t => t.name === cosAssignedShop) || shops.find(s => s.name === cosAssignedShop)
      : null;
    const tailorName = activeShopObj?.name || (user as any)?.shop?.name || chosenTailor?.shopName || 'Tailor Shop';
    const assignedTailorName = chosenTailor ? chosenTailor.name : undefined;
    const tailorShopId = (activeShopObj?.id && activeShopObj.id !== 'my-shop')
      ? activeShopObj.id
      : (chosenTailor?.tailorShopId || (user as any)?.tailorShopId || (user as any)?.shop?.id || undefined);

    const p = parseFloat(priceStr) || 0;
    const f = parseFloat(cosFabricCost) || 0;
    const d = parseFloat(cosDiscount) || 0;
    const q = parseInt(cosQty) || 1;
    const computedTotal = Math.max(0, (p + f) * q - d);
    const total = cosTotalAmount !== '' && !isNaN(Number(cosTotalAmount)) ? parseFloat(cosTotalAmount) : computedTotal;
    const advance = parseFloat(cosAdvancePaid) || 0;
    const balance = Math.max(0, total - advance);

    const breakdownParts = [];
    if (p > 0) breakdownParts.push(`Price: ₹${p}`);
    if (f > 0) breakdownParts.push(`Fabric Cost: ₹${f}`);
    if (d > 0) breakdownParts.push(`Discount: -₹${d}`);
    if (q > 1) breakdownParts.push(`Qty: ${q}`);
    const breakdownText = breakdownParts.length > 0 ? `[Pricing: ${breakdownParts.join(', ')}]` : '';
    const combinedNotes = [cosSpecialNotes.trim(), breakdownText].filter(Boolean).join('\n') || 'In-shop order';

    const orderId = 'TC' + Math.floor(10000 + Math.random() * 90000);
    const apptDate = cosDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const newOrderObj: Order = {
      id: orderId,
      customerName: custName,
      customerPhone: custPhone,
      tailorShopId: tailorShopId || '',
      tailorName: tailorName,
      assignedTailor: assignedTailorName,
      serviceName: itemName,
      modelName: 'Custom Stitching',
      qty: q,
      totalAmount: total,
      advancePaid: advance,
      balanceDue: balance,
      status: 'BOOKED',
      appointmentDate: apptDate,
      appointmentTime: '11:00 AM',
      paymentMode: advance > 0 ? `Advance Paid (₹${advance})` : 'Cash on Visit',
      naap: { ...cosUpperNaap, ...cosLowerNaap },
      specialNotes: combinedNotes,
      orderChannel: 'IN_SHOP',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await api.createOrder({
        id: orderId,
        customerName: custName,
        customerPhone: custPhone,
        tailorShopId,
        tailorName,
        assignedTailor: assignedTailorName,
        serviceName: itemName,
        modelName: 'Custom Stitching',
        qty: q,
        totalAmount: total,
        advancePaid: advance,
        balanceDue: balance,
        deliveryDate: apptDate,
        appointmentDate: apptDate,
        appointmentTime: '11:00 AM',
        paymentMode: advance > 0 ? `Advance Paid (₹${advance})` : 'Cash on Visit',
        naap: { ...cosUpperNaap, ...cosLowerNaap },
        specialNotes: combinedNotes,
        channel: 'IN_SHOP',
        status: 'CONFIRMED'
      });

      const finalOrder = res?.order || newOrderObj;

      if (setOrders) {
        setOrders(prev => [finalOrder, ...prev.filter(o => o.id !== finalOrder.id)]);
      }
      if (onOrderCreated) {
        onOrderCreated(finalOrder);
      }

      // Reset form
      setCosCustName('');
      setCosCustPhone('');
      setCosAssignedShop('');
      setCosItemName('');
      setCosPrice('');
      setCosFabricCost('');
      setCosDiscount('');
      setCosQty('1');
      setCosTotalAmount('0');
      setCosAdvancePaid('0');
      setCosSpecialNotes('');

      Alert.alert('✓ Order Created!', `Order #${finalOrder.id} saved successfully.`);
      onNavigateTab('orders');
    } catch (err: any) {
      if (setOrders) {
        setOrders(prev => [newOrderObj, ...prev.filter(o => o.id !== newOrderObj.id)]);
      }
      if (onOrderCreated) {
        onOrderCreated(newOrderObj);
      }
      Alert.alert('✓ Order Created', `Order #${newOrderObj.id} saved successfully.`);
      onNavigateTab('orders');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.tabContent}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* 1. Assign to Tailor */}
        <View style={styles.cardBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={styles.cardBoxTitle}>1. Assign to Tailor</Text>
            <View style={styles.badgePillInfo}>
              <Text style={styles.badgeTextInfo}>Optional</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12, fontWeight: '500' }}>
            Select a tailor to assign this order to (optional).
          </Text>

          {/* Select Box / Dropdown Trigger */}
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              tailorDropdownOpen && styles.dropdownTriggerActive,
              { minHeight: 56, paddingVertical: 10 }
            ]}
            onPress={() => setTailorDropdownOpen(!tailorDropdownOpen)}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: cosAssignedShop ? '#FEF3C7' : '#F1F5F9',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ fontSize: 18 }}>✂️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {cosAssignedShop ? 'Assigned Tailor' : 'Assign Tailor'}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, marginTop: 1 }} numberOfLines={1}>
                  {cosAssignedShop ? cosAssignedShop : 'Unassigned'}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {cosAssignedShop ? (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setCosAssignedShop('');
                  }}
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    backgroundColor: '#FEE2E2',
                    borderRadius: 6
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: colors.danger }}>✕ Clear</Text>
                </TouchableOpacity>
              ) : null}
              <View style={styles.dropdownChevronWrap}>
                <Text style={styles.dropdownChevronText}>{tailorDropdownOpen ? '▲' : '▼'}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Select Box Dropdown Menu */}
          {tailorDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {/* Option 1: In-House Atelier (Unassigned) */}
              <TouchableOpacity
                style={[
                  styles.dropdownOptionItem,
                  !cosAssignedShop && styles.dropdownOptionItemActive
                ]}
                onPress={() => {
                  setCosAssignedShop('');
                  setTailorDropdownOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dropdownOptionName, !cosAssignedShop && styles.dropdownOptionNameActive]}>
                      Unassigned
                    </Text>
                    <Text style={styles.dropdownOptionMeta}>
                      General queue · Assign tailor later
                    </Text>
                  </View>
                </View>
                {!cosAssignedShop && (
                  <View style={styles.badgeSoloPill}>
                    <Text style={styles.badgeSoloText}>✓ Active</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Option 2..N: Tailors working in this particular shop */}
              {shopTailors.map(t => {
                const isSelected = cosAssignedShop === t.name;
                return (
                  <TouchableOpacity
                    key={t.id || t.name}
                    style={[
                      styles.dropdownOptionItem,
                      isSelected && styles.dropdownOptionItemActive
                    ]}
                    onPress={() => {
                      setCosAssignedShop(t.name);
                      setTailorDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text style={[styles.dropdownOptionName, isSelected && styles.dropdownOptionNameActive]}>
                            {t.name}
                          </Text>
                          <View style={styles.badgeSoloPill}>
                            <Text style={styles.badgeSoloText}>{t.role || 'Tailor'}</Text>
                          </View>
                        </View>
                        <Text style={styles.dropdownOptionMeta}>
                          {t.specialties || 'Cutting & Stitching'} · Base: ₹{t.baseRate || 450}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.badgeSoloPill}>
                        <Text style={styles.badgeSoloText}>✓ Assigned</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Selected Notice Banner */}
          {cosAssignedShop ? (
            <View style={[styles.assignedTailorNotice, { marginTop: 10 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Text style={styles.assignedTailorNoticeText} numberOfLines={1}>
                  Order will be assigned to <Text style={{ fontWeight: '800' }}>{cosAssignedShop}</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => setCosAssignedShop('')}>
                <Text style={styles.assignedTailorClearBtn}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* 2. Customer Details */}
        <View style={styles.cardBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.cardBoxTitle}>2. Customer</Text>
            <TouchableOpacity onPress={handleQuickFillCustomer}>
              <Text style={styles.quickFillBtnText}>Quick Fill</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Customer Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter customer name"
              placeholderTextColor="#94A3B8"
              value={cosCustName}
              onChangeText={setCosCustName}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Phone Number</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter 10-digit phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={cosCustPhone}
              onChangeText={setCosCustPhone}
            />
          </View>
        </View>

        {/* 3. Item Details & Pricing */}
        <View style={styles.cardBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.cardBoxTitle}>3. Item & Pricing</Text>
            <View style={styles.itemBadgeSimple}>
              <Text style={styles.itemBadgeSimpleText}>Custom Order</Text>
            </View>
          </View>

          {/* Item Name */}
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Item Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter item name..."
              placeholderTextColor="#94A3B8"
              value={cosItemName}
              onChangeText={setCosItemName}
            />
          </View>

          {/* Financial Inputs: Price, Fabric Cost, Discount, Quantity */}
          <View style={styles.pricingInputGrid}>
            {/* Row 1: Price and Fabric Cost */}
            <View style={styles.pricingInputRow}>
              <View style={styles.pricingInputCol}>
                <Text style={styles.formLabel}>Price (₹) *</Text>
                <View style={styles.currencyInputWrap}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cosPrice}
                    onChangeText={handlePriceChange}
                  />
                </View>
              </View>

              <View style={styles.pricingInputCol}>
                <Text style={styles.formLabel}>
                  Fabric Cost (₹) <Text style={styles.optionalLabel}>(Optional)</Text>
                </Text>
                <View style={styles.currencyInputWrap}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cosFabricCost}
                    onChangeText={handleFabricCostChange}
                  />
                </View>
              </View>
            </View>

            {/* Row 2: Discount and Quantity */}
            <View style={[styles.pricingInputRow, { marginTop: 12 }]}>
              <View style={styles.pricingInputCol}>
                <Text style={styles.formLabel}>Discount (₹)</Text>
                <View style={styles.currencyInputWrap}>
                  <Text style={[styles.currencySymbol, { color: colors.danger }]}>-₹</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cosDiscount}
                    onChangeText={handleDiscountChange}
                  />
                </View>
              </View>

              <View style={styles.pricingInputCol}>
                <Text style={styles.formLabel}>Quantity</Text>
                <View style={styles.currencyInputWrap}>
                  <Text style={styles.currencySymbol}>#</Text>
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="1"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={cosQty}
                    onChangeText={handleQtyChange}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Dynamic Calculated Summary Banner */}
          <View style={styles.pricingSummaryBox}>
            <View style={styles.pricingSummaryHeader}>
              <Text style={styles.pricingSummaryTitle}>Calculated Total</Text>
              <Text style={styles.pricingSummaryAmount}>
                ₹{Math.max(0, ((parseFloat(cosPrice) || 0) + (parseFloat(cosFabricCost) || 0)) * (parseInt(cosQty) || 1) - (parseFloat(cosDiscount) || 0))}
              </Text>
            </View>
            <Text style={styles.pricingSummaryFormula}>
              {`[Price ₹${parseFloat(cosPrice) || 0}${parseFloat(cosFabricCost) > 0 ? ` + Fabric ₹${parseFloat(cosFabricCost)}` : ''}] × Qty ${parseInt(cosQty) || 1}${parseFloat(cosDiscount) > 0 ? ` - Discount ₹${parseFloat(cosDiscount)}` : ''}`}
            </Text>
          </View>
        </View>

        {/* 4. Measurements */}
        <View style={styles.sectionHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>4. Measurements ({activeShopObj?.name || 'Shop'})</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.btnAddCustomNaapBtn}
              onPress={() => {
                setNewMeasurementBodyType(cosNaapTab === 'upper' ? 'upper' : 'lower');
                setCustomMeasurementModalVisible(true);
              }}
            >
              <Text style={styles.btnAddCustomNaapBtnText}>+ Add Field</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAutoFillNaap}>
              <Text style={styles.sectionAction}>Auto Fill</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.naapTabToggleRow}>
          <TouchableOpacity
            style={[styles.naapTabBtn, cosNaapTab === 'upper' && styles.naapTabBtnActive]}
            onPress={() => setCosNaapTab('upper')}
          >
            <Text style={[styles.naapTabBtnText, cosNaapTab === 'upper' && styles.naapTabBtnTextActive]}>
              Upper Body ({dynamicUpperBodyFields.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.naapTabBtn, cosNaapTab === 'lower' && styles.naapTabBtnActive]}
            onPress={() => setCosNaapTab('lower')}
          >
            <Text style={[styles.naapTabBtnText, cosNaapTab === 'lower' && styles.naapTabBtnTextActive]}>
              Lower Body ({dynamicLowerBodyFields.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13.5, color: colors.textMuted, fontWeight: '700' }}>
              {cosNaapTab === 'upper' ? 'Upper Body Profile (Inches)' : 'Lower Body Profile (Inches)'}
            </Text>
            {shopCustomMeasurements.filter((m: any) => m.bodyType === cosNaapTab).length > 0 && (
              <Text style={{ fontSize: 11.5, color: '#2563EB', fontWeight: '700' }}>
                {shopCustomMeasurements.filter((m: any) => m.bodyType === cosNaapTab).length} Shop Custom
              </Text>
            )}
          </View>
          <View style={styles.naapGrid}>
            {(cosNaapTab === 'upper' ? dynamicUpperBodyFields : dynamicLowerBodyFields).map(f => {
              const currentVal = cosNaapTab === 'upper' ? cosUpperNaap[f.en] || f.def : cosLowerNaap[f.en] || f.def;
              const isCustom = (f as any).isCustom;
              return (
                <View key={f.id} style={[styles.naapFieldItem, isCustom && { borderColor: '#BFDBFE', backgroundColor: '#F8FAFC' }]}>
                  <View style={styles.naapHeaderRow}>
                    <View style={styles.naapIconBadge}>
                      {f.icon ? (
                        <Image source={f.icon} style={styles.naapLogoImage} resizeMode="contain" />
                      ) : (
                        <Text style={{ fontSize: 16 }}>📐</Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={styles.naapFieldLabel} numberOfLines={1}>{f.en}</Text>
                        {isCustom && (
                          <View style={styles.shopCustomBadge}>
                            <Text style={styles.shopCustomBadgeText}>Custom</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.naapFieldHindi}>{f.hi || ''}</Text>
                    </View>
                    {isCustom && (
                      <TouchableOpacity
                        style={styles.deleteCustomNaapBtn}
                        onPress={() => handleDeleteCustomMeasurement(f.id, f.en)}
                      >
                        <Text style={{ fontSize: 13, color: colors.danger, fontWeight: '800' }}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.naapInputRow}>
                    <TextInput
                      style={styles.naapFieldInput}
                      keyboardType="numeric"
                      value={String(currentVal || '').replace('"', '')}
                      onChangeText={(val) => {
                        if (cosNaapTab === 'upper') {
                          setCosUpperNaap({ ...cosUpperNaap, [f.en]: val });
                        } else {
                          setCosLowerNaap({ ...cosLowerNaap, [f.en]: val });
                        }
                      }}
                    />
                    <Text style={styles.naapUnitBadge}>in</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 5. Pricing & Schedule */}
        <View style={styles.cardBox}>
          <Text style={styles.cardBoxTitle}>5. Payment & Date</Text>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Total Amount (₹)</Text>
            <TextInput style={styles.formInput} keyboardType="numeric" value={cosTotalAmount} onChangeText={setCosTotalAmount} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Advance Paid (₹)</Text>
            <TextInput style={styles.formInput} keyboardType="numeric" value={cosAdvancePaid} onChangeText={setCosAdvancePaid} />
          </View>
          <View style={styles.balanceDueRow}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>Balance Due:</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.accentHover }}>
              ₹{Math.max(0, (parseFloat(cosTotalAmount) || 0) - (parseFloat(cosAdvancePaid) || 0))}
            </Text>
          </View>
          <View style={[styles.formRow, { marginTop: 10 }]}>
            <Text style={styles.formLabel}>Delivery Date</Text>
            <TextInput style={styles.formInput} value={cosDeliveryDate} onChangeText={setCosDeliveryDate} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, { height: 50 }]}
              multiline
              placeholder="Special instructions"
              value={cosSpecialNotes}
              onChangeText={setCosSpecialNotes}
            />
          </View>
        </View>

        {/* CTA Submit Button */}
        <View style={{ paddingHorizontal: 18, marginBottom: 26 }}>
          <TouchableOpacity
            style={[styles.btnPrimary, isSubmittingOrder && { opacity: 0.7 }]}
            onPress={handleAdminCreateOrder}
            disabled={isSubmittingOrder}
            activeOpacity={0.85}
          >
            {isSubmittingOrder ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.btnPrimaryText}>Creating Order...</Text>
              </View>
            ) : (
              <Text style={styles.btnPrimaryText}>Create Order</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 95 }} />
      </ScrollView>

      {/* MODAL: ADD SHOP CUSTOM MEASUREMENT FIELD */}
      <Modal visible={customMeasurementModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCategory}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.modalTitle}>+ Add Measurement Field</Text>
                <Text style={styles.modalSubtitle}>
                  Saved for {activeShopObj?.name || 'your shop'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCustomMeasurementModalVisible(false)}
                style={[styles.modalControlBtn, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}
              >
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.danger }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Preset Badges */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted, marginBottom: 6, marginTop: 4 }}>
              Quick Presets (Tap to Fill):
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 14, paddingVertical: 2 }}>
              {[
                { en: 'Front Neck Depth', hi: 'आगे का गला', type: 'upper', def: '6.5' },
                { en: 'Back Neck Depth', hi: 'पीछे का गला', type: 'upper', def: '9.5' },
                { en: 'Armhole / Mudha', hi: 'मुड्ढा / आर्महोल', type: 'upper', def: '16.0' },
                { en: 'Bust Point / Apex', hi: 'डॉट पॉइंट', type: 'upper', def: '10.0' },
                { en: 'Cross Back', hi: 'बैक तीरा', type: 'upper', def: '14.0' },
                { en: 'Inseam / Fork', hi: 'आसन / लटक', type: 'lower', def: '11.5' },
                { en: 'Ankle Opening', hi: 'एंकल घेरा', type: 'lower', def: '12.0' }
              ].map(preset => (
                <TouchableOpacity
                  key={preset.en}
                  style={styles.measurementPresetPill}
                  onPress={() => {
                    setNewMeasurementEn(preset.en);
                    setNewMeasurementHi(preset.hi);
                    setNewMeasurementBodyType(preset.type as 'upper' | 'lower');
                    setNewMeasurementDef(preset.def);
                  }}
                >
                  <Text style={styles.measurementPresetPillText}>+ {preset.en}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Body Type Selector */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Category *</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <TouchableOpacity
                  style={[styles.modalBodyTypeBtn, newMeasurementBodyType === 'upper' && styles.modalBodyTypeBtnActive]}
                  onPress={() => setNewMeasurementBodyType('upper')}
                >
                  <Text style={[styles.modalBodyTypeBtnText, newMeasurementBodyType === 'upper' && styles.modalBodyTypeBtnTextActive]}>
                    Upper Body (Blouse / Kurti)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBodyTypeBtn, newMeasurementBodyType === 'lower' && styles.modalBodyTypeBtnActive]}
                  onPress={() => setNewMeasurementBodyType('lower')}
                >
                  <Text style={[styles.modalBodyTypeBtnText, newMeasurementBodyType === 'lower' && styles.modalBodyTypeBtnTextActive]}>
                    Lower Body (Pants / Salwar)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Measurement Name in English */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Measurement Name (English) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Front Neck Depth, Apex Point, Armhole"
                placeholderTextColor="#94A3B8"
                value={newMeasurementEn}
                onChangeText={setNewMeasurementEn}
              />
            </View>

            {/* Measurement Name in Hindi */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Hindi / Local Label (Optional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., आगे का गला / मुड्ढा"
                placeholderTextColor="#94A3B8"
                value={newMeasurementHi}
                onChangeText={setNewMeasurementHi}
              />
            </View>

            {/* Default Value in Inches */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Default Value (Inches)</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                placeholder="e.g., 6.5"
                placeholderTextColor="#94A3B8"
                value={newMeasurementDef}
                onChangeText={setNewMeasurementDef}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.btnOutlineSecondary, { flex: 1 }]}
                onPress={() => setCustomMeasurementModalVisible(false)}
              >
                <Text style={styles.btnOutlineSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, { flex: 1.6 }]}
                onPress={handleSaveCustomMeasurement}
                disabled={isSavingMeasurement}
              >
                {isSavingMeasurement ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ActivityIndicator size="small" color="#FFF" />
                    <Text style={styles.btnPrimaryText}>Saving...</Text>
                  </View>
                ) : (
                  <Text style={styles.btnPrimaryText}>Save Field</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#FAF7F2'
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EBE3D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  cardBoxTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  badgePillInfo: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  badgeTextInfo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB'
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  dropdownTriggerActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF'
  },
  dropdownChevronWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropdownChevronText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '800'
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  dropdownOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  dropdownOptionItemActive: {
    backgroundColor: '#FEF3C7'
  },
  dropdownOptionName: {
    fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary
  },
  dropdownOptionNameActive: {
    color: '#92400E'
  },
  dropdownOptionMeta: {
    fontFamily,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2
  },
  badgeSoloPill: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  badgeSoloText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E'
  },
  assignedTailorNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  assignedTailorNoticeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600'
  },
  assignedTailorClearBtn: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.danger
  },
  quickFillBtnText: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.accentHover
  },
  formRow: {
    marginBottom: 12
  },
  formLabel: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 5
  },
  formInput: {
    fontFamily,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary
  },
  itemBadgeSimple: {
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.1)'
  },
  itemBadgeSimpleText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  pricingInputGrid: {
    marginBottom: 6
  },
  pricingInputRow: {
    flexDirection: 'row',
    gap: 12
  },
  pricingInputCol: {
    flex: 1
  },
  optionalLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: colors.textMuted
  },
  currencyInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    minHeight: 46
  },
  currencySymbol: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6
  },
  currencyInput: {
    fontFamily,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    paddingVertical: 8
  },
  pricingSummaryBox: {
    marginTop: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 12
  },
  pricingSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pricingSummaryTitle: {
    fontFamily,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#166534'
  },
  pricingSummaryAmount: {
    fontFamily,
    fontSize: 19,
    fontWeight: '800',
    color: '#15803D'
  },
  pricingSummaryFormula: {
    fontFamily,
    fontSize: 11.5,
    color: '#166534',
    marginTop: 3,
    fontWeight: '500'
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 10
  },
  sectionTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary
  },
  btnAddCustomNaapBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  btnAddCustomNaapBtnText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB'
  },
  sectionAction: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.accentHover
  },
  naapTabToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    padding: 4,
    gap: 6
  },
  naapTabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center'
  },
  naapTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  naapTabBtnText: {
    fontFamily,
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textMuted
  },
  naapTabBtnTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  naapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  naapFieldItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0'
  },
  naapHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  naapIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  naapLogoImage: {
    width: 28,
    height: 28,
    borderRadius: 6
  },
  naapFieldLabel: {
    fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary
  },
  naapFieldHindi: {
    fontFamily,
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.accentHover,
    marginTop: 1
  },
  shopCustomBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4
  },
  shopCustomBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  deleteCustomNaapBtn: {
    padding: 4
  },
  naapInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingRight: 8
  },
  naapFieldInput: {
    fontFamily,
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    minHeight: 38
  },
  naapUnitBadge: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted
  },
  balanceDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderStyle: 'dashed'
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  btnPrimaryText: {
    fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContentCategory: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  modalTitle: {
    fontFamily,
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary
  },
  modalSubtitle: {
    fontFamily,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2
  },
  modalControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  measurementPresetPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  measurementPresetPillText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  modalBodyTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBodyTypeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#FEF3C7'
  },
  modalBodyTypeBtnText: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.textMuted
  },
  modalBodyTypeBtnTextActive: {
    color: '#92400E',
    fontWeight: '800'
  },
  btnOutlineSecondary: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC'
  },
  btnOutlineSecondaryText: {
    fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#475569'
  }
});
