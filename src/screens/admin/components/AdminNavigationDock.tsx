import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { useLanguage } from '../../../i18n/LanguageContext';

interface Props {
  activeTab: 'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services' | 'profile';
  canListServices: boolean;
  canSellSarees: boolean;
  onSelectTab: (tab: 'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services') => void;
}

export default function AdminNavigationDock({
  activeTab,
  canListServices,
  canSellSarees,
  onSelectTab
}: Props) {
  const { language } = useLanguage();

  const loc = (en: string, te: string, hi: string, ta: string, kn: string) => {
    if (language === 'te') return te;
    if (language === 'hi') return hi;
    if (language === 'ta') return ta;
    if (language === 'kn') return kn;
    return en;
  };

  if (activeTab === 'profile') return null;

  return (
    <View style={styles.floatingDockWrapper} pointerEvents="box-none">
      <View style={styles.bottomNavBar}>
        {/* Tab 1: Overview */}
        <TouchableOpacity
          style={[styles.navTabItem, activeTab === 'dashboard' && styles.navTabItemActive]}
          onPress={() => onSelectTab('dashboard')}
          activeOpacity={0.7}
        >
          {activeTab === 'dashboard' && <View style={styles.activeTabGlowPill} />}
          <Text style={[styles.navIcon, activeTab === 'dashboard' && styles.navIconActive]}>📊</Text>
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>
            {loc('Overview', 'అవలోకనం', 'अवलोकन', 'கண்ணோட்டம்', 'ಅವಲೋಕನ')}
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Orders */}
        <TouchableOpacity
          style={[styles.navTabItem, activeTab === 'orders' && styles.navTabItemActive]}
          onPress={() => onSelectTab('orders')}
          activeOpacity={0.7}
        >
          {activeTab === 'orders' && <View style={styles.activeTabGlowPill} />}
          <Text style={[styles.navIcon, activeTab === 'orders' && styles.navIconActive]}>📦</Text>
          <Text style={[styles.navText, activeTab === 'orders' && styles.navTextActive]}>
            {loc('Orders', 'ఆర్డర్లు', 'ऑर्डर', 'ஆர்டர்கள்', 'ಆರ್ಡರ್‌ಗಳು')}
          </Text>
        </TouchableOpacity>

        {/* Center Action Button: New Order */}
        <TouchableOpacity
          style={styles.centerActionItem}
          onPress={() => onSelectTab('create-order')}
          activeOpacity={0.8}
        >
          <View style={styles.btnCircle}>
            <Text style={styles.btnCirclePlus}>＋</Text>
          </View>
          <Text style={[styles.centerActionText, activeTab === 'create-order' && styles.centerActionTextActive]}>
            {loc('New Order', 'కొత్త ఆర్డర్', 'नया ऑर्डर', 'புதிய ஆர்டர்', 'ಹೊಸ ಆರ್ಡರ್')}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Tailors */}
        <TouchableOpacity
          style={[styles.navTabItem, activeTab === 'tailors' && styles.navTabItemActive]}
          onPress={() => onSelectTab('tailors')}
          activeOpacity={0.7}
        >
          {activeTab === 'tailors' && <View style={styles.activeTabGlowPill} />}
          <Text style={[styles.navIcon, activeTab === 'tailors' && styles.navIconActive]}>✂️</Text>
          <Text style={[styles.navText, activeTab === 'tailors' && styles.navTextActive]}>
            {loc('Tailors', 'టైలర్లు', 'दर्जी', 'தையல்காரர்கள்', 'ಟೈಲರ್‌ಗಳು')}
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Services */}
        <TouchableOpacity
          style={[styles.navTabItem, activeTab === 'services' && styles.navTabItemActive]}
          onPress={() => onSelectTab('services')}
          activeOpacity={0.7}
        >
          {activeTab === 'services' && <View style={styles.activeTabGlowPill} />}
          <Text style={[styles.navIcon, activeTab === 'services' && styles.navIconActive]}>🏷️</Text>
          <Text style={[styles.navText, activeTab === 'services' && styles.navTextActive]}>
            {loc('Services', 'సేవలు', 'सेवाएं', 'சேவைகள்', 'ಸೇವೆಗಳು')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingDockWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    zIndex: 999
  },
  bottomNavBar: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16
  },
  navTabItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    borderRadius: 16,
    position: 'relative'
  },
  navTabItemActive: {
    backgroundColor: 'rgba(254, 243, 199, 0.45)'
  },
  activeTabGlowPill: {
    position: 'absolute',
    top: -2,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accentHover
  },
  centerActionItem: {
    alignItems: 'center',
    flex: 1,
    marginTop: -16
  },
  btnCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8
  },
  btnCirclePlus: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: -2
  },
  centerActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4
  },
  centerActionTextActive: {
    color: '#B45309',
    fontWeight: '800'
  },
  navIcon: {
    fontSize: 20
  },
  navIconActive: {
    transform: [{ scale: 1.12 }]
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4
  },
  navTextActive: {
    color: '#B45309',
    fontWeight: '800'
  }
});
