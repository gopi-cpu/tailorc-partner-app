import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { api, setAuthToken } from '../services/api';
import { User } from '../types';
import TailorRegisterModal from './TailorRegisterModal';

interface Props {
  onLoginSuccess: (user: User) => void;
}

export default function AuthScreen({ onLoginSuccess }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisteringTailor, setIsRegisteringTailor] = useState(false);

  if (isRegisteringTailor) {
    return (
      <TailorRegisterModal
        onBackToLogin={() => setIsRegisteringTailor(false)}
        onRegisterSuccess={(user) => {
          setIsRegisteringTailor(false);
          onLoginSuccess(user);
        }}
      />
    );
  }

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Required', 'Please enter your phone or email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(identifier.trim(), password);
      if (res && res.success) {
        setAuthToken(res.token);
        onLoginSuccess(res.user);
      } else {
        Alert.alert('Login Failed', res?.message || 'Invalid mobile number or password.');
      }
    } catch (err: any) {
      Alert.alert(
        'Server Offline',
        `Unable to reach backend server.\n\nError: ${err?.message || 'Network request failed'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandHeader}>
        <View style={styles.logoBadge}>
          <Text style={[styles.logoIcon, { fontSize: 22, fontWeight: '900', color: '#FFF' }]}>TC</Text>
        </View>
        <Text style={styles.brandTitle}>TailorC Studio</Text>
        <Text style={styles.brandSubtitle}>Partner & Admin Portal</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>
        <Text style={styles.cardDesc}>Sign in to your account</Text>

        {/* Hidden decoy inputs to absorb browser autofill */}
        <TextInput style={styles.hiddenDecoy} editable={false} tabIndex={-1} />
        <TextInput style={styles.hiddenDecoy} secureTextEntry editable={false} tabIndex={-1} />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number or email"
            placeholderTextColor="#94A3B8"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="none"
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.primaryBtnText}>
              Sign In →
            </Text>
          )}
        </TouchableOpacity>

        {/* TAILOR REGISTRATION CTA CARD */}
        <TouchableOpacity
          style={styles.registerCtaCard}
          onPress={() => setIsRegisteringTailor(true)}
          activeOpacity={0.85}
        >
          <View style={styles.registerCtaIconCircle}>
            <Text style={{ fontSize: 18 }}>🪡</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.registerCtaTitle}>Register as Tailor Partner</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>SIGN UP</Text>
              </View>
            </View>
            <Text style={styles.registerCtaSub}>
              Solo tailor or workshop registration
            </Text>
          </View>
          <Text style={styles.registerCtaArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPage
  },
  scrollContent: {
    padding: 24,
    paddingVertical: 32,
    flexGrow: 1,
    justifyContent: 'center'
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.accent
  },
  logoIcon: {
    fontSize: 28
  },
  brandTitle: {
    fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary
  },
  brandSubtitle: {
    fontFamily,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 4
  },
  cardTitle: {
    fontFamily,
    fontSize: 17,
    fontWeight: '800',
    color: colors.textMain
  },
  cardDesc: {
    fontFamily,
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 3,
    marginBottom: 16
  },
  hiddenDecoy: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
    pointerEvents: 'none'
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 6
  },
  input: {
    fontFamily,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    fontWeight: '400',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: colors.border
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.accent
  },
  primaryBtnText: {
    fontFamily,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14
  },
  // Register CTA Card
  registerCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    borderRadius: 14,
    padding: 12,
    marginTop: 14
  },
  registerCtaIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D97706'
  },
  registerCtaTitle: {
    fontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E'
  },
  newBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  newBadgeText: {
    fontFamily,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  registerCtaSub: {
    fontFamily,
    fontSize: 11,
    color: '#B45309',
    marginTop: 1
  },
  registerCtaArrow: {
    fontFamily,
    fontSize: 18,
    color: '#D97706',
    fontWeight: '800',
    marginLeft: 6
  },
  quickInfoBox: {
    marginTop: 18,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12
  },
  quickInfoTitle: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 3
  },
  quickInfoText: {
    fontFamily,
    fontSize: 10.5,
    color: colors.textMuted
  }
});

