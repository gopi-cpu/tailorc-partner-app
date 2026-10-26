import React, { useState } from 'react';
import './src/theme/typography';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  LogBox
} from 'react-native';

LogBox.ignoreAllLogs(true);
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/colors';
import AuthScreen from './src/screens/AuthScreen';
import TailorDashboard from './src/screens/tailor/TailorDashboard';
import AdminOverview from './src/screens/admin/AdminOverview';
import OnboardingLanguageScreen from './src/screens/OnboardingLanguageScreen';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import { User } from './src/types';

// Robust Error Boundary to guarantee zero blank screens in production builds
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Partner App ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorSafeArea}>
          <StatusBar style="light" />
          <View style={styles.errorCard}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>👑</Text>
            <Text style={styles.errorTitle}>TailorC Partner App</Text>
            <Text style={styles.errorSubtitle}>
              {this.state.error?.message || 'Ready to restore workspace session.'}
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ hasError: false, error: null })}
              style={styles.errorBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.errorBtnText}>Open Admin Console →</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

import { setAuthToken } from './src/services/api';

const USER_STORAGE_KEY = 'tailorc_partner_user_session';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <MainPartnerApp />
      </LanguageProvider>
    </ErrorBoundary>
  );
}

function MainPartnerApp() {
  const { hasCompletedLanguageOnboarding, setHasCompletedLanguageOnboarding } = useLanguage();
  
  // Persist session across browser reloads so it keeps the authenticated user instead of falling back to another user
  const [user, setUserState] = useState<User | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored user session:', e);
    }
    return null;
  });

  const handleLoginSuccess = (loggedInUser: User) => {
    setUserState(loggedInUser);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      }
    } catch (e) {
      console.warn('Error saving user session:', e);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUserState(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Error clearing user session:', e);
    }
  };

  if (!hasCompletedLanguageOnboarding) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RNStatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
        <StatusBar style="light" />
        <OnboardingLanguageScreen onContinue={() => setHasCompletedLanguageOnboarding(true)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <StatusBar style="dark" />
      <View style={styles.rootContainer}>
        {!user ? (
          <AuthScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AdminOverview user={user} onLogout={handleLogout} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    paddingTop: 0
  },
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.bgPage
  },
  errorSafeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  errorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 26,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center'
  },
  errorSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18
  },
  errorBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center'
  },
  errorBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  }
});
