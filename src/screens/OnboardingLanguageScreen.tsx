import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { colors } from '../theme/colors';
import { SUPPORTED_LANGUAGES, LanguageCode, useLanguage } from '../i18n/LanguageContext';

interface Props {
  onContinue: () => void;
}

export default function OnboardingLanguageScreen({ onContinue }: Props) {
  const { language, setLanguage, setHasCompletedLanguageOnboarding } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language);

  const handleSelectLanguage = (code: LanguageCode) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleConfirm = () => {
    setLanguage(selectedLang);
    setHasCompletedLanguageOnboarding(true);
    onContinue();
  };

  const selectedMeta = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>👑</Text>
          </View>
          <Text style={styles.brandName}>TailorC Partner</Text>
          <Text style={styles.title}>
            {selectedLang === 'te' ? 'మీ షాప్ భాషను ఎంచుకోండి' :
             selectedLang === 'hi' ? 'दुकान की भाषा चुनें' :
             selectedLang === 'ta' ? 'கடை நிர்வாக மொழியைத் தேர்வுசெய்க' :
             selectedLang === 'kn' ? 'ಅಂಗಡಿ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' :
             'Select Atelier Language'}
          </Text>
          <Text style={styles.subtitle}>
            {selectedLang === 'te' ? 'మీ టైలర్ షాప్ మరియు ఆర్డర్లను నిర్వహించడానికి భాషను ఎంచుకోండి' :
             selectedLang === 'hi' ? 'अपनी दर्जी दुकान और ऑर्डर प्रबंधित करने के लिए भाषा चुनें' :
             selectedLang === 'ta' ? 'உங்கள் தையல் கடை மற்றும் ஆர்டர்களை நிர்வகிக்க மொழியைத் தேர்ந்தெடுக்கவும்' :
             selectedLang === 'kn' ? 'ನಿಮ್ಮ ಟೈಲರ್ ಅಂಗಡಿ ಮತ್ತು ಆರ್ಡರ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಭಾಷೆಯನ್ನು ಆರಿಸಿ' :
             'Manage your tailor shop orders, workflows, and catalog in your preferred language'}
          </Text>
        </View>

        {/* Live Greeting Banner */}
        <View style={styles.greetingBanner}>
          <Text style={styles.greetingTag}>PREVIEW / ప్రివ్యూ</Text>
          <Text style={styles.greetingText}>✨ {selectedMeta.greeting}</Text>
        </View>

        {/* Languages List */}
        <ScrollView
          style={styles.scrollList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = selectedLang === item.code;
            return (
              <TouchableOpacity
                key={item.code}
                style={[
                  styles.languageCard,
                  isSelected && styles.languageCardSelected
                ]}
                activeOpacity={0.85}
                onPress={() => handleSelectLanguage(item.code)}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                    <Text style={styles.flagIcon}>{item.icon}</Text>
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.nativeName, isSelected && styles.nativeNameSelected]}>
                        {item.nativeName}
                      </Text>
                      {item.nativeName !== item.label && (
                        <Text style={[styles.englishLabel, isSelected && styles.englishLabelSelected]}>
                          ({item.label})
                        </Text>
                      )}
                    </View>
                    <Text style={styles.subLabel}>{item.subtitle}</Text>
                  </View>
                </View>

                {/* Radio Circle */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom CTA Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={handleConfirm}
          >
            <Text style={styles.continueBtnText}>
              {selectedLang === 'te' ? 'డ్యాష్‌బోర్డ్‌కి కొనసాగించండి →' :
               selectedLang === 'hi' ? 'डैशबोर्ड पर आगे बढ़ें →' :
               selectedLang === 'ta' ? 'டாஷ்போர்டைத் தொடரவும் →' :
               selectedLang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಸಿ →' :
               'Continue to Atelier Dashboard →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 16
  },
  brandBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#38BDF8'
  },
  brandIcon: {
    fontSize: 26
  },
  brandName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 18
  },
  greetingBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center'
  },
  greetingTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
    marginBottom: 4
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  scrollList: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 10
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#334155'
  },
  languageCardSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#0284C7',
    borderWidth: 2,
    shadowColor: '#0284C7',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  iconCircleSelected: {
    backgroundColor: '#0369A1'
  },
  flagIcon: {
    fontSize: 22
  },
  textContainer: {
    flex: 1
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  nativeName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  nativeNameSelected: {
    color: '#38BDF8',
    fontWeight: '800'
  },
  englishLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500'
  },
  englishLabelSelected: {
    color: '#7DD3FC'
  },
  subLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  radioOuterSelected: {
    borderColor: '#38BDF8'
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38BDF8'
  },
  footer: {
    paddingTop: 12
  },
  continueBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});
