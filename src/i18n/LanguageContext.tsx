import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  subtitle: string;
  greeting: string;
  icon: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    subtitle: 'Standard Indian English',
    greeting: 'Welcome to TailorC Partner',
    icon: '🇬🇧'
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    subtitle: 'ఆంధ్రప్రదేశ్ & తెలంగాణ',
    greeting: 'టైలర్‌సీ పార్ట్‌నర్‌కు స్వాగతం',
    icon: '🇮🇳'
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    subtitle: 'भारत भर में प्रचलित',
    greeting: 'टेलरसी पार्टनर में आपका स्वागत है',
    icon: '🇮🇳'
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    subtitle: 'தமிழ்நாடு & புதுச்சேரி',
    greeting: 'டெய்லர்சி பார்ட்னருக்கு வரவேற்கிறோம்',
    icon: '🇮🇳'
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    subtitle: 'ಕರ್ನಾಟಕ',
    greeting: 'ಟೈಲರ್‌ಸಿ ಪಾರ್ಟ್‌ನರ್‌ಗೆ ಸುಸ್ವಾಗತ',
    icon: '🇮🇳'
  }
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    selectLanguage: 'Select Language',
    selectLanguageTitle: 'Choose Your Atelier Language',
    selectLanguageSubtitle: 'Manage your tailor shop, orders, and services in your preferred language.',
    continue: 'Continue',
    changeLanguage: 'Change Language',
    appTitle: 'TailorC Partner',
    tagline: 'Enterprise Atelier & Multi-Shop Manager',
    
    // Navigation
    navDashboard: 'Dashboard',
    navOrders: 'Orders',
    navCreateOrder: 'Create Order',
    navTailors: 'Tailors & Team',
    navServices: 'Services',
    navProfile: 'Shop Profile',
    
    // Actions
    signIn: 'Sign In',
    signUp: 'Register Atelier',
    save: 'Save Changes',
    cancel: 'Cancel',
    back: 'Back',
    submit: 'Submit Order',
    filter: 'Filter',
    search: 'Search orders, customers, or services...',
    logout: 'Log Out',
    
    // Metrics
    totalRevenue: 'Total Revenue',
    inShopRevenue: 'In-Shop Revenue',
    onlineRevenue: 'Online Revenue',
    activeOrders: 'Active Pipeline',
    todayDeliveries: "Today's Deliveries",
    pendingMeasurements: 'Pending Measurements',
    completedOrders: 'Delivered Orders',
    
    // Order Statuses
    statusPending: 'Pending Approval',
    statusConfirmed: 'Order Confirmed',
    statusMeasured: 'Measurements Taken',
    statusCutting: 'Cutting Fabric',
    statusStitching: 'Stitching in Progress',
    statusTrial: 'Ready for Trial',
    statusDelivered: 'Delivered',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    
    // Sections
    quickActions: 'Quick Operations',
    recentOrders: 'Recent Shop Orders',
    topServices: 'Popular Services',
    teamRoster: 'Tailor Team Roster',
    subscriptionStatus: 'Subscription Plan'
  },
  te: {
    selectLanguage: 'భాషను ఎంచుకోండి',
    selectLanguageTitle: 'మీ షాప్ నిర్వహణ భాషను ఎంచుకోండి',
    selectLanguageSubtitle: 'మీ టైలర్ షాప్, ఆర్డర్లు మరియు సేవలను మీకు నచ్చిన భాషలో నిర్వహించండి.',
    continue: 'కొనసాగించండి',
    changeLanguage: 'భాష మార్చండి',
    appTitle: 'టైలర్‌సీ పార్ట్‌నర్ (TailorC)',
    tagline: 'టైలర్ షాప్ మరియు వర్క్‌షాప్ మేనేజ్‌మెంట్',
    
    // Navigation
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navOrders: 'ఆర్డర్లు',
    navCreateOrder: 'కొత్త ఆర్డర్',
    navTailors: 'టైలర్లు & బృందం',
    navServices: 'సేవలు',
    navProfile: 'షాప్ ప్రొఫైల్',
    
    // Actions
    signIn: 'లాగిన్ అవ్వండి',
    signUp: 'కొత్త షాప్ నమోదు',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    back: 'వెనుకకు',
    submit: 'ఆర్డర్ సృష్టించండి',
    filter: 'ఫిల్టర్',
    search: 'ఆర్డర్లు, కస్టమర్లు లేదా సేవలను వెతకండి...',
    logout: 'లాగ్ అవుట్',
    
    // Metrics
    totalRevenue: 'మొత్తం ఆదాయం',
    inShopRevenue: 'షాప్ ఆదాయం',
    onlineRevenue: 'ఆన్‌లైన్ ఆదాయం',
    activeOrders: 'యాక్టివ్ ఆర్డర్లు',
    todayDeliveries: 'ఈరోజు డెలివరీలు',
    pendingMeasurements: 'పెండింగ్ కొలతలు',
    completedOrders: 'పూర్తయిన ఆర్డర్లు',
    
    // Order Statuses
    statusPending: 'ఆమోదం కోసం పెండింగ్',
    statusConfirmed: 'ఆర్డర్ నిర్ధారించబడింది',
    statusMeasured: 'కొలతలు తీసుకోబడ్డాయి',
    statusCutting: 'వస్త్రం కటింగ్ జరుగుతోంది',
    statusStitching: 'కుట్టడం జరుగుతోంది',
    statusTrial: 'ట్రయల్‌కు సిద్ధంగా ఉంది',
    statusDelivered: 'డెలివరీ చేయబడింది',
    statusCompleted: 'పూర్తయింది',
    statusCancelled: 'రద్దు చేయబడింది',
    
    // Sections
    quickActions: 'త్వరిత చర్యలు',
    recentOrders: 'ఇటీవలి షాప్ ఆర్డర్లు',
    topServices: 'ప్రముఖ సేవలు',
    teamRoster: 'టైలర్ వర్కర్ల జాబితా',
    subscriptionStatus: 'సబ్‌స్క్రిప్షన్ ప్లాన్'
  },
  hi: {
    selectLanguage: 'भाषा चुनें',
    selectLanguageTitle: 'दुकान प्रबंधन के लिए भाषा चुनें',
    selectLanguageSubtitle: 'अपनी दर्जी दुकान, ऑर्डर और सेवाओं को अपनी भाषा में प्रबंधित करें।',
    continue: 'आगे बढ़ें',
    changeLanguage: 'भाषा बदलें',
    appTitle: 'टेलरसी पार्टनर (TailorC)',
    tagline: 'दर्जी दुकान और वर्कशॉप प्रबंधन',
    
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navOrders: 'ऑर्डर',
    navCreateOrder: 'नया ऑर्डर',
    navTailors: 'दर्जी और टीम',
    navServices: 'सेवाएं',
    navProfile: 'दुकान प्रोफ़ाइल',
    
    // Actions
    signIn: 'साइन इन करें',
    signUp: 'दुकान रजिस्टर करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    back: 'पीछे जाएं',
    submit: 'ऑर्डर दर्ज करें',
    filter: 'फ़िल्टर',
    search: 'ऑर्डर, ग्राहक या सेवाएं खोजें...',
    logout: 'लॉग आउट',
    
    // Metrics
    totalRevenue: 'कुल राजस्व',
    inShopRevenue: 'दुकान का राजस्व',
    onlineRevenue: 'ऑनलाइन राजस्व',
    activeOrders: 'सक्रिय ऑर्डर',
    todayDeliveries: 'आज की डिलीवरी',
    pendingMeasurements: 'लंबित नाप',
    completedOrders: 'पूर्ण ऑर्डर',
    
    // Order Statuses
    statusPending: 'स्वीकृति बाकी है',
    statusConfirmed: 'ऑर्डर पक्का हुआ',
    statusMeasured: 'नाप ले लिया गया',
    statusCutting: 'कपड़ा कटाई चालू है',
    statusStitching: 'सिलाई चालू है',
    statusTrial: 'ट्रायल के लिए तैयार',
    statusDelivered: 'डिलीवर किया गया',
    statusCompleted: 'पूर्ण हुआ',
    statusCancelled: 'रद्द किया गया',
    
    // Sections
    quickActions: 'त्वरित क्रियाएं',
    recentOrders: 'दुकान के हालिया ऑर्डर',
    topServices: 'प्रमुख सेवाएं',
    teamRoster: 'दर्जी कारीगर सूची',
    subscriptionStatus: 'सदस्यता योजना'
  },
  ta: {
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    selectLanguageTitle: 'கடை நிர்வாக மொழியைத் தேர்வுசெய்க',
    selectLanguageSubtitle: 'உங்கள் தையல் கடை, ஆர்டர்கள் மற்றும் சேவைகளை உங்கள் மொழியில் நிர்வகிக்கவும்.',
    continue: 'தொடரவும்',
    changeLanguage: 'மொழியை மாற்றவும்',
    appTitle: 'டெய்லர்சி பார்ட்னர் (TailorC)',
    tagline: 'தையல் கடை & பணிமனை மேலாண்மை',
    
    // Navigation
    navDashboard: 'டாஷ்போர்டு',
    navOrders: 'ஆர்டர்கள்',
    navCreateOrder: 'புதிய ஆர்டர்',
    navTailors: 'தையல் குழு',
    navServices: 'சேவைகள்',
    navProfile: 'கடை சுயவிவரம்',
    
    // Actions
    signIn: 'உள்நுழைக',
    signUp: 'கடை பதிவு',
    save: 'சேமிக்கவும்',
    cancel: 'ரத்துசெய்',
    back: 'பின்செல்க',
    submit: 'ஆர்டரைச் சமர்ப்பிக்கவும்',
    filter: 'வடிகட்டி',
    search: 'ஆர்டர்கள், வாடிக்கையாளர்களைத் தேடுங்கள்...',
    logout: 'வெளியேறு',
    
    // Metrics
    totalRevenue: 'மொத்த வருவாய்',
    inShopRevenue: 'நேரடி கடை வருவாய்',
    onlineRevenue: 'ஆன்லைன் வருவாய்',
    activeOrders: 'செயலில் உள்ள ஆர்டர்கள்',
    todayDeliveries: 'இன்றைய டெலிவரிகள்',
    pendingMeasurements: 'நிலுவையில் உள்ள அளவுகள்',
    completedOrders: 'முடிக்கப்பட்ட ஆர்டர்கள்',
    
    // Order Statuses
    statusPending: 'ஒப்புதலுக்காக காத்திருக்கிறது',
    statusConfirmed: 'ஆர்டர் உறுதி செய்யப்பட்டது',
    statusMeasured: 'அளவு எடுக்கப்பட்டது',
    statusCutting: 'துணி வெட்டும் பணி',
    statusStitching: 'தையல் பணியில் உள்ளது',
    statusTrial: 'சோதனைக்கு தயார்',
    statusDelivered: 'டெலிவரி செய்யப்பட்டது',
    statusCompleted: 'நிறைவடைந்தது',
    statusCancelled: 'ரத்து செய்யப்பட்டது',
    
    // Sections
    quickActions: 'விரைவு நடவடிக்கைகள்',
    recentOrders: 'சமீபத்திய கடை ஆர்டர்கள்',
    topServices: 'பிரபலமான சேவைகள்',
    teamRoster: 'தையல் பணியாளர்கள்',
    subscriptionStatus: 'சந்தா திட்டம்'
  },
  kn: {
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectLanguageTitle: 'ಅಂಗಡಿ ನಿರ್ವಹಣಾ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
    selectLanguageSubtitle: 'ನಿಮ್ಮ ಟೈಲರ್ ಅಂಗಡಿ, ಆರ್ಡರ್‌ಗಳು & ಸೇವೆಗಳನ್ನು ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ನಿರ್ವಹಿಸಿ.',
    continue: 'ಮುಂದುವರಿಸಿ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    appTitle: 'ಟೈಲರ್‌ಸಿ ಪಾರ್ಟ್‌ನರ್ (TailorC)',
    tagline: 'ಟೈಲರ್ ಅಂಗಡಿ & ಕಾರ್ಯಾಗಾರ ನಿರ್ವಹಣೆ',
    
    // Navigation
    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navOrders: 'ಆರ್ಡರ್‌ಗಳು',
    navCreateOrder: 'ಹೊಸ ಆರ್ಡರ್',
    navTailors: 'ಟೈಲರ್‌ಗಳ ತಂಡ',
    navServices: 'ಸೇವೆಗಳು',
    navProfile: 'ಅಂಗಡಿ ಪ್ರೊಫೈಲ್',
    
    // Actions
    signIn: 'ಲಾಗಿನ್ ಮಾಡಿ',
    signUp: 'ಅಂಗಡಿ ನೋಂದಣಿ',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    back: 'ಹಿಂದೆ',
    submit: 'ಆರ್ಡರ್ ಸಲ್ಲಿಸಿ',
    filter: 'ಫಿಲ್ಟರ್',
    search: 'ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಗ್ರಾಹಕರನ್ನು ಹುಡುಕಿ...',
    logout: 'ಲಾಗ್ ಔಟ್',
    
    // Metrics
    totalRevenue: 'ಒಟ್ಟು ಆದಾಯ',
    inShopRevenue: 'ಅಂಗಡಿ ಆದಾಯ',
    onlineRevenue: 'ಆನ್‌ಲೈನ್ ಆದಾಯ',
    activeOrders: 'ಸಕ್ರಿಯ ಆರ್ಡರ್‌ಗಳು',
    todayDeliveries: 'ಇಂದಿನ ಡೆಲಿವರಿಗಳು',
    pendingMeasurements: 'ಬಾಕಿ ಉಳಿದ ಅಳತೆಗಳು',
    completedOrders: 'ಪೂರ್ಣಗೊಂಡ ಆರ್ಡರ್‌ಗಳು',
    
    // Order Statuses
    statusPending: 'ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
    statusConfirmed: 'ಆರ್ಡರ್ ಖಚಿತವಾಗಿದೆ',
    statusMeasured: 'ಅಳತೆ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ',
    statusCutting: 'ಬಟ್ಟೆ ಕತ್ತರಿಸುವಿಕೆ',
    statusStitching: 'ಹೊಲಿಯುವಿಕೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    statusTrial: 'ಟ್ರಯಲ್‌ಗೆ ಸಿದ್ಧವಾಗಿದೆ',
    statusDelivered: 'ತಲುಪಿಸಲಾಗಿದೆ',
    statusCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    statusCancelled: 'ರದ್ದುಗೊಂಡಿದೆ',
    
    // Sections
    quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    recentOrders: 'ಇತ್ತೀಚಿನ ಅಂಗಡಿ ಆರ್ಡರ್‌ಗಳು',
    topServices: 'ಜನಪ್ರಿಯ ಸೇವೆಗಳು',
    teamRoster: 'ಟೈಲರ್ ಕೆಲಸಗಾರರ ಪಟ್ಟಿ',
    subscriptionStatus: 'ಚಂದಾದಾರಿಕೆ ಯೋಜನೆ'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  hasCompletedLanguageOnboarding: boolean;
  setHasCompletedLanguageOnboarding: (completed: boolean) => void;
  currentLanguageMeta: LanguageOption;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  hasCompletedLanguageOnboarding: false,
  setHasCompletedLanguageOnboarding: () => {},
  currentLanguageMeta: SUPPORTED_LANGUAGES[0]
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('tailorc_partner_lang') as LanguageCode;
        if (saved && TRANSLATIONS[saved]) return saved;
      }
    } catch {}
    return 'en';
  });

  const [hasCompletedLanguageOnboarding, setHasCompletedState] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('tailorc_partner_lang_onboarded');
        return saved === 'true';
      }
    } catch {}
    return false;
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('tailorc_partner_lang', lang);
      }
    } catch {}
  };

  const setHasCompletedLanguageOnboarding = (completed: boolean) => {
    setHasCompletedState(completed);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('tailorc_partner_lang_onboarded', completed ? 'true' : 'false');
      }
    } catch {}
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict[key]) return enDict[key];
    return fallback || key;
  };

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasCompletedLanguageOnboarding,
        setHasCompletedLanguageOnboarding,
        currentLanguageMeta
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
