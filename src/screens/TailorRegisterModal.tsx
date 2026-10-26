import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { colors } from '../theme/colors';
import { api, setAuthToken } from '../services/api';
import { User, ShopOperatingModel } from '../types';
import MapLocationPickerModal, { LocationSelectedResult } from './MapLocationPickerModal';
import ShopPhotoUploadSection, { UploadedShopPhoto } from './ShopPhotoUploadSection';

interface Props {
  onBackToLogin: () => void;
  onRegisterSuccess: (user: User) => void;
}

export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  areas: string[];
}

const DEFAULT_CITIES: CityData[] = [
  {
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    areas: ['Banjara Hills', 'Jubilee Hills', 'Madhapur', 'Hitech City', 'Kukatpally', 'Secunderabad', 'Charminar', 'Gachibowli', 'Ameerpet', 'Kondapur']
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    areas: ['Indiranagar', 'Koramangala', 'Jayanagar', 'Whitefield', 'HSR Layout', 'Malleshwaram', 'MG Road', 'Commercial Street']
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    areas: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Mylapore', 'Velachery', 'Nungambakkam', 'Alwarpet']
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    areas: ['Bandra', 'Juhu', 'Andheri West', 'Colaba', 'Dadar', 'Powai', 'Thane', 'Borivali']
  },
  {
    name: 'Delhi-NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    areas: ['South Extension', 'Lajpat Nagar', 'Connaught Place', 'Karol Bagh', 'Gurugram DLF', 'Noida Sector 18']
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    areas: ['Koregaon Park', 'Kothrud', 'Viman Nagar', 'FC Road', 'Baner', 'Aundh']
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    areas: ['Park Street', 'Salt Lake', 'Ballygunge', 'New Town', 'Gariahat']
  },
  {
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    areas: ['CG Road', 'Bodakdev', 'Satellite', 'Navrangpura', 'Maninagar', 'Prahlad Nagar']
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    areas: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Johari Bazaar', 'Raja Park']
  },
  {
    name: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
    areas: ['Dwaraka Nagar', 'Siripuram', 'MVP Colony', 'Gajuwaka', 'Jagadamba Junction']
  },
  {
    name: 'Vijayawada',
    state: 'Andhra Pradesh',
    lat: 16.5062,
    lng: 80.6480,
    areas: ['MG Road', 'Governorpet', 'Benz Circle', 'Bhavanipuram', 'Auto Nagar']
  },
  {
    name: 'Warangal',
    state: 'Telangana',
    lat: 17.9689,
    lng: 79.5941,
    areas: ['Hanamkonda', 'Kazipet', 'Subedari', 'Nayeem Nagar']
  }
];

const HOURS_LIST = ['06', '07', '08', '09', '10', '11', '12', '01', '02', '03', '04', '05'];
const MINUTES_LIST = ['00', '15', '30', '45'];

export type SetupPurpose = 'INHOUSE_ONLY' | 'SELLING_ONLY' | 'FULL_STUDIO';

