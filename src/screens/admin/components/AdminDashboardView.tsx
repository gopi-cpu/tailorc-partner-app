import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { Order, TailorShop, Service } from '../../../types';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Props {
  activeShopObj: TailorShop;
  activePlanMeta: any;
  orders: Order[];
  shopOrders: Order[];
  shopTailors: any[];
  services: Service[];
  totalUniqueCustomers: number;
  dueTodayCount: number;
  totalDueAmount: number;
  inShopRevenue: number;
  onlineAppRevenue: number;
  adminStats: any;
  refreshing: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: 'orders' | 'create-order' | 'tailors' | 'services' | 'profile') => void;
  setDateFilter: (filter: 'all' | 'today' | 'tomorrow' | 'week') => void;
  setChannelFilter: (filter: 'ALL' | 'IN_SHOP' | 'ONLINE_APP') => void;
  onOpenUpgradeModal: () => void;
  onSelectOrderDetail: (order: Order) => void;
  formatDeliveryDate: (dateStr?: string) => string;
}

export default function AdminDashboardView({
  activeShopObj,
  activePlanMeta,
  orders,
  shopOrders,
  shopTailors,
  services,
  totalUniqueCustomers,
  dueTodayCount,
  totalDueAmount,
  inShopRevenue,
  onlineAppRevenue,
  adminStats,
  refreshing,
  onRefresh,
  onNavigateTab,
  setDateFilter,
  setChannelFilter,
  onOpenUpgradeModal,
  onSelectOrderDetail,
  formatDeliveryDate
}: Props) {
  const { language } = useLanguage();

  const loc = (en: string, te: string, hi: string, ta: string, kn: string) => {
    if (language === 'te') return te;
    if (language === 'hi') return hi;
    if (language === 'ta') return ta;
    if (language === 'kn') return kn;
    return en;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#78350F']} />}
    >
      {/* 1. 8 EXECUTIVE METRIC CARDS (2x4 Balanced Grid) */}
      <View style={styles.metricsContainer}>
        {/* Row 1 */}
        <View style={styles.metricsRow}>
          {/* Card 1: Customers */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.8}
          >
            <Text style={styles.metricNumber}>{totalUniqueCustomers}</Text>
            <Text style={styles.metricLabel}>{loc('Customers', 'కస్టమర్లు', 'ग्राहक', 'வாடிக்கையாளர்கள்', 'ಗ್ರಾಹಕರು')}</Text>
            <Text style={styles.metricSub}>{loc('Total registered', 'నమోదైన వారు', 'कुल पंजीकृत', 'பதிவு செய்தவர்கள்', 'ಒಟ್ಟು ನೋಂದಾಯಿತ')}</Text>
          </TouchableOpacity>

          {/* Card 2: Active Orders */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.8}
          >
            <Text style={styles.metricNumber}>{orders.length}</Text>
            <Text style={styles.metricLabel}>{loc('Active Orders', 'యాక్టివ్ ఆర్డర్లు', 'सक्रिय ऑर्डर', 'செயலில் உள்ளவை', 'ಸಕ್ರಿಯ ಆರ್ಡರ್‌ಗಳು')}</Text>
            <Text style={styles.metricSub}>{loc('In stitching', 'కుట్టు పనిలో ఉన్నవి', 'सिलाई में', 'தையலில் உள்ளது', 'ಹೊಲಿಗೆಯಲ್ಲಿವೆ')}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.metricsRow}>
          {/* Card 3: Due Today */}
          <TouchableOpacity
            style={[styles.metricCard, dueTodayCount > 0 && { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
            onPress={() => {
              setDateFilter('today');
              onNavigateTab('orders');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.metricNumber, dueTodayCount > 0 && { color: '#DC2626' }]}>
              {dueTodayCount}
            </Text>
            <Text style={styles.metricLabel}>{loc('Due Today', 'ఈరోజు డెలివరీలు', 'आज डिलीवरी', 'இன்றைய டெலிவரி', 'ಇಂದಿನ ಡೆಲಿವರಿ')}</Text>
            <Text style={styles.metricSub}>{loc('Pending trials', 'ట్రయల్స్ బాకీ', 'ट्रायल बाकी', 'நிலுவை சோதனைகள்', 'ಬಾಕಿ ಟ್ರಯಲ್ಸ್')}</Text>
          </TouchableOpacity>

          {/* Card 4: Pending Dues */}
          <TouchableOpacity
            style={[styles.metricCard, totalDueAmount > 0 && { borderColor: '#FED7AA' }]}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.8}
          >
            <Text style={[styles.metricNumber, { color: totalDueAmount > 0 ? '#C2410C' : '#0F172A' }]}>
              ₹{totalDueAmount.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>{loc('Pending Balance', 'బాకీ మొత్తం', 'बकाया राशि', 'நிலுவைத் தொகை', 'ಬಾಕಿ ಮೊತ್ತ')}</Text>
            <Text style={styles.metricSub}>{loc('To collect', 'వసూలు చేయాల్సినది', 'लेना बाकी', 'வசூலிக்க வேண்டியது', 'ವಸೂಲಿ ಮಾಡಬೇಕಿರುವುದು')}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 */}
        <View style={styles.metricsRow}>
          {/* Card 5: Shop Sales */}
          <TouchableOpacity
            style={[styles.metricCard, { borderColor: '#FED7AA' }]}
            onPress={() => {
              setChannelFilter('IN_SHOP');
              onNavigateTab('orders');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.metricNumber, { color: '#B45309' }]}>
              ₹{inShopRevenue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>{loc('Shop Sales', 'షాప్ అమ్మకాలు', 'दुकान बिक्री', 'கடை விற்பனை', 'ಅಂಗಡಿ ಮಾರಾಟ')}</Text>
            <Text style={styles.metricSub}>{loc('Direct counter', 'కౌంటర్ బిల్లులు', 'काउंटर बिक्री', 'நேரடி விற்பனை', 'ಕೌಂಟರ್ ಮಾರಾಟ')}</Text>
          </TouchableOpacity>

          {/* Card 6: App Orders */}
          <TouchableOpacity
            style={[styles.metricCard, { borderColor: '#BFDBFE' }]}
            onPress={() => {
              setChannelFilter('ONLINE_APP');
              onNavigateTab('orders');
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.metricNumber, { color: '#1D4ED8' }]}>
              ₹{onlineAppRevenue.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>{loc('App Orders', 'యాప్ ఆర్డర్లు', 'ऐप ऑर्डर', 'ஆப் ஆர்டர்கள்', 'ಆ್ಯಪ್ ಆರ್ಡರ್‌ಗಳು')}</Text>
            <Text style={styles.metricSub}>{loc('Online customers', 'ఆన్‌లైన్ కస్టమర్లు', 'ऑनलाइन ग्राहक', 'ஆன்லைன் வாடிக்கையாளர்கள்', 'ಆನ್‌ಲೈನ್ ಗ್ರಾಹಕರು')}</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4 */}
        <View style={styles.metricsRow}>
          {/* Card 7: This Month */}
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>
              ₹{Number(adminStats?.thisMonthEarnings || adminStats?.todayEarnings || 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>{loc('This Month', 'ఈ నెల ఆదాయం', 'इस महीने', 'இந்த மாதம்', 'ಈ ತಿಂಗಳು')}</Text>
            <Text style={styles.metricSub}>{loc('Monthly earnings', 'నెల మొత్తం', 'मासिक कमाई', 'மாத வருவாய்', 'ಮಾಸಿಕ ಆದಾಯ')}</Text>
          </View>

          {/* Card 8: Total Earnings */}
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>
              ₹{Number(adminStats?.totalPlatformEarnings || 0).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.metricLabel}>{loc('Total Earnings', 'మొత్తం ఆదాయం', 'कुल कमाई', 'மொத்த வருவாய்', 'ಒಟ್ಟು ಗಳಿಕೆ')}</Text>
            <Text style={styles.metricSub}>{loc('All time', 'మొత్తం రికార్డు', 'अब तक का कुल', 'இதுவரை', 'ಎಲ್ಲಾ ಸಮಯದ ಒಟ್ಟು')}</Text>
          </View>
        </View>
      </View>

      {/* 3. QUICK ACTIONS & SHORTCUTS */}
      <View style={styles.sectionWrap}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{loc('Quick Actions', 'త్వరిత చర్యలు', 'त्वरित क्रियाएं', 'விரைவு செயல்கள்', 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು')}</Text>
          <Text style={styles.sectionSubtitle}>{loc('Create orders, record measurements and manage shop', 'ఆర్డర్లు, కొలతలు & షాప్ నిర్వహణ', 'ऑर्डर बनाएं, नाप लें और दुकान चलाएं', 'ஆர்டர்கள், அளவுகள் & கடை மேலாண்மை', 'ಆರ್ಡರ್‌ಗಳು, ಅಳತೆಗಳು & ಅಂಗಡಿ ನಿರ್ವಹಣೆ')}</Text>
        </View>

        {/* Dual Primary Action Cards */}
        <View style={styles.dualActionRow}>
          {/* Action 1: New Order */}
          <TouchableOpacity
            style={styles.primaryActionCard}
            onPress={() => onNavigateTab('create-order')}
            activeOpacity={0.85}
          >
            <View style={styles.actionTopRow}>
              <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Text style={{ fontSize: 18 }}>🪡</Text>
              </View>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>NEW</Text>
              </View>
            </View>

            <Text style={styles.actionTitle}>{loc('New Order', 'కొత్త ఆర్డర్', 'नया ऑर्डर', 'புதிய ஆர்டர்', 'ಹೊಸ ಆರ್ಡರ್')}</Text>
            <Text style={styles.actionDesc}>{loc('Record customer measurements, advance & bill', 'కొలతలు, అడ్వాన్స్ & బిల్ నమోదు చేయండి', 'नाप, अग्रिम भुगतान और बिल दर्ज करें', 'அளவு, முன்பணம் & பில் பதிவு செய்யவும்', 'ಅಳತೆ, ಮುಂಗಡ & ಬಿಲ್ ನಮೂದಿಸಿ')}</Text>

            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{loc('+ Create Order →', '+ కొత్త ఆర్డర్ →', '+ नया ऑर्डर →', '+ புதிய ஆர்டர் →', '+ ಹೊಸ ಆರ್ಡರ್ →')}</Text>
            </View>
          </TouchableOpacity>

          {/* Action 2: Add Customer */}
          <TouchableOpacity
            style={styles.secondaryActionCard}
            onPress={() => onNavigateTab('create-order')}
            activeOpacity={0.85}
          >
            <View style={styles.actionTopRow}>
              <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Text style={{ fontSize: 18 }}>👤</Text>
              </View>
              <View style={[styles.actionBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Text style={[styles.actionBadgeText, { color: '#1D4ED8' }]}>CUSTOMER</Text>
              </View>
            </View>

            <Text style={styles.actionTitle}>{loc('Add Customer', 'కస్టమర్‌ను జోడించండి', 'ग्राहक जोड़ें', 'வாடிக்கையாளரைச் சேர்', 'ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ')}</Text>
            <Text style={styles.actionDesc}>{loc('Save customer details and measurements', 'కస్టమర్ వివరాలు మరియు కొలతలు సేవ్ చేయండి', 'ग्राहक का विवरण और नाप सहेजें', 'வாடிக்கையாளர் விவரம் மற்றும் அளவுகளை சேமிக்கவும்', 'ಗ್ರಾಹಕರ ವಿವರ ಮತ್ತು ಅಳತೆಗಳನ್ನು ಉಳಿಸಿ')}</Text>

            <View style={[styles.actionBtn, { backgroundColor: '#0F172A' }]}>
              <Text style={styles.actionBtnText}>{loc('+ Add Customer →', '+ కస్టమర్ జోడించండి →', '+ ग्राहक जोड़ें →', '+ வாடிக்கையாளர் →', '+ ಗ್ರಾಹಕರನ್ನು ಸೇರಿಸಿ →')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4 Operations Hub Chips */}
        <View style={styles.operationsDock}>
          <TouchableOpacity
            style={styles.operationChip}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.8}
          >
            <Text style={styles.operationIcon}>📦</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>{loc('Orders', 'ఆర్డర్లు', 'ऑर्डर', 'ஆர்டர்கள்', 'ಆರ್ಡರ್‌ಗಳು')}</Text>
              <Text style={styles.operationSub}>
                {loc(`${orders.length} Active`, `${orders.length} యాక్టివ్`, `${orders.length} सक्रिय`, `${orders.length} செயலில்`, `${orders.length} ಸಕ್ರಿಯ`)}
              </Text>
            </View>
            <Text style={styles.operationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.operationChip}
            onPress={() => onNavigateTab('tailors')}
            activeOpacity={0.8}
          >
            <Text style={styles.operationIcon}>✂️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>{loc('Tailors', 'టైలర్లు', 'दर्जी', 'தையல்காரர்கள்', 'ಟೈಲರ್‌ಗಳು')}</Text>
              <Text style={styles.operationSub}>
                {loc(`${shopTailors.length} Staff`, `${shopTailors.length} టైలర్లు`, `${shopTailors.length} स्टाफ`, `${shopTailors.length} நபர்கள்`, `${shopTailors.length} ಸಿಬ್ಬಂದಿ`)}
              </Text>
            </View>
            <Text style={styles.operationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.operationChip}
            onPress={() => onNavigateTab('services')}
            activeOpacity={0.8}
          >
            <Text style={styles.operationIcon}>🏷️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>{loc('Services', 'సేవలు', 'सेवाएं', 'சேவைகள்', 'ಸೇವೆಗಳು')}</Text>
              <Text style={styles.operationSub}>
                {loc(`${services.length} Listed`, `${services.length} సేవలు`, `${services.length} सेवाएं`, `${services.length} சேவைகள்`, `${services.length} ಲಭ್ಯ`)}
              </Text>
            </View>
            <Text style={styles.operationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.operationChip}
            onPress={() => onNavigateTab('profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.operationIcon}>⚙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.operationTitle}>{loc('Settings', 'సెట్టింగ్‌లు', 'सेटिंग्स', 'அமைப்புகள்', 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು')}</Text>
              <Text style={styles.operationSub}>
                {loc('Shop profile', 'షాప్ ప్రొఫైల్', 'दुकान प्रोफ़ाइल', 'கடை விவரம்', 'ಅಂಗಡಿ ಪ್ರೊಫೈಲ್')}
              </Text>
            </View>
            <Text style={styles.operationArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. RECENT ORDERS LIST */}
      <View style={styles.sectionWrap}>
        <View style={styles.recentOrdersHeader}>
          <View>
            <Text style={styles.sectionTitle}>{loc('Recent Orders', 'ఇటీవలి ఆర్డర్లు', 'हाल के ऑर्डर', 'சமீபத்திய ஆர்டர்கள்', 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು')}</Text>
            <Text style={styles.sectionSubtitle}>{loc('Latest customer orders and status', 'తాజా ఆర్డర్లు మరియు స్థితి', 'नवीनतम ऑर्डर और स्थिति', 'சமீபத்திய ஆர்டர்கள் மற்றும் நிலை', 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಸ್ಥಿತಿ')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.7}
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllBtnText}>{loc('View all →', 'అన్నీ చూడండి →', 'सभी देखें →', 'அனைத்தையும் பார்க்க →', 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ →')}</Text>
          </TouchableOpacity>
        </View>

        {shopOrders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 28, marginBottom: 6 }}>🪡</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first order to start tracking.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => onNavigateTab('create-order')}
            >
              <Text style={styles.emptyBtnText}>+ New Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {shopOrders.slice(0, 5).map((ord) => (
              <TouchableOpacity
                key={ord.id}
                style={styles.recentOrderCard}
                onPress={() => onSelectOrderDetail(ord)}
                activeOpacity={0.8}
              >
                <View style={styles.recentOrderTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentOrderCustomer}>{ord.customerName}</Text>
                    <Text style={styles.recentOrderService}>{ord.serviceName} • #{ord.id}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillText}>{ord.status}</Text>
                  </View>
                </View>

                <View style={styles.recentOrderBottom}>
                  <Text style={styles.recentOrderDate}>📅 Due: {formatDeliveryDate(ord.deliveryDate)}</Text>
                  <Text style={styles.recentOrderPrice}>₹{ord.totalAmount}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110
  },
  metricsContainer: {
    marginBottom: 14,
    marginTop: 2
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1
  },
  metricNumber: {
    fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2
  },
  metricLabel: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2
  },
  metricSub: {
    fontFamily,
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: -0.1
  },
  sectionWrap: {
    marginBottom: 18
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  sectionSubtitle: {
    fontFamily,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  primaryActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  secondaryActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  actionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  actionBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B45309'
  },
  actionTitle: {
    fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  actionSubTitle: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    marginBottom: 4
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 12,
    minHeight: 30
  },
  actionBtn: {
    backgroundColor: '#78350F',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  operationsDock: {
    gap: 8
  },
  operationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12
  },
  operationIcon: {
    fontSize: 20
  },
  operationTitle: {
    fontFamily,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A'
  },
  operationSub: {
    fontSize: 11,
    color: '#64748B'
  },
  operationArrow: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '700'
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  viewAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309'
  },
  recentOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1
  },
  recentOrderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  recentOrderCustomer: {
    fontFamily,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A'
  },
  recentOrderService: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1
  },
  statusPill: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E'
  },
  recentOrderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8
  },
  recentOrderDate: {
    fontSize: 11.5,
    color: '#64748B'
  },
  recentOrderPrice: {
    fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  emptyTitle: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14
  },
  emptyBtn: {
    backgroundColor: '#78350F',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700'
  }
});
