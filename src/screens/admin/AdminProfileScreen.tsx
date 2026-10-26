import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Modal,
  Alert,
  Linking,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { User, TailorShop } from '../../types';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/LanguageContext';

interface Props {
  user: User;
  adminStats: {
    totalCustomers: number;
    todayEarnings: number;
    thisMonthEarnings: number;
    totalPlatformEarnings: number;
    dueToday: number;
    pendingOrders: number;
    totalOrders: number;
  };
  tailorsCount: number;
  activeShop?: TailorShop;
  onBack: () => void;
  onLogout: () => void;
  onNavigateTab: (tab: 'dashboard' | 'orders' | 'create-order' | 'tailors' | 'services') => void;
  onUpdateUser?: (updated: { name: string; phone: string; email: string }) => void;
}

export default function AdminProfileScreen({
  user,
  adminStats,
  tailorsCount,
  activeShop,
  onBack,
  onLogout,
  onNavigateTab,
  onUpdateUser
}: Props) {
  // Personal Info State
  const [adminName, setAdminName] = useState(user?.name || (user as any)?.shopName || 'Shop Partner');
  const [adminPhone, setAdminPhone] = useState(user?.phone || '');
  const [adminEmail, setAdminEmail] = useState(user?.email || (user?.phone ? `${user.phone}@tailorc.com` : 'partner@tailorc.com'));
  const [adminDesignation, setAdminDesignation] = useState((user as any)?.role === 'TAILOR' ? 'Shop Owner' : 'Admin');
  const [hubLocation, setHubLocation] = useState(activeShop?.city ? `${activeShop.city}` : (activeShop?.area || 'Shop Location'));

  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(adminName);
  const [editPhone, setEditPhone] = useState(adminPhone);
  const [editEmail, setEditEmail] = useState(adminEmail);
  const [editDesignation, setEditDesignation] = useState(adminDesignation);
  const [editHub, setEditHub] = useState(hubLocation);

  // Preference Toggles
  const [whatsappAutomation, setWhatsappAutomation] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [soundChimes, setSoundChimes] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);

  // Language Modal
  const { language, setLanguage, currentLanguageMeta, t } = useLanguage();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Alert.alert('Required', 'Please enter a valid administrator name.');
      return;
    }
    setAdminName(editName.trim());
    setAdminPhone(editPhone.trim());
    setAdminEmail(editEmail.trim());
    setAdminDesignation(editDesignation.trim());
    setHubLocation(editHub.trim());

    if (onUpdateUser) {
      onUpdateUser({
        name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim()
      });
    }

    setEditModalVisible(false);
    Alert.alert('Saved', 'Profile details updated.');
  };

  const handleConfirmLogout = () => {
    if (Platform.OS === 'web') {
      const ok = typeof window !== 'undefined' ? window.confirm('Are you sure you want to sign out?') : true;
      if (ok) {
        onLogout();
      }
      return;
    }
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: onLogout
        }
      ]
    );
  };

  const handleContactSupport = () => {
    const msg = `Namaste! Admin ${adminName} (${adminPhone}) requesting assistance.`;
    Linking.openURL(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`);
  };

  const initials = adminName
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  return (
    <View style={styles.container}>
      {/* 1. TOP APP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.topBarTitleContainer}>
          <Text style={styles.topBarTitle}>Admin Profile</Text>
          <View style={styles.onlinePill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlinePillText}>Online</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerEditBtn}
          onPress={() => {
            setEditName(adminName);
            setEditPhone(adminPhone);
            setEditEmail(adminEmail);
            setEditDesignation(adminDesignation);
            setEditHub(hubLocation);
            setEditModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.headerEditText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. HERO PROFILE CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.avatarCrownBadge}>
                <Text style={{ fontSize: 10 }}>👑</Text>
              </View>
            </View>

            {/* User Details */}
            <View style={styles.heroInfo}>
              <View style={styles.roleBadgeGold}>
                <Text style={styles.roleBadgeGoldText}>ADMIN</Text>
              </View>
              <Text style={styles.heroName} numberOfLines={1}>
                {adminName}
              </Text>
              <Text style={styles.heroDesignation}>{adminDesignation}</Text>
              <Text style={styles.heroContact}>+91 {adminPhone.replace('+91', '').trim()}</Text>
              <Text style={styles.heroEmail}>{adminEmail}</Text>
            </View>
          </View>

          {/* Quick Edit */}
          <TouchableOpacity
            style={styles.editActionRow}
            onPress={() => {
              setEditName(adminName);
              setEditPhone(adminPhone);
              setEditEmail(adminEmail);
              setEditDesignation(adminDesignation);
              setEditHub(hubLocation);
              setEditModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.editActionText}>Edit Profile</Text>
            <Text style={styles.editActionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 3. METRICS CARDS */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={[styles.statValue, { color: colors.gold }]}>
              ₹{Number(adminStats?.totalPlatformEarnings || 16450).toLocaleString('en-IN')}
            </Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {adminStats.totalOrders || 8}
            </Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✂️</Text>
            <Text style={[styles.statValue, { color: colors.info }]}>
              {tailorsCount || 3}
            </Text>
            <Text style={styles.statLabel}>Tailors</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {adminStats.totalCustomers || 14}
            </Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        {/* 4. ATELIER OPERATIONS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>OPERATIONS</Text>
        </View>

        <View style={styles.menuGroupCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavigateTab('tailors')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 16 }}>✂️</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Tailors Directory</Text>
              <Text style={styles.menuItemSubtitle}>
                {tailorsCount || 3} partner shops
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavigateTab('services')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{ fontSize: 16 }}>🏷️</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Services & Rates</Text>
              <Text style={styles.menuItemSubtitle}>
                Catalog and pricing
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavigateTab('orders')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#ECFDF5' }]}>
              <Text style={{ fontSize: 16 }}>📋</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Orders</Text>
              <Text style={styles.menuItemSubtitle}>
                Active orders and naap
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => onNavigateTab('create-order')}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F5F3FF' }]}>
              <Text style={{ fontSize: 17 }}>＋</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>New Order</Text>
              <Text style={styles.menuItemSubtitle}>
                Create order
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 5. ATELIER INFO */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>SHOP INFO</Text>
        </View>

        <View style={styles.menuGroupCard}>
          <View style={styles.infoRowItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 16 }}>📍</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.infoRowLabel}>Shop Location</Text>
              <Text style={styles.infoRowValue}>{hubLocation}</Text>
            </View>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.infoRowItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 16 }}>🛡️</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.infoRowLabel}>Account</Text>
              <Text style={[styles.infoRowValue, { color: colors.success }]}>
                Admin
              </Text>
            </View>
            <View style={styles.activePillSmall}>
              <Text style={styles.activePillText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.infoRowItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 16 }}>🗄️</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.infoRowLabel}>App Status</Text>
              <Text style={styles.infoRowValue}>Online</Text>
            </View>
            <View style={[styles.activePillSmall, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.activePillText, { color: colors.success }]}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* 6. PREFERENCES */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>PREFERENCES</Text>
        </View>

        <View style={styles.menuGroupCard}>
          <View style={styles.switchItemRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Text style={{ fontSize: 16 }}>💬</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>WhatsApp Alerts</Text>
              <Text style={styles.menuItemSubtitle}>
                Send updates to customers
              </Text>
            </View>
            <Switch
              value={whatsappAutomation}
              onValueChange={setWhatsappAutomation}
              trackColor={{ false: '#CBD5E1', true: colors.accent }}
              thumbColor={whatsappAutomation ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.switchItemRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 16 }}>🔔</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Notifications</Text>
              <Text style={styles.menuItemSubtitle}>
                Order alerts
              </Text>
            </View>
            <Switch
              value={pushAlerts}
              onValueChange={setPushAlerts}
              trackColor={{ false: '#CBD5E1', true: colors.accent }}
              thumbColor={pushAlerts ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.switchItemRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F5F3FF' }]}>
              <Text style={{ fontSize: 16 }}>🔊</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Sound Alerts</Text>
              <Text style={styles.menuItemSubtitle}>
                Sound on actions
              </Text>
            </View>
            <Switch
              value={soundChimes}
              onValueChange={setSoundChimes}
              trackColor={{ false: '#CBD5E1', true: colors.accent }}
              thumbColor={soundChimes ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <View style={styles.menuDivider} />

          <View style={styles.switchItemRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#ECFDF5' }]}>
              <Text style={{ fontSize: 16 }}>🔒</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Biometric Lock</Text>
              <Text style={styles.menuItemSubtitle}>
                App security
              </Text>
            </View>
            <Switch
              value={biometricLock}
              onValueChange={setBiometricLock}
              trackColor={{ false: '#CBD5E1', true: colors.accent }}
              thumbColor={biometricLock ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLangModalVisible(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 16 }}>🌐</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Language / భాష</Text>
              <Text style={styles.menuItemSubtitle}>{currentLanguageMeta.nativeName} ({currentLanguageMeta.label})</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 7. SUPPORT */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>SUPPORT</Text>
        </View>

        <View style={styles.menuGroupCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleContactSupport}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 16 }}>💬</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Support</Text>
              <Text style={styles.menuItemSubtitle}>
                Help via WhatsApp
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Tailoring Guide',
                '1. Upper body: Length, Shoulder, Sleeves, Armhole, Chest, Waist, Neck.\n2. Lower body: Length, Waist, Hip, Thighs, Knee, Bottom.\n3. Fabric: Check before cutting.\n4. Trial: Ready 48h before delivery.'
              );
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 16 }}>📖</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>Tailoring Guide</Text>
              <Text style={styles.menuItemSubtitle}>
                Measurement standards
              </Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <View style={styles.infoRowItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 16 }}>ℹ️</Text>
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.infoRowLabel}>App Version</Text>
              <Text style={styles.infoRowValue}>v1.0.0</Text>
            </View>
            <Text style={styles.versionBadge}>PROD</Text>
          </View>
        </View>

        {/* 8. SIGN OUT */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleConfirmLogout}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, marginRight: 6 }}>🚪</Text>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Tailor App • v1.0
        </Text>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalHeading}>Edit Profile</Text>
                <Text style={styles.modalSubheading}>
                  Update contact & designation
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mobile Phone *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email Address *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter official email address"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Designation</Text>
                <TextInput
                  style={styles.formInput}
                  value={editDesignation}
                  onChangeText={setEditDesignation}
                  placeholder="Enter role / designation"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Hub Location</Text>
                <TextInput
                  style={styles.formInput}
                  value={editHub}
                  onChangeText={setEditHub}
                  placeholder="Enter atelier hub location"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveProfile}
              >
                <Text style={styles.modalSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE SELECTOR MODAL */}
      <Modal visible={langModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: 360 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setLangModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {SUPPORTED_LANGUAGES.map(item => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.langOption,
                    isSelected && styles.langOptionActive
                  ]}
                  onPress={() => {
                    setLanguage(item.code);
                    setLangModalVisible(false);
                    Alert.alert('Language Updated', `Display language set to ${item.nativeName} (${item.label})`);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <View>
                      <Text
                        style={[
                          styles.langOptionText,
                          isSelected && styles.langOptionTextActive
                        ]}
                      >
                        {item.nativeName} {item.nativeName !== item.label ? `(${item.label})` : ''}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748B' }}>{item.subtitle}</Text>
                    </View>
                  </View>
                  {isSelected && <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  // Top App Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) + 8 : 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10
  },
  backArrow: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20
  },
  backText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  topBarTitleContainer: {
    alignItems: 'center'
  },
  topBarTitle: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  onlinePillText: {
    fontFamily,
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600'
  },
  headerEditBtn: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D97706'
  },
  headerEditText: {
    fontFamily,
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '700'
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36
  },
  // Hero Card
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 3
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarInitials: {
    fontFamily,
    color: '#FEF3C7',
    fontSize: 24,
    fontWeight: '800'
  },
  avatarCrownBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#D97706'
  },
  heroInfo: {
    flex: 1,
    marginLeft: 16
  },
  roleBadgeGold: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D97706',
    marginBottom: 4
  },
  roleBadgeGoldText: {
    fontFamily,
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800'
  },
  heroName: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800'
  },
  heroDesignation: {
    fontFamily,
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2
  },
  heroContact: {
    fontFamily,
    color: '#CBD5E1',
    fontSize: 15,
    marginTop: 2
  },
  heroEmail: {
    fontFamily,
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 1
  },
  editActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  editActionText: {
    fontFamily,
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '700'
  },
  editActionChevron: {
    fontFamily,
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '800'
  },
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 1
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  statValue: {
    fontFamily,
    fontSize: 22,
    fontWeight: '800'
  },
  statLabel: {
    fontFamily,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3
  },
  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 6,
    paddingHorizontal: 2
  },
  sectionHeading: {
    fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#475569'
  },
  // Menu Group Cards
  menuGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 1
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  infoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  switchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  menuItemContent: {
    flex: 1
  },
  menuItemTitle: {
    fontFamily,
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A'
  },
  menuItemSubtitle: {
    fontFamily,
    fontSize: 14,
    color: '#64748B',
    marginTop: 2
  },
  infoRowLabel: {
    fontFamily,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500'
  },
  infoRowValue: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2
  },
  menuChevron: {
    fontFamily,
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '800',
    marginLeft: 6
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 70
  },
  activePillSmall: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  activePillText: {
    fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706'
  },
  versionBadge: {
    fontFamily,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8
  },
  logoutButtonText: {
    fontFamily,
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800'
  },
  footerNote: {
    fontFamily,
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 18
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContent: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 14,
    marginBottom: 16
  },
  modalHeading: {
    fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalSubheading: {
    fontFamily,
    fontSize: 14,
    color: '#64748B',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseBtnText: {
    fontFamily,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '800'
  },
  formGroup: {
    marginBottom: 14
  },
  formLabel: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6
  },
  formInput: {
    fontFamily,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '400',
    color: '#0F172A',
    minHeight: 48
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalCancelBtnText: {
    fontFamily,
    color: '#475569',
    fontSize: 15,
    fontWeight: '700'
  },
  modalSaveBtn: {
    flex: 2,
    backgroundColor: '#D97706',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalSaveBtnText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  langOptionActive: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7'
  },
  langOptionText: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A'
  },
  langOptionTextActive: {
    fontFamily,
    color: '#B45309'
  },

  // Subscription Profile Card Styles
  subscriptionProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16
  },
  subscriptionProfileTop: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  planIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)'
  },
  subscriptionPlanName: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  activeStatusPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  activeStatusPillText: {
    fontFamily,
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669'
  },
  subscriptionShopName: {
    fontFamily,
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    fontWeight: '600'
  },
  subscriptionPriceText: {
    fontFamily,
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  subscriptionDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14
  },
  subscriptionFeaturesList: {
    gap: 6,
    marginBottom: 14
  },
  subFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  subFeatureCheck: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '800'
  },
  subFeatureText: {
    fontFamily,
    fontSize: 12,
    color: '#475569'
  },
  btnUpgradeSubscription: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3
  },
  btnUpgradeSubscriptionText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2
  }
});