export default function TailorRegisterModal({ onBackToLogin, onRegisterSuccess }: Props) {
  // Wizard Step: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Dynamic Cities from Database
  const [citiesList, setCitiesList] = useState<CityData[]>(DEFAULT_CITIES);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);

  // --- PAGE 1: BUSINESS SETUP ---
  const [shopPurpose, setShopPurpose] = useState<SetupPurpose>('INHOUSE_ONLY');
  const [shopName, setShopName] = useState('');
  const [operatingModel, setOperatingModel] = useState<ShopOperatingModel>('SOLO');
  const [teamSizeTier, setTeamSizeTier] = useState('5 - 10 Tailors');

  // --- PAGE 2: MASTER CREDENTIALS ---
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  // --- PAGE 3: LOCATION & HOURS ---
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('500034');
  const [latitude, setLatitude] = useState('17.4156');
  const [longitude, setLongitude] = useState('78.4350');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  // Shop Photos (Stored in AWS S3 Bucket)
  const [shopPhotos, setShopPhotos] = useState<UploadedShopPhoto[]>([]);

  // Time Picker
  const [openHour, setOpenHour] = useState('10');
  const [openMinute, setOpenMinute] = useState('00');
  const [openPeriod, setOpenPeriod] = useState<'AM' | 'PM'>('AM');
  const [closeHour, setCloseHour] = useState('08');
  const [closeMinute, setCloseMinute] = useState('30');
  const [closePeriod, setClosePeriod] = useState<'AM' | 'PM'>('PM');
  const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'OPEN' | 'CLOSE'>('OPEN');

  // UPI Payout (Only for Selling & Full Studio)
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Cities from PostgreSQL Database on Mount
  useEffect(() => {
    const fetchDbCities = async () => {
      try {
        const res = await api.getCities();
        if (res && res.success && Array.isArray(res.cities) && res.cities.length > 0) {
          setCitiesList(res.cities);
        }
      } catch (err) {}
    };
    fetchDbCities();
  }, []);

  // Handle City Selection from Database
  const handleSelectCity = (cityObj: CityData) => {
    setSelectedCity(cityObj.name);
    setSelectedState(cityObj.state);
    setCityDropdownVisible(false);
    setCitySearchQuery('');

    if (cityObj.lat && cityObj.lng) {
      setLatitude(cityObj.lat.toFixed(4));
      setLongitude(cityObj.lng.toFixed(4));
    }
  };

  // Auto-detect GPS coordinates
  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat.toFixed(4));
          setLongitude(lng.toFixed(4));

          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              { headers: { 'User-Agent': 'TailorC-PartnerApp/1.0' } }
            );
            if (resp.ok) {
              const data = await resp.json();
              if (data && data.address) {
                const addr = data.address;
                const road = addr.road || addr.suburb || '';
                const cityFound = addr.city || addr.town || addr.state || 'Hyderabad';
                const postCode = addr.postcode || '';

                if (postCode) setPincode(postCode);
                if (road) setAddress(road);
                if (cityFound) {
                  const matched = citiesList.find(c => c.name.toLowerCase().includes(cityFound.toLowerCase()));
                  if (matched) {
                    setSelectedCity(matched.name);
                    setSelectedState(matched.state);
                  } else {
                    setSelectedCity(cityFound);
                  }
                }
                Alert.alert('GPS Auto-Detected', `Location updated: ${cityFound} (${postCode || lat.toFixed(4)})`);
              }
            }
          } catch (e) {
          } finally {
            setIsDetectingGps(false);
          }
        },
        () => {
          setIsDetectingGps(false);
          Alert.alert('GPS Notice', 'Could not fetch device location. Database city used.');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  // Step Validations
  const handleGoToStep2 = () => {
    if (!shopName.trim()) {
      Alert.alert('Required', 'Please enter your shop or brand name.');
      return;
    }
    setCurrentStep(2);
  };

  const handleGoToStep3 = () => {
    if (!ownerName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      Alert.alert('Required', 'Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }
    setCurrentStep(3);
  };

  const handleCompleteRegister = async () => {
    if (shopPurpose !== 'INHOUSE_ONLY' && !address.trim()) {
      Alert.alert('Address Required', 'Please enter your store address for customer discovery.');
      return;
    }

    setLoading(true);
    try {
      const isInHouse = shopPurpose === 'INHOUSE_ONLY';
      const isSelling = shopPurpose === 'SELLING_ONLY';

      const tailorPayload = {
        ownerName: ownerName.trim(),
        name: ownerName.trim(),
        phone: phone.trim(),
        password,
        email: email.trim() || undefined,
        shopName: shopName.trim(),
        operatingModel: isSelling ? 'SOLO' : operatingModel,
        teamSize: operatingModel === 'MULTI' ? 5 : 1,
        teamMembers: [
          { id: 'tm-1', name: ownerName.trim(), role: 'Master Craftsman & Shop Owner', specialty: 'Custom Tailoring' }
        ],
        city: selectedCity,
        area: `${selectedCity} Central`,
        address: isInHouse ? `${shopName.trim()}, ${selectedCity}` : address.trim(),
        pincode: pincode.trim() || '500001',
        latitude: parseFloat(latitude) || 17.4156,
        longitude: parseFloat(longitude) || 78.4350,
        workshopHours: `${openHour}:${openMinute} ${openPeriod} - ${closeHour}:${closeMinute} ${closePeriod}`,
        specialties: isSelling ? 'Boutique Sarees & Ready Wear' : 'Bespoke Blouse & Custom Tailoring',
        baseRate: isSelling ? 0 : 450,
        experienceYears: 5,
        hasTrialRoom: true,
        // In-House Workshop does NOT use UPI
        upiId: isInHouse ? 'IN_SHOP_COUNTER_POS' : (upiId.trim() || `${phone.trim()}@upi`),
        subscriptionPlan: isInHouse ? 'MANAGEMENT_ONLY' : (isSelling ? 'SAREE_STORE_ONLY' : 'OMNICHANNEL_SUITE'),
        canManageInShopOrders: shopPurpose !== 'SELLING_ONLY',
        canListServicesOnline: shopPurpose === 'FULL_STUDIO',
        canSellSareesOnline: shopPurpose !== 'INHOUSE_ONLY',
        photos: shopPhotos.map(p => p.url)
      };

      const res = await api.registerTailor(tailorPayload);
      if (res && res.success) {
        if (res.token) setAuthToken(res.token);
        Alert.alert(
          'Registration Successful',
          `Welcome to TailorC! "${shopName.trim()}" is now registered.`,
          [{ text: 'Open Dashboard →', onPress: () => onRegisterSuccess(res.user) }]
        );
      } else {
        Alert.alert('Registration Error', res?.message || 'Unable to register. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = citiesList.filter(c =>
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Signature Saddle Brown Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBackToLogin} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>‹ Sign In</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Registration</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Clean 3-Step Progress Indicator */}
      <View style={styles.stepProgressBar}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, currentStep >= 1 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 1 && styles.stepCircleTextActive]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>Shop Type</Text>
        </View>

        <View style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, currentStep >= 2 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 2 && styles.stepCircleTextActive]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>Owner Login</Text>
        </View>

        <View style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]} />

        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, currentStep >= 3 && styles.stepCircleActive]}>
            <Text style={[styles.stepCircleText, currentStep >= 3 && styles.stepCircleTextActive]}>3</Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>Location & Hours</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ========================================================================= */}
        {/* PAGE 1: BUSINESS SETUP (3 SIMPLE QUESTIONS) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 1: Choose Shop Setup</Text>
            <Text style={styles.cardSub}>Select how you want to use the TailorC system</Text>

            {/* Q1: Shop Purpose */}
            <Text style={styles.fieldLabel}>1. What type of setup do you need? *</Text>
            <View style={styles.optionStack}>
              {/* Option A: In-House POS */}
              <TouchableOpacity
                style={[styles.optionCard, shopPurpose === 'INHOUSE_ONLY' && styles.optionCardActive]}
                onPress={() => setShopPurpose('INHOUSE_ONLY')}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionEmoji}>✂️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, shopPurpose === 'INHOUSE_ONLY' && styles.optionTitleActive]}>
                      In-House Workshop Management (POS)
                    </Text>
                    <Text style={styles.optionDesc}>
                      For in-shop customer orders, digital measurements & cutting master slips. (No online UPI needed)
                    </Text>
                  </View>
                  <View style={[styles.radioDot, shopPurpose === 'INHOUSE_ONLY' && styles.radioDotActive]} />
                </View>
              </TouchableOpacity>

              {/* Option B: Boutique Saree Store */}
              <TouchableOpacity
                style={[styles.optionCard, shopPurpose === 'SELLING_ONLY' && styles.optionCardActive]}
                onPress={() => setShopPurpose('SELLING_ONLY')}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionEmoji}>🛍️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, shopPurpose === 'SELLING_ONLY' && styles.optionTitleActive]}>
                      Boutique Store & Saree Selling
                    </Text>
                    <Text style={styles.optionDesc}>
                      Sell Sarees, Ready Blouses and Dress Materials online to customers.
                    </Text>
                  </View>
                  <View style={[styles.radioDot, shopPurpose === 'SELLING_ONLY' && styles.radioDotActive]} />
                </View>
              </TouchableOpacity>

              {/* Option C: Full Studio */}
              <TouchableOpacity
                style={[styles.optionCard, shopPurpose === 'FULL_STUDIO' && styles.optionCardActive]}
                onPress={() => setShopPurpose('FULL_STUDIO')}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionEmoji}>👑</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, shopPurpose === 'FULL_STUDIO' && styles.optionTitleActive]}>
                      Full Bespoke Studio (All Features)
                    </Text>
                    <Text style={styles.optionDesc}>
                      Both In-House Workshop POS + Online Customer Discovery Map + Saree Store.
                    </Text>
                  </View>
                  <View style={[styles.radioDot, shopPurpose === 'FULL_STUDIO' && styles.radioDotActive]} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Q2: Shop Brand Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>2. Shop / Boutique Brand Name *</Text>
              <TextInput
                style={styles.input}
                value={shopName}
                onChangeText={setShopName}
                placeholder="e.g. Royal Tailors & Boutique"
                placeholderTextColor={colors.textSub}
              />
            </View>

            {/* Q3: Workforce Model (If Workshop) */}
            {shopPurpose !== 'SELLING_ONLY' && (
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>3. Tailor Setup *</Text>
                <View style={styles.segmentedRow}>
                  <TouchableOpacity
                    style={[styles.segmentBtn, operatingModel === 'SOLO' && styles.segmentBtnActive]}
                    onPress={() => setOperatingModel('SOLO')}
                  >
                    <Text style={[styles.segmentText, operatingModel === 'SOLO' && styles.segmentTextActive]}>
                      🧵 Solo Tailor
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.segmentBtn, operatingModel === 'MULTI' && styles.segmentBtnActive]}
                    onPress={() => setOperatingModel('MULTI')}
                  >
                    <Text style={[styles.segmentText, operatingModel === 'MULTI' && styles.segmentTextActive]}>
                      👥 Multi-Tailor Team
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Next Step Button */}
            <TouchableOpacity style={styles.primaryBtn} onPress={handleGoToStep2} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Continue to Step 2 →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: OWNER LOGIN CREDENTIALS (3-4 SIMPLE QUESTIONS) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 2: Owner & Login Details</Text>
            <Text style={styles.cardSub}>Create credentials to log in to your partner app</Text>

            {/* Q1: Owner Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>1. Master Tailor / Owner Name *</Text>
              <TextInput
                style={styles.input}
                value={ownerName}
                onChangeText={setOwnerName}
                placeholder="e.g. Rajesh Kumar"
                placeholderTextColor={colors.textSub}
              />
            </View>

            {/* Q2: Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>2. Mobile Number (Used for Login) *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="10-digit mobile number"
                placeholderTextColor={colors.textSub}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Q3: Password & Confirm */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>3. Create Password *</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 4 characters"
                placeholderTextColor={colors.textSub}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter password"
                placeholderTextColor={colors.textSub}
                secureTextEntry
              />
            </View>

            {/* Q4: Optional Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>4. Email Address (Optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. shop@gmail.com"
                placeholderTextColor={colors.textSub}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentStep(1)} activeOpacity={0.8}>
                <Text style={styles.secondaryBtnText}>← Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={handleGoToStep3} activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>Continue to Step 3 →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: LOCATION & VISITING HOURS (3-4 SIMPLE QUESTIONS) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Step 3: Location & Visiting Hours</Text>
            <Text style={styles.cardSub}>Set your operating city and shop timings</Text>

            {/* Q1: Database City Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>1. Operating City (From Database) *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setCityDropdownVisible(true)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Text style={{ fontSize: 18 }}>📍</Text>
                  <View>
                    <Text style={styles.dropdownSelectedText}>{selectedCity}</Text>
                    <Text style={styles.dropdownSub}>{selectedState} • Database Hub</Text>
                  </View>
                </View>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Q2: Address & Location Coordinates (Manual Google Maps Picker + Auto-Detect GPS) */}
            {shopPurpose !== 'INHOUSE_ONLY' ? (
              <View style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  <Text style={styles.fieldLabel}>2. Shop Address & Location Coordinates *</Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => setMapModalVisible(true)}
                      style={styles.mapPickerBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.mapPickerText}>🗺️ Pick on Google Maps</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDetectGPS} style={styles.gpsAutoBtn} disabled={isDetectingGps}>
                      <Text style={styles.gpsAutoText}>{isDetectingGps ? 'Detecting GPS...' : '📍 Auto GPS'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  style={[styles.input, { height: 50 }]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street address, landmark, building..."
                  placeholderTextColor={colors.textSub}
                  multiline
                />
                
                {/* Coordinates Row */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 3 }}>Latitude (°N)</Text>
                    <TextInput
                      style={[styles.input, { paddingVertical: 8, fontSize: 13 }]}
                      value={latitude}
                      onChangeText={setLatitude}
                      placeholder="17.4156"
                      placeholderTextColor={colors.textSub}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 3 }}>Longitude (°E)</Text>
                    <TextInput
                      style={[styles.input, { paddingVertical: 8, fontSize: 13 }]}
                      value={longitude}
                      onChangeText={setLongitude}
                      placeholder="78.4350"
                      placeholderTextColor={colors.textSub}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ width: 90 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, marginBottom: 3 }}>Pincode</Text>
                    <TextInput
                      style={[styles.input, { paddingVertical: 8, fontSize: 13 }]}
                      value={pincode}
                      onChangeText={setPincode}
                      placeholder="500034"
                      placeholderTextColor={colors.textSub}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {/* Interactive Map Visual Confirmation Banner */}
                <TouchableOpacity
                  style={styles.mapBannerCard}
                  onPress={() => setMapModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Text style={{ fontSize: 20 }}>📍</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mapBannerTitle}>
                        Shop Location: {latitude}° N, {longitude}° E
                      </Text>
                      <Text style={styles.mapBannerSub} numberOfLines={1}>
                        {address ? `${address} (${selectedCity})` : `Tap to view and adjust your pin on Google Maps`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.mapAdjustBtn}>
                    <Text style={styles.mapAdjustText}>Adjust on Map ↗</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inHouseBadgeBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.inHouseBadgeTitle}>🔒 Private Workshop Mode</Text>
                  <TouchableOpacity
                    onPress={() => setMapModalVisible(true)}
                    style={styles.mapPickerBtn}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.mapPickerText}>🗺️ {address ? 'Adjust on Map' : 'Set on Map'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.inHouseBadgeDesc}>
                  Orders will be managed in-shop under "{shopName || 'Your Shop'}" ({selectedCity}).
                </Text>

                {/* Visual feedback when map location is pinned */}
                {address ? (
                  <View style={{ backgroundColor: '#FFFFFF', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.borderSoft, marginTop: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary }}>📍 Pinned Workshop Location:</Text>
                    <Text style={{ fontSize: 12, color: colors.textMain, marginTop: 2 }}>{address} ({selectedCity} - {pincode})</Text>
                  </View>
                ) : null}

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 2 }}>City Lat (°N)</Text>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textMain }}>{latitude}° N</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 2 }}>City Lng (°E)</Text>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: colors.textMain }}>{longitude}° E</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Q3: Shop Photos Upload (Stored in AWS S3 Bucket) */}
            <ShopPhotoUploadSection
              photos={shopPhotos}
              onChangePhotos={setShopPhotos}
              shopName={shopName}
            />


            {/* Q3: Visiting Timings */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {shopPurpose !== 'INHOUSE_ONLY' ? '3. Visiting Hours *' : '2. Workshop Visiting Hours *'}
              </Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeBox}
                  onPress={() => {
                    setTimePickerTarget('OPEN');
                    setTimePickerModalVisible(true);
                  }}
                >
                  <Text style={styles.timeBoxLabel}>Opens At</Text>
                  <Text style={styles.timeBoxValue}>{openHour}:{openMinute} {openPeriod}</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 16, color: colors.textMuted, fontWeight: '700' }}>to</Text>

                <TouchableOpacity
                  style={styles.timeBox}
                  onPress={() => {
                    setTimePickerTarget('CLOSE');
                    setTimePickerModalVisible(true);
                  }}
                >
                  <Text style={styles.timeBoxLabel}>Closes At</Text>
                  <Text style={styles.timeBoxValue}>{closeHour}:{closeMinute} {closePeriod}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Q4: UPI ID (ONLY for Selling & Full Studio — OMITTED for In-House) */}
            {shopPurpose !== 'INHOUSE_ONLY' && (
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>4. Business UPI ID (For Online Payments)</Text>
                <TextInput
                  style={styles.input}
                  value={upiId}
                  onChangeText={setUpiId}
                  placeholder="e.g. yourname@okhdfcbank"
                  placeholderTextColor={colors.textSub}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentStep(2)} activeOpacity={0.8}>
                <Text style={styles.secondaryBtnText}>← Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={handleCompleteRegister}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryBtnText}>Complete Registration ✓</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* CITY DATABASE DROPDOWN MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={cityDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCityDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Operating City</Text>
              <TouchableOpacity onPress={() => setCityDropdownVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              style={styles.modalSearch}
              placeholder="Search database city..."
              placeholderTextColor={colors.textSub}
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              autoFocus
            />

            {/* Cities List */}
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {filteredCities.map((c) => {
                const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
                return (
                  <TouchableOpacity
                    key={c.name}
                    style={[styles.modalItem, isSelected && styles.modalItemActive]}
                    onPress={() => handleSelectCity(c)}
                  >
                    <Text style={{ fontSize: 16 }}>📍</Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={[styles.modalItemName, isSelected && styles.modalItemNameActive]}>
                        {c.name}
                      </Text>
                      <Text style={styles.modalItemState}>{c.state} ({c.areas?.length || 0} Areas)</Text>
                    </View>
                    {isSelected && <Text style={{ color: colors.primary, fontWeight: '800' }}>✓</Text>}
                  </TouchableOpacity>
                );
              })}

              {filteredCities.length === 0 && (
                <TouchableOpacity
                  style={styles.customAddBtn}
                  onPress={() => {
                    handleSelectCity({
                      name: citySearchQuery.trim(),
                      state: 'India',
                      lat: 17.3850,
                      lng: 78.4867,
                      areas: ['Main Center']
                    });
                  }}
                >
                  <Text style={styles.customAddBtnText}>+ Use "{citySearchQuery.trim()}" as City</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* CUSTOM TIME PICKER MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={timePickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {timePickerTarget === 'OPEN' ? 'Opening Time' : 'Closing Time'}
              </Text>
              <TouchableOpacity onPress={() => setTimePickerModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Value Preview */}
            <View style={styles.timePreviewCard}>
              <Text style={styles.timePreviewText}>
                {timePickerTarget === 'OPEN'
                  ? `${openHour}:${openMinute} ${openPeriod}`
                  : `${closeHour}:${closeMinute} ${closePeriod}`}
              </Text>
            </View>

            {/* Hour Selector */}
            <Text style={styles.fieldLabel}>Hour</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {HOURS_LIST.map((hr) => {
                  const isCur = (timePickerTarget === 'OPEN' ? openHour : closeHour) === hr;
                  return (
                    <TouchableOpacity
                      key={hr}
                      style={[styles.timeChip, isCur && styles.timeChipActive]}
                      onPress={() => {
                        if (timePickerTarget === 'OPEN') setOpenHour(hr);
                        else setCloseHour(hr);
                      }}
                    >
                      <Text style={[styles.timeChipText, isCur && styles.timeChipTextActive]}>{hr}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Minute Selector */}
            <Text style={styles.fieldLabel}>Minute</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {MINUTES_LIST.map((min) => {
                  const isCur = (timePickerTarget === 'OPEN' ? openMinute : closeMinute) === min;
                  return (
                    <TouchableOpacity
                      key={min}
                      style={[styles.timeChip, isCur && styles.timeChipActive]}
                      onPress={() => {
                        if (timePickerTarget === 'OPEN') setOpenMinute(min);
                        else setCloseMinute(min);
                      }}
                    >
                      <Text style={[styles.timeChipText, isCur && styles.timeChipTextActive]}>:{min}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* AM / PM Toggle */}
            <Text style={styles.fieldLabel}>AM / PM</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {['AM', 'PM'].map((prd) => {
                const isCur = (timePickerTarget === 'OPEN' ? openPeriod : closePeriod) === prd;
                return (
                  <TouchableOpacity
                    key={prd}
                    style={[styles.periodBtn, isCur && styles.periodBtnActive]}
                    onPress={() => {
                      if (timePickerTarget === 'OPEN') setOpenPeriod(prd as 'AM' | 'PM');
                      else setClosePeriod(prd as 'AM' | 'PM');
                    }}
                  >
                    <Text style={[styles.periodBtnText, isCur && styles.periodBtnTextActive]}>{prd}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setTimePickerModalVisible(false)}>
              <Text style={styles.primaryBtnText}>Set Time ✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* GOOGLE MAPS / INTERACTIVE MAP PINPOINT MODAL */}
      {/* ========================================================================= */}
      <MapLocationPickerModal
        visible={mapModalVisible}
        initialLat={parseFloat(latitude) || 17.4156}
        initialLng={parseFloat(longitude) || 78.4350}
        initialCity={selectedCity}
        onClose={() => setMapModalVisible(false)}
        onConfirmLocation={(result: LocationSelectedResult) => {
          setLatitude(result.latitude.toFixed(4));
          setLongitude(result.longitude.toFixed(4));
          if (result.address) setAddress(result.address);
          if (result.pincode) setPincode(result.pincode);
          if (result.city) {
            setSelectedCity(result.city);
            if (result.state) setSelectedState(result.state);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPage
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryDark
  },
  backBtn: {
    paddingVertical: 4
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  stepProgressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  stepItem: {
    alignItems: 'center',
    gap: 4
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  stepCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted
  },
  stepCircleTextActive: {
    color: '#FFFFFF'
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  stepLine: {
    width: 36,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    marginBottom: 16
  },
  stepLineActive: {
    backgroundColor: colors.primary
  },
  scrollContent: {
    padding: 16,
    maxWidth: 580,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: 40
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 2
  },
  cardSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 6
  },
  inputGroup: {
    marginBottom: 14
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textMain
  },
  optionStack: {
    gap: 10,
    marginBottom: 16
  },
  optionCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.border
  },
  optionCardActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  optionEmoji: {
    fontSize: 22
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain
  },
  optionTitleActive: {
    color: colors.primary
  },
  optionDesc: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border
  },
  radioDotActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  segmentBtnActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  dropdownSelectedText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMain
  },
  dropdownSub: {
    fontSize: 11,
    color: colors.textMuted
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textMuted
  },
  gpsAutoBtn: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accent
  },
  gpsAutoText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700'
  },
  mapPickerBtn: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C4B5FD'
  },
  mapPickerText: {
    color: '#6D28D9',
    fontSize: 11,
    fontWeight: '800'
  },
  mapBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10
  },
  mapBannerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#166534'
  },
  mapBannerSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 1
  },
  mapAdjustBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  mapAdjustText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  inHouseBadgeBox: {
    backgroundColor: colors.accentLight,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 14
  },
  inHouseBadgeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 2
  },
  inHouseBadgeDesc: {
    fontSize: 12,
    color: colors.textMain,
    lineHeight: 17
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  timeBox: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  timeBoxLabel: {
    fontSize: 11,
    color: colors.textMuted
  },
  timeBoxValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMain,
    marginTop: 2
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  secondaryBtn: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryBtnText: {
    color: colors.textMain,
    fontSize: 13,
    fontWeight: '700'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '700',
    padding: 4
  },
  modalSearch: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textMain,
    marginBottom: 10
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft
  },
  modalItemActive: {
    backgroundColor: colors.accentLight
  },
  modalItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textMain
  },
  modalItemNameActive: {
    color: colors.primary
  },
  modalItemState: {
    fontSize: 11,
    color: colors.textMuted
  },
  customAddBtn: {
    backgroundColor: colors.accentLight,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  customAddBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700'
  },
  timePreviewCard: {
    backgroundColor: colors.accentLight,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  timePreviewText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary
  },
  timeChip: {
    width: 40,
    height: 36,
    borderRadius: 6,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMain
  },
  timeChipTextActive: {
    color: '#FFFFFF'
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  periodBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  periodBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain
  },
  periodBtnTextActive: {
    color: '#FFFFFF'
  }
});
