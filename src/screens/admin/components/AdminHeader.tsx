import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { TailorShop, User } from '../../../types';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Props {
  user: User;
  activeShopObj: TailorShop;
  activeTab: string;
  previousTab: string;
  navigatedFromHome: boolean;
  activePlanMeta: any;
  ordersCount: number;
  tailorsCount: number;
  servicesCount: number;
  onBackToPrevious: () => void;
  onOpenProfile: () => void;
  onOpenUpgradeModal?: () => void;
}

export default function AdminHeader({
  user,
  activeShopObj,
  activeTab,
  previousTab,
  navigatedFromHome,
  activePlanMeta,
  ordersCount,
  tailorsCount,
  servicesCount,
  onBackToPrevious,
  onOpenProfile,
  onOpenUpgradeModal
}: Props) {
  const { language } = useLanguage();

  const loc = (en: string, te: string, hi: string, ta: string, kn: string) => {
    if (language === 'te') return te;
    if (language === 'hi') return hi;
    if (language === 'ta') return ta;
    if (language === 'kn') return kn;
    return en;
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return loc('Shop Dashboard', 'షాప్ డ్యాష్‌బోర్డ్', 'दुकान डैशबोर्ड', 'கடை டாஷ்போர்டு', 'ಅಂಗಡಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್');
      case 'orders':
        return `${ordersCount} ${loc('Active Orders', 'యాక్టివ్ ఆర్డర్లు', 'सक्रिय ऑर्डर', 'செயலில் உள்ள ஆர்டர்கள்', 'ಸಕ್ರಿಯ ಆರ್ಡರ್‌ಗಳು')}`;
      case 'create-order':
        return loc('New Order & Measurements', 'కొత్త ఆర్డర్ & కొలతలు', 'नया ऑर्डर और नाप', 'புதிய ஆர்டர் & அளவு', 'ಹೊಸ ಆರ್ಡರ್ & ಅಳತೆ');
      case 'tailors':
        return `${tailorsCount} ${loc('Tailors & Staff', 'టైలర్లు & సిబ్బంది', 'दर्जी और स्टाफ', 'தையல்காரர்கள் & பணியாளர்கள்', 'ಟೈಲರ್‌ಗಳು & ಸಿಬ್ಬಂದಿ')}`;
      case 'services':
        return `${servicesCount} ${loc('Services & Pricing', 'సేవలు & ధరలు', 'सेवाएं और दरें', 'சேவைகள் & கட்டணங்கள்', 'ಸೇವೆಗಳು & ದರಗಳು')}`;
      default:
        return loc('Shop Management', 'షాప్ నిర్వహణ', 'दुकान प्रबंधन', 'கடை மேலாண்மை', 'ಅಂಗಡಿ ನಿರ್ವಹಣೆ');
    }
  };

  const isChildScreen = activeTab !== 'dashboard' && navigatedFromHome;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerBrandWrap}>
          {isChildScreen ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBackToPrevious}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: '#0F172A', fontWeight: '800' }}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.brandJewel}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 }}>TC</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Text style={styles.brandTitle} numberOfLines={1}>
                {activeShopObj?.name || (user as any)?.shopName || 'Tailor Shop'}
              </Text>
              {activeShopObj?.area ? (
                <View style={styles.areaBadge}>
                  <View style={styles.areaDot} />
                  <Text style={styles.areaText}>{activeShopObj.area}</Text>
                </View>
              ) : null}
              {activePlanMeta?.name ? (
                <TouchableOpacity
                  style={styles.planBadge}
                  onPress={onOpenUpgradeModal}
                  activeOpacity={0.7}
                >
                  <Text style={styles.planBadgeText}>⭐ {activePlanMeta.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Text style={styles.brandSubtitle} numberOfLines={1}>
              {getHeaderSubtitle()}
            </Text>
          </View>
        </View>

        {/* Profile Avatar Button */}
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={onOpenProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>
            {(user?.name || activeShopObj?.name || 'A')[0].toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) + 8 : 14,
    paddingBottom: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerBrandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  brandJewel: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  brandTitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontFamily,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
    letterSpacing: -0.1
  },
  areaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6
  },
  areaDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D97706'
  },
  areaText: {
    fontFamily,
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.1
  },
  planBadge: {
    backgroundColor: '#FEF9C3',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE047'
  },
  planBadgeText: {
    fontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#854D0E',
    letterSpacing: 0.1
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FEF3C7'
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
