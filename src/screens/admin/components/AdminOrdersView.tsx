import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { Order } from '../../../types';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Props {
  orders: Order[];
  filteredOrders: Order[];
  orderSearch: string;
  setOrderSearch: (search: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: any) => void;
  channelFilter: 'ALL' | 'IN_SHOP' | 'ONLINE_APP';
  setChannelFilter: (filter: 'ALL' | 'IN_SHOP' | 'ONLINE_APP') => void;
  dateFilter: 'all' | 'today' | 'tomorrow' | 'week' | string;
  setDateFilter: (filter: any) => void;
  refreshing: boolean;
  onRefresh: () => void;
  onSelectOrderDetail: (order: Order) => void;
  onOpenAssignModal: (order: Order) => void;
  onOpenWhatsappModal: (order: Order) => void;
  onCreateNewOrder: () => void;
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
  shopTailors?: any[];
  formatDeliveryDate: (dateStr?: string) => string;
  getStatusMeta: (status: string) => any;
}

export default function AdminOrdersView({
  orders,
  filteredOrders,
  orderSearch,
  setOrderSearch,
  statusFilter,
  setStatusFilter,
  channelFilter,
  setChannelFilter,
  dateFilter,
  setDateFilter,
  refreshing,
  onRefresh,
  onSelectOrderDetail,
  onOpenAssignModal,
  onOpenWhatsappModal,
  onCreateNewOrder,
  onUpdateStatus,
  shopTailors = [],
  formatDeliveryDate,
  getStatusMeta
}: Props) {
  const { language } = useLanguage();

  const [customDateInput, setCustomDateInput] = useState('');
  const [statusPickerOrder, setStatusPickerOrder] = useState<Order | null>(null);
  const [naapModalOrder, setNaapModalOrder] = useState<Order | null>(null);

  // Channel Counts
  const inShopCount = useMemo(() => {
    return orders.filter(o => (o as any).orderChannel !== 'ONLINE_APP' && (o as any).channel !== 'ONLINE_APP' && !o.customerId).length;
  }, [orders]);

  const onlineCount = useMemo(() => {
    return orders.filter(o => (o as any).orderChannel === 'ONLINE_APP' || (o as any).channel === 'ONLINE_APP' || !!o.customerId).length;
  }, [orders]);

  // Quick WhatsApp Message
  const handleDirectWhatsApp = (o: Order) => {
    if (!o.customerPhone) return;
    const cleanPh = o.customerPhone.replace(/[^0-9]/g, '');
    const msg = `Namaste ${o.customerName}! Your order #${o.id} (${o.serviceName}) status: ${getStatusMeta(o.status).label}. Balance Due: ₹${o.balanceDue || 0}. Thank you for choosing us!`;
    Linking.openURL(`https://wa.me/91${cleanPh}?text=${encodeURIComponent(msg)}`).catch(() => {});
  };

  // Direct Accept Order
  const handleDirectAccept = (orderId: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(orderId, 'BOOKED');
    }
  };

  // Direct Decline Order
  const handleDirectDecline = (orderId: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(orderId, 'REJECTED');
    }
  };

  // Status Change Options for Modal
  const statusChangeOptions = [
    { key: 'BOOKED', label: 'Order Accepted', icon: '📋', desc: 'Order accepted' },
    { key: 'MEASURED', label: 'Measured', icon: '📐', desc: 'Measurements recorded' },
    { key: 'STITCHING', label: 'In Stitching', icon: '✂️', desc: 'Stitching in progress' },
    { key: 'TRIAL_READY', label: 'Ready for Trial', icon: '🪡', desc: 'Ready for trial' },
    { key: 'DELIVERED', label: 'Delivered', icon: '🚚', desc: 'Delivered to customer' },
    { key: 'REJECTED', label: 'Declined', icon: '❌', desc: 'Order declined' }
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.tabContent}
        contentContainerStyle={{ paddingBottom: 160 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6D2E0E"
            colors={['#6D2E0E']}
          />
        }
      >
        {/* ========================================================================= */}
        {/* 1. CONTROL BAR: Channel Segmented Filter (All vs In-Shop vs App Bookings) */}
        {/* ========================================================================= */}
        <View style={styles.controlBarContainer}>
          {/* Segmented Channel Buttons */}
          <View style={styles.channelSegmentRow}>
            {/* All Orders Button */}
            <TouchableOpacity
              style={[
                styles.channelSegmentBtn,
                channelFilter === 'ALL' && styles.channelSegmentBtnActive
              ]}
              onPress={() => setChannelFilter('ALL')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.channelSegmentBtnText,
                  channelFilter === 'ALL' && styles.channelSegmentBtnTextActive
                ]}
              >
                All ({orders.length})
              </Text>
            </TouchableOpacity>

            {/* In-Shop Counter Orders Button */}
            <TouchableOpacity
              style={[
                styles.channelSegmentBtn,
                channelFilter === 'IN_SHOP' && styles.channelSegmentBtnActiveInShop
              ]}
              onPress={() => setChannelFilter('IN_SHOP')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.channelSegmentBtnText,
                  channelFilter === 'IN_SHOP' && styles.channelSegmentBtnTextActiveInShop
                ]}
              >
                🏪 In-Shop ({inShopCount})
              </Text>
            </TouchableOpacity>

            {/* Online User App Bookings Button */}
            <TouchableOpacity
              style={[
                styles.channelSegmentBtn,
                channelFilter === 'ONLINE_APP' && styles.channelSegmentBtnActiveOnline
              ]}
              onPress={() => setChannelFilter('ONLINE_APP')}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.channelSegmentBtnText,
                  channelFilter === 'ONLINE_APP' && styles.channelSegmentBtnTextActiveOnline
                ]}
              >
                📱 App Bookings ({onlineCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Artisan Instant Search Bar */}
          <View style={styles.searchBarWrap}>
            <View style={styles.searchInputBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search orders, customer, phone..."
                placeholderTextColor="#A8A29E"
                value={orderSearch}
                onChangeText={setOrderSearch}
              />
              {orderSearch.length > 0 && (
                <TouchableOpacity
                  onPress={() => setOrderSearch('')}
                  style={styles.clearSearchBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearSearchBtnText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3. Date Filter Chips Bar */}
          <View style={styles.dateFilterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateFilterScroll}
            >
              {[
                { key: 'all', label: 'All' },
                { key: 'today', label: 'Today' },
                { key: 'tomorrow', label: 'Tomorrow' },
                { key: 'week', label: '7 Days' }
              ].map(d => {
                const isActive = dateFilter === d.key;
                return (
                  <TouchableOpacity
                    key={d.key}
                    style={[styles.dateChip, isActive && styles.dateChipActive]}
                    onPress={() => {
                      setDateFilter(d.key);
                      setCustomDateInput('');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dateChipText, isActive && styles.dateChipTextActive]}>
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Custom Date Input Pill */}
              <View style={[styles.dateChip, styles.customDatePill]}>
                <TextInput
                  style={styles.customDateBox}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#A8A29E"
                  value={customDateInput}
                  onChangeText={(val) => {
                    setCustomDateInput(val);
                    if (val.length === 10) setDateFilter(val);
                  }}
                />
              </View>

              {dateFilter !== 'all' && (
                <TouchableOpacity
                  style={styles.btnResetDate}
                  onPress={() => {
                    setDateFilter('all');
                    setCustomDateInput('');
                    setOrderSearch('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnResetDateText}>✕ Reset</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* 4. Filter Indicator & Header Summary Row */}
          <View style={styles.filterIndicatorRow}>
            <View style={styles.indicatorLeft}>
              <Text style={styles.filterIndicatorText}>
                {dateFilter === 'all' ? 'All Orders' : dateFilter === 'today' ? 'Today Orders' : dateFilter === 'tomorrow' ? 'Tomorrow Due' : dateFilter}
                {channelFilter === 'IN_SHOP' ? ' · In-Shop' : channelFilter === 'ONLINE_APP' ? ' · App Bookings' : ''}
                {orderSearch ? ` · "${orderSearch}"` : ''}
              </Text>
            </View>

            <View style={styles.indicatorRight}>
              <View style={styles.countBadgePill}>
                <Text style={styles.countBadgePillText}>{filteredOrders.length} orders</Text>
              </View>

              <TouchableOpacity
                style={styles.btnNewOrderQuick}
                onPress={onCreateNewOrder}
                activeOpacity={0.85}
              >
                <Text style={styles.btnNewOrderQuickText}>+ New</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 2. ORDERS LIST (Luxury Royal Atelier Cards) */}
        {/* ========================================================================= */}
        <View style={styles.ordersListContainer}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyOrdersState}>
              <Text style={{ fontSize: 36, marginBottom: 10 }}>📦</Text>
              <Text style={styles.emptyOrdersTitle}>No orders found</Text>
              <Text style={styles.emptyOrdersSub}>
                {orderSearch
                  ? 'No orders match your current search query.'
                  : 'No orders found matching the active channel and date filter.'}
              </Text>
              <TouchableOpacity
                style={styles.btnResetSearch}
                onPress={() => {
                  setDateFilter('all');
                  setChannelFilter('ALL');
                  setOrderSearch('');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.btnResetSearchText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOrders.map(o => {
              const statusMeta = getStatusMeta(o.status);
              const formattedDate = formatDeliveryDate(o.deliveryDate || o.appointmentDate);
              const isOnline = (o as any).orderChannel === 'ONLINE_APP' || o.channel === 'ONLINE_APP' || !!o.customerId;
              const hasDue = Number(o.balanceDue || 0) > 0;
              const isPending = (o.status || '').toUpperCase() === 'PENDING_APPROVAL' || statusMeta.label === 'Pending Approval';

              return (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.cleanOrderCard,
                    { borderLeftColor: statusMeta.barColor || '#F59E0B' }
                  ]}
                  onPress={() => onSelectOrderDetail(o)}
                  activeOpacity={0.88}
                >
                  {/* 1. Header Row: Order ID + Channel Badge on Left, Status Change / Accept on Right */}
                  <View style={styles.cleanCardHeader}>
                    <View style={styles.cleanCardHeaderLeft}>
                      {/* Order ID Pill */}
                      <View style={styles.cleanOrderIdBadge}>
                        <Text style={styles.cleanOrderIdText}>#{o.id}</Text>
                      </View>

                      {/* Walk-In vs Online Channel Badge */}
                      {isOnline ? (
                        <View style={styles.cleanChannelBadgeOnline}>
                          <Text style={styles.cleanChannelBadgeTextOnline}>Online</Text>
                        </View>
                      ) : (
                        <View style={styles.cleanChannelBadgeWalkIn}>
                          <Text style={styles.cleanChannelBadgeTextWalkIn}>Walk-In</Text>
                        </View>
                      )}
                    </View>

                    {/* Header Right: Direct Accept/✕ when Pending, else Interactive Status Dropdown */}
                    {isPending ? (
                      <View style={styles.directActionButtonsRow}>
                        <TouchableOpacity
                          style={styles.cleanBtnDirectAccept}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDirectAccept(o.id);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.cleanBtnDirectAcceptText}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cleanBtnDirectDecline}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDirectDecline(o.id);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.cleanBtnDirectDeclineText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.cleanStatusButton,
                          {
                            backgroundColor: statusMeta.bg,
                            borderColor: statusMeta.border
                          }
                        ]}
                        onPress={(e) => {
                          e.stopPropagation();
                          setStatusPickerOrder(o);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.cleanStatusDot, { backgroundColor: statusMeta.dot }]} />
                        <Text
                          style={[styles.cleanStatusButtonText, { color: statusMeta.text }]}
                          numberOfLines={1}
                        >
                          {statusMeta.label}
                        </Text>
                        <Text style={[styles.cleanStatusChevronText, { color: statusMeta.text }]}>▾</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* 2. Middle Row: Customer Info on Left, Due/Paid Box on Right */}
                  <View style={styles.cleanCardBody}>
                    <View style={styles.cleanCustomerCol}>
                      <Text style={styles.cleanCustomerName} numberOfLines={1}>
                        {o.customerName}
                      </Text>
                      <Text style={styles.cleanGarmentName} numberOfLines={1}>
                        {o.serviceName}
                      </Text>
                    </View>

                    <View style={styles.cleanPriceCol}>
                      {hasDue ? (
                        <View style={styles.cleanDuePillBox}>
                          <Text style={styles.cleanDuePillLabel}>DUE</Text>
                          <Text style={styles.cleanDuePillAmount}>
                            ₹{Number(o.balanceDue).toLocaleString('en-IN')}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.cleanPaidPillBox}>
                          <Text style={styles.cleanPaidPillLabel}>PAID</Text>
                          <Text style={styles.cleanPaidPillAmount}>
                            ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* 3. Footer Row: Delivery Date on Left, WhatsApp & Arrow on Right */}
                  <View style={styles.cleanCardFooter}>
                    <View style={styles.cleanDateRow}>
                      <Text style={styles.cleanDateText}>
                        Delivery: {formattedDate}
                      </Text>
                    </View>

                    <View style={styles.cleanFooterRightActions}>
                      {o.customerPhone ? (
                        <TouchableOpacity
                          style={styles.cleanBtnWhatsApp}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDirectWhatsApp(o);
                          }}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.cleanBtnWhatsAppText}>WhatsApp ›</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.cleanCardChevron}>›</Text>
                      )}
                    </View>
                  </View>

                  {/* 4. Bottom 3 Options Row: Details, Naap, Assign */}
                  <View style={styles.cardActionsRow}>
                    {/* Option 1: Details */}
                    <TouchableOpacity
                      style={styles.cardActionBtnDetails}
                      onPress={(e) => {
                        e.stopPropagation();
                        onSelectOrderDetail(o);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.cardActionBtnTextDetails}>Details</Text>
                    </TouchableOpacity>

                    {/* Option 2: Naap (Measurement Passport) */}
                    <TouchableOpacity
                      style={styles.cardActionBtnNaap}
                      onPress={(e) => {
                        e.stopPropagation();
                        setNaapModalOrder(o);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.cardActionBtnTextNaap}>Naap</Text>
                    </TouchableOpacity>

                    {/* Option 3: Assign Tailor */}
                    <TouchableOpacity
                      style={[
                        styles.cardActionBtnAssign,
                        (o.assignedTailor || o.tailorName) && styles.cardActionBtnAssignActive
                      ]}
                      onPress={(e) => {
                        e.stopPropagation();
                        onOpenAssignModal(o);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.cardActionBtnTextAssign,
                          (o.assignedTailor || o.tailorName) && styles.cardActionBtnTextAssignActive
                        ]}
                        numberOfLines={1}
                      >
                        {o.assignedTailor || o.tailorName || 'Assign Tailor'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* 3. MODAL: Status Picker Dropdown Modal */}
      {/* ========================================================================= */}
      <Modal
        visible={!!statusPickerOrder}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusPickerOrder(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setStatusPickerOrder(null)}
        >
          <View style={styles.statusPickerDrawer}>
            <View style={styles.statusPickerHeader}>
              <View>
                <Text style={styles.statusPickerTitle}>Change Order Status</Text>
                <Text style={styles.statusPickerSub}>
                  Order #{statusPickerOrder?.id} · {statusPickerOrder?.customerName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setStatusPickerOrder(null)}
                style={styles.btnCloseSheet}
              >
                <Text style={styles.btnCloseSheetText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusOptionsList}>
              {statusChangeOptions.map(opt => {
                const isSelected = (statusPickerOrder?.status || '').toUpperCase() === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.statusOptionRow, isSelected && styles.statusOptionRowActive]}
                    onPress={() => {
                      if (statusPickerOrder && onUpdateStatus) {
                        onUpdateStatus(statusPickerOrder.id, opt.key);
                      }
                      setStatusPickerOrder(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.statusOptIcon}>{opt.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.statusOptLabel, isSelected && styles.statusOptLabelActive]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.statusOptDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.selectedCheckBadge}>
                        <Text style={styles.selectedCheckText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. MODAL: Naap (Measurements) Quick-Sheet */}
      {/* ========================================================================= */}
      <Modal
        visible={!!naapModalOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setNaapModalOrder(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.naapDrawer}>
            <View style={styles.statusPickerHeader}>
              <View>
                <Text style={styles.statusPickerTitle}>📏 Naap Measurement Passport</Text>
                <Text style={styles.statusPickerSub}>
                  Client: {naapModalOrder?.customerName} · Order #{naapModalOrder?.id}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setNaapModalOrder(null)}
                style={styles.btnCloseSheet}
              >
                <Text style={styles.btnCloseSheetText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380, marginTop: 10 }}>
              {(() => {
                const naapData = (naapModalOrder as any)?.naapJson
                  ? (typeof (naapModalOrder as any).naapJson === 'string'
                    ? JSON.parse((naapModalOrder as any).naapJson)
                    : (naapModalOrder as any).naapJson)
                  : (naapModalOrder as any)?.naap || {};

                const entries = Object.entries(naapData).filter(([_, v]) => v !== undefined && v !== null && v !== '');

                if (entries.length === 0) {
                  return (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                      <Text style={{ fontSize: 32, marginBottom: 8 }}>📐</Text>
                      <Text style={{ fontFamily, fontSize: 15, fontWeight: '700', color: '#1C1917' }}>
                        No Custom Naap Recorded
                      </Text>
                      <Text style={{ fontFamily, fontSize: 12.5, color: '#78716C', textAlign: 'center', marginTop: 4 }}>
                        Using standard ready-to-wear sizing for {naapModalOrder?.serviceName}.
                      </Text>
                    </View>
                  );
                }

                return (
                  <View style={styles.naapGrid}>
                    {entries.map(([key, val]) => (
                      <View key={key} style={styles.naapGridItem}>
                        <Text style={styles.naapItemKey}>
                          {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </Text>
                        <Text style={styles.naapItemVal}>{String(val)}"</Text>
                      </View>
                    ))}
                  </View>
                );
              })()}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnFullDetails}
              onPress={() => {
                const target = naapModalOrder;
                setNaapModalOrder(null);
                if (target) onSelectOrderDetail(target);
              }}
              activeOpacity={0.88}
            >
              <Text style={styles.btnFullDetailsText}>Open Full Order Studio Details →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2'
  },
  tabContent: {
    flex: 1
  },

  // =========================================================================
  // 1. Control Bar & Filters (Executive Luxury Atelier)
  // =========================================================================
  controlBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE3D5',
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },

  // Segmented Channel Filter (All vs In-Shop vs App Bookings)
  channelSegmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  channelSegmentBtn: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1
  },
  channelSegmentBtnActive: {
    backgroundColor: '#6D2E0E',
    borderColor: '#853A14',
    shadowColor: '#3D1807',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3
  },
  channelSegmentBtnActiveInShop: {
    backgroundColor: '#6D2E0E',
    borderColor: '#853A14'
  },
  channelSegmentBtnActiveOnline: {
    backgroundColor: '#6D2E0E',
    borderColor: '#853A14'
  },
  channelSegmentBtnText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#78716C',
    textAlign: 'center'
  },
  channelSegmentBtnTextActive: {
    color: '#FEF3C7',
    fontWeight: '800'
  },
  channelSegmentBtnTextActiveInShop: {
    color: '#FEF3C7',
    fontWeight: '800'
  },
  channelSegmentBtnTextActiveOnline: {
    color: '#FEF3C7',
    fontWeight: '800'
  },

  // Search Input Wrap
  searchBarWrap: {
    marginBottom: 10
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    paddingHorizontal: 12,
    height: 42
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontFamily,
    fontSize: 13,
    color: '#1C1917',
    paddingVertical: 0
  },
  clearSearchBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EBE3D5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearSearchBtnText: {
    fontSize: 10,
    color: '#78716C',
    fontWeight: '800'
  },

  // Date Filter Bar
  dateFilterContainer: {
    marginBottom: 10
  },
  dateFilterScroll: {
    alignItems: 'center',
    gap: 6
  },
  dateChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#FDFBF7',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  dateChipActive: {
    backgroundColor: '#6D2E0E',
    borderColor: '#853A14'
  },
  dateChipText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#78716C'
  },
  dateChipTextActive: {
    color: '#FEF3C7',
    fontWeight: '800'
  },
  customDatePill: {
    paddingVertical: 2,
    paddingHorizontal: 8
  },
  customDateBox: {
    fontFamily,
    fontSize: 11,
    color: '#1C1917',
    paddingVertical: 2,
    minWidth: 84
  },
  btnResetDate: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  btnResetDateText: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626'
  },

  // Filter Indicator & Orders Header Summary
  filterIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4
  },
  indicatorLeft: {
    flex: 1,
    paddingRight: 8
  },
  filterIndicatorText: {
    fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917'
  },
  indicatorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  countBadgePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  countBadgePillText: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1D4ED8'
  },
  btnNewOrderQuick: {
    backgroundColor: '#6D2E0E',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#853A14'
  },
  btnNewOrderQuickText: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FEF3C7'
  },

  // =========================================================================
  // 2. Orders List & Cards (Exact Structure + Luxury Atelier Upgrade)
  // =========================================================================
  ordersListContainer: {
    paddingHorizontal: 16,
    paddingTop: 12
  },
  cleanOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    borderLeftWidth: 4.5,
    marginBottom: 12,
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },

  // Card Header: Order ID + Channel Badge on Left, Status Dropdown / Direct Accept on Right
  cleanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cleanCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cleanOrderIdBadge: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  cleanOrderIdText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: '#1C1917'
  },
  cleanChannelBadgeWalkIn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  cleanChannelBadgeTextWalkIn: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  },
  cleanChannelBadgeOnline: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  cleanChannelBadgeTextOnline: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8'
  },

  // Direct Accept / Decline Buttons (For Pending Approval)
  directActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cleanBtnDirectAccept: {
    backgroundColor: '#059669',
    paddingVertical: 4.5,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  cleanBtnDirectAcceptText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  cleanBtnDirectDecline: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 4.5,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  cleanBtnDirectDeclineText: {
    fontFamily,
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800'
  },

  // Clickable Status Dropdown Pill
  cleanStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 14,
    borderWidth: 1
  },
  cleanStatusDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 3.5
  },
  cleanStatusButtonText: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '800'
  },
  cleanStatusChevronText: {
    fontFamily,
    fontSize: 11,
    fontWeight: '800'
  },

  // Middle Row: Customer Info & Due/Paid Box
  cleanCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cleanCustomerCol: {
    flex: 1,
    paddingRight: 10
  },
  cleanCustomerName: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.2
  },
  cleanGarmentName: {
    fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
    marginTop: 2
  },
  cleanPriceCol: {
    alignItems: 'flex-end'
  },
  cleanDuePillBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  cleanDuePillLabel: {
    fontFamily,
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5
  },
  cleanDuePillAmount: {
    fontFamily,
    fontSize: 15,
    fontWeight: '900',
    color: '#DC2626'
  },
  cleanPaidPillBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  cleanPaidPillLabel: {
    fontFamily,
    fontSize: 9.5,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5
  },
  cleanPaidPillAmount: {
    fontFamily,
    fontSize: 15,
    fontWeight: '900',
    color: '#059669'
  },

  // Footer Row: Delivery Date on Left, WhatsApp on Right
  cleanCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
    marginBottom: 10
  },
  cleanDateRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cleanDateText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C'
  },
  cleanFooterRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  cleanBtnWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  cleanBtnWhatsAppText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800'
  },
  cleanCardChevron: {
    fontSize: 18,
    color: '#A8A29E',
    fontWeight: '700',
    marginLeft: 4
  },

  // Bottom 3 Action Buttons: Details, Naap, Assign Tailor
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4
  },
  cardActionBtnDetails: {
    flex: 1,
    backgroundColor: '#FDFBF7',
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  cardActionBtnTextDetails: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#44403C'
  },
  cardActionBtnNaap: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  cardActionBtnTextNaap: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8'
  },
  cardActionBtnAssign: {
    flex: 1.4,
    backgroundColor: '#FDFBF7',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  cardActionBtnAssignActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  cardActionBtnTextAssign: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#78716C'
  },
  cardActionBtnTextAssignActive: {
    color: '#065F46',
    fontWeight: '800'
  },

  // Empty State
  emptyOrdersState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    marginTop: 10
  },
  emptyOrdersTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
    marginBottom: 4
  },
  emptyOrdersSub: {
    fontFamily,
    fontSize: 13,
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 16
  },
  btnResetSearch: {
    backgroundColor: '#6D2E0E',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#853A14'
  },
  btnResetSearchText: {
    fontFamily,
    color: '#FEF3C7',
    fontSize: 12.5,
    fontWeight: '800'
  },

  // =========================================================================
  // 3. Status Picker Drawer Modal
  // =========================================================================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    justifyContent: 'flex-end'
  },
  statusPickerDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  statusPickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6'
  },
  statusPickerTitle: {
    fontFamily,
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1917'
  },
  statusPickerSub: {
    fontFamily,
    fontSize: 12,
    color: '#78716C',
    marginTop: 2
  },
  btnCloseSheet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  btnCloseSheetText: {
    fontSize: 13,
    color: '#78716C',
    fontWeight: '700'
  },
  statusOptionsList: {
    marginTop: 12,
    gap: 8
  },
  statusOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FDFBF7',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    gap: 12
  },
  statusOptionRowActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A'
  },
  statusOptIcon: {
    fontSize: 18
  },
  statusOptLabel: {
    fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917'
  },
  statusOptLabelActive: {
    color: '#92400E',
    fontWeight: '800'
  },
  statusOptDesc: {
    fontFamily,
    fontSize: 11,
    color: '#78716C',
    marginTop: 1
  },
  selectedCheckBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },

  // =========================================================================
  // 4. Naap Quick-Sheet Modal
  // =========================================================================
  naapDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  naapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8
  },
  naapGridItem: {
    width: '47%',
    backgroundColor: '#FDFBF7',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  naapItemKey: {
    fontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#78716C',
    letterSpacing: 0.5
  },
  naapItemVal: {
    fontFamily,
    fontSize: 16,
    fontWeight: '900',
    color: '#6D2E0E',
    marginTop: 2
  },
  btnFullDetails: {
    backgroundColor: '#6D2E0E',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#853A14'
  },
  btnFullDetailsText: {
    fontFamily,
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '800'
  }
});
