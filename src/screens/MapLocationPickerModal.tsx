import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
  Linking,
  Dimensions
} from 'react-native';

// Dynamically require react-native-webview on native platforms (Expo Go / Android / iOS)
let NativeWebView: any = null;
if (Platform.OS !== 'web') {
  try {
    NativeWebView = require('react-native-webview').WebView;
  } catch (e) {
    NativeWebView = null;
  }
}

export interface LocationSelectedResult {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Props {
  visible: boolean;
  initialLat?: number;
  initialLng?: number;
  initialCity?: string;
  onClose: () => void;
  onConfirmLocation: (result: LocationSelectedResult) => void;
}

// Popular tailoring hubs by city (including Andhra Pradesh & Telangana hubs)
const POPULAR_HUBS: Record<string, Array<{ name: string; lat: number; lng: number; state: string }>> = {
  nellore: [
    { name: 'VRC Centre / Trunk Road', lat: 14.4426, lng: 79.9865, state: 'Andhra Pradesh' },
    { name: 'Pogathota Market', lat: 14.4402, lng: 79.9840, state: 'Andhra Pradesh' },
    { name: 'Gandhi Nagar', lat: 14.4495, lng: 79.9812, state: 'Andhra Pradesh' },
    { name: 'Magunta Layout', lat: 14.4370, lng: 79.9610, state: 'Andhra Pradesh' },
    { name: 'Dargamitta', lat: 14.4320, lng: 79.9670, state: 'Andhra Pradesh' }
  ],
  hyderabad: [
    { name: 'Banjara Hills', lat: 17.4156, lng: 78.4350, state: 'Telangana' },
    { name: 'Jubilee Hills', lat: 17.4319, lng: 78.4073, state: 'Telangana' },
    { name: 'Hitec City / Madhapur', lat: 17.4483, lng: 78.3915, state: 'Telangana' },
    { name: 'Charminar (Laad Bazaar)', lat: 17.3616, lng: 78.4747, state: 'Telangana' },
    { name: 'Ameerpet Market', lat: 17.4375, lng: 78.4483, state: 'Telangana' },
    { name: 'Secunderabad (MG Rd)', lat: 17.4399, lng: 78.4983, state: 'Telangana' },
    { name: 'Gachibowli', lat: 17.4401, lng: 78.3489, state: 'Telangana' },
    { name: 'Kukatpally', lat: 17.4932, lng: 78.3999, state: 'Telangana' }
  ],
  vijayawada: [
    { name: 'Besant Road (Silk & Saree)', lat: 16.5130, lng: 80.6270, state: 'Andhra Pradesh' },
    { name: 'Governorpet', lat: 16.5115, lng: 80.6310, state: 'Andhra Pradesh' },
    { name: 'MG Road (Bandar Rd)', lat: 16.5020, lng: 80.6480, state: 'Andhra Pradesh' },
    { name: 'One Town Commercial', lat: 16.5185, lng: 80.6120, state: 'Andhra Pradesh' }
  ],
  visakhapatnam: [
    { name: 'Daba Gardens', lat: 17.7145, lng: 83.2980, state: 'Andhra Pradesh' },
    { name: 'Jagadamba Centre', lat: 17.7110, lng: 83.3030, state: 'Andhra Pradesh' },
    { name: 'MVP Colony', lat: 17.7420, lng: 83.3370, state: 'Andhra Pradesh' },
    { name: 'Gajuwaka Market', lat: 17.6910, lng: 83.2160, state: 'Andhra Pradesh' }
  ],
  tirupati: [
    { name: 'TK Street (Textile Hub)', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
    { name: 'Bhavani Nagar', lat: 13.6350, lng: 79.4280, state: 'Andhra Pradesh' }
  ],
  guntur: [
    { name: 'Brodipet Fashion Hub', lat: 16.3050, lng: 80.4420, state: 'Andhra Pradesh' },
    { name: 'Arundelpet', lat: 16.3010, lng: 80.4350, state: 'Andhra Pradesh' }
  ],
  bengaluru: [
    { name: 'Commercial Street', lat: 12.9822, lng: 77.6083, state: 'Karnataka' },
    { name: 'Indiranagar', lat: 12.9784, lng: 77.6408, state: 'Karnataka' },
    { name: 'Koramangala', lat: 12.9352, lng: 77.6245, state: 'Karnataka' },
    { name: 'Jayanagar 4th Block', lat: 12.9299, lng: 77.5824, state: 'Karnataka' },
    { name: 'Malleshwaram', lat: 13.0031, lng: 77.5643, state: 'Karnataka' }
  ],
  chennai: [
    { name: 'T. Nagar (Pondy Bazaar)', lat: 13.0418, lng: 80.2341, state: 'Tamil Nadu' },
    { name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, state: 'Tamil Nadu' },
    { name: 'Mylapore', lat: 13.0368, lng: 80.2676, state: 'Tamil Nadu' },
    { name: 'Sowcarpet Silk Hub', lat: 13.0920, lng: 80.2790, state: 'Tamil Nadu' }
  ],
  mumbai: [
    { name: 'Bandra Linking Road', lat: 19.0600, lng: 72.8336, state: 'Maharashtra' },
    { name: 'Dadar Market', lat: 19.0178, lng: 72.8478, state: 'Maharashtra' },
    { name: 'Colaba Causeway', lat: 18.9150, lng: 72.8258, state: 'Maharashtra' },
    { name: 'Andheri West', lat: 19.1197, lng: 72.8468, state: 'Maharashtra' }
  ],
  delhi: [
    { name: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, state: 'Delhi' },
    { name: 'Lajpat Nagar Central Mkt', lat: 28.5677, lng: 77.2433, state: 'Delhi' },
    { name: 'South Extension', lat: 28.5728, lng: 77.2219, state: 'Delhi' },
    { name: 'Karol Bagh', lat: 28.6517, lng: 77.1906, state: 'Delhi' }
  ]
};

export default function MapLocationPickerModal({
  visible,
  initialLat = 14.4426,
  initialLng = 79.9865,
  initialCity = 'Nellore',
  onClose,
  onConfirmLocation
}: Props) {
  const [currentLat, setCurrentLat] = useState<number>(initialLat || 14.4426);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || 79.9865);
  const [currentCity, setCurrentCity] = useState<string>(initialCity || 'Nellore');
  const [currentState, setCurrentState] = useState<string>('Andhra Pradesh');
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [currentPincode, setCurrentPincode] = useState<string>('524001');

  const [latInput, setLatInput] = useState<string>(initialLat ? initialLat.toFixed(5) : '14.44260');
  const [lngInput, setLngInput] = useState<string>(initialLng ? initialLng.toFixed(5) : '79.98650');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isGpsLocating, setIsGpsLocating] = useState(false);

  // Sync initial coordinates on open
  useEffect(() => {
    if (visible) {
      const lat = initialLat || 14.4426;
      const lng = initialLng || 79.9865;
      setCurrentLat(lat);
      setCurrentLng(lng);
      setLatInput(lat.toFixed(5));
      setLngInput(lng.toFixed(5));
      setCurrentCity(initialCity || 'Nellore');
      setSearchResults([]);
      reverseGeocode(lat, lng);
    }
  }, [visible, initialLat, initialLng, initialCity]);

  // Listen for pin drag events in browser web environment
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMsg = (e: MessageEvent) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && data.type === 'TAILOR_PIN_MOVED') {
            const { lat, lng } = data;
            if (typeof lat === 'number' && typeof lng === 'number') {
              updateCoords(lat, lng);
              reverseGeocode(lat, lng);
            }
          }
        } catch (err) {}
      };
      window.addEventListener('message', handleWebMsg);
      return () => window.removeEventListener('message', handleWebMsg);
    }
  }, []);

  // Reverse Geocoding via OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'TailorC-PartnerApp/1.0' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const a = data.address;
          const road = a.road || a.pedestrian || a.suburb || a.neighbourhood || '';
          const cityFound = a.city || a.town || a.county || a.state_district || currentCity;
          const stateFound = a.state || currentState;
          const postcode = a.postcode || '';

          const displayAddr = [road, a.suburb, cityFound].filter(Boolean).join(', ') || data.display_name?.slice(0, 85);
          if (displayAddr) setCurrentAddress(displayAddr);
          if (cityFound) setCurrentCity(cityFound);
          if (stateFound) setCurrentState(stateFound);
          if (postcode) setCurrentPincode(postcode);
        }
      }
    } catch (e) {
      console.warn('Reverse geocode error:', e);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Search places via Nominatim
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const query = searchQuery.trim();
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1&countrycodes=in`,
        { headers: { 'User-Agent': 'TailorC-PartnerApp/1.0' } }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data || []);
      }
    } catch (e) {
      console.warn('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  // Select place from search results
  const handleSelectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      updateCoords(lat, lng);
      setSearchResults([]);
      setSearchQuery(item.display_name?.slice(0, 50) || '');

      const a = item.address;
      if (a) {
        const road = a.road || a.pedestrian || a.suburb || a.neighbourhood || '';
        const cityFound = a.city || a.town || a.county || a.state_district || currentCity;
        const stateFound = a.state || currentState;
        const postcode = a.postcode || '';

        const displayAddr = [road, a.suburb, cityFound].filter(Boolean).join(', ') || item.display_name?.slice(0, 85);
        setCurrentAddress(displayAddr);
        if (cityFound) setCurrentCity(cityFound);
        if (stateFound) setCurrentState(stateFound);
        if (postcode) setCurrentPincode(postcode);
      } else {
        reverseGeocode(lat, lng);
      }
    }
  };

  // Update coordinates state and inputs
  const updateCoords = (lat: number, lng: number) => {
    const rLat = Number(lat.toFixed(5));
    const rLng = Number(lng.toFixed(5));
    setCurrentLat(rLat);
    setCurrentLng(rLng);
    setLatInput(rLat.toFixed(5));
    setLngInput(rLng.toFixed(5));
  };

  // Nudge pin in 4 directions by ~100m (0.001 deg)
  const handleNudge = (dLat: number, dLng: number) => {
    const nLat = Number((currentLat + dLat).toFixed(5));
    const nLng = Number((currentLng + dLng).toFixed(5));
    updateCoords(nLat, nLng);
    reverseGeocode(nLat, nLng);
  };

  // Manual input apply
  const handleApplyManualCoords = () => {
    const parsedLat = parseFloat(latInput);
    const parsedLng = parseFloat(lngInput);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      updateCoords(parsedLat, parsedLng);
      reverseGeocode(parsedLat, parsedLng);
    }
  };

  // Auto detect current GPS
  const handleUseCurrentGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsGpsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsLocating(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          updateCoords(lat, lng);
          reverseGeocode(lat, lng);
        },
        (err) => {
          setIsGpsLocating(false);
          alert('GPS location permission denied or timed out. Please allow location permissions in your phone settings.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Geolocation is not available on this device.');
    }
  };

  // Open in Google Maps app directly
  const handleOpenGoogleMaps = async () => {
    const lat = currentLat;
    const lng = currentLng;
    const label = encodeURIComponent(currentAddress || 'Shop Location');
    const geoUrl = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(webUrl, '_blank');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(geoUrl);
      if (canOpen) {
        await Linking.openURL(geoUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      await Linking.openURL(webUrl).catch(() => {});
    }
  };

  // Confirm and return location to caller
  const handleConfirm = () => {
    onConfirmLocation({
      latitude: currentLat,
      longitude: currentLng,
      address: currentAddress || `Shop at ${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`,
      city: currentCity || 'Nellore',
      state: currentState || 'Andhra Pradesh',
      pincode: currentPincode || '524001'
    });
    onClose();
  };

  // Current city key for matching hubs
  const cityKey = (currentCity || '').toLowerCase().trim();
  const matchedHubs = POPULAR_HUBS[cityKey] ||
    (Object.keys(POPULAR_HUBS).find(k => cityKey.includes(k))
      ? POPULAR_HUBS[Object.keys(POPULAR_HUBS).find(k => cityKey.includes(k))!]
      : POPULAR_HUBS['nellore']);

  // Self-contained interactive map HTML payload using Leaflet & CartoDB tiles
  // Zero Google Cloud API keys needed, zero billing, zero iframe restriction errors!
  const mapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .custom-pin {
        width: 34px;
        height: 34px;
        background: #D97706;
        border: 3px solid #FFFFFF;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .custom-pin::after {
        content: '';
        width: 10px;
        height: 10px;
        background: #FFFFFF;
        border-radius: 50%;
        transform: rotate(45deg);
      }
      .floating-banner {
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.92);
        color: #FFFFFF;
        padding: 5px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 700;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
    </style>
  </head>
  <body>
    <div class="floating-banner">📍 Tap or drag pin to exact shop position</div>
    <div id="map"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
    <script>
      var lat = ${currentLat};
      var lng = ${currentLng};

      var map = L.map('map', {
        zoomControl: true,
        attributionControl: false
      }).setView([lat, lng], 16);

      var tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      });
      tileLayer.on('tileerror', function() {
        tileLayer.setUrl('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}');
      });
      tileLayer.addTo(map);

      var icon = L.divIcon({
        className: 'custom-pin-wrap',
        html: '<div class="custom-pin"></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34]
      });

      var marker = L.marker([lat, lng], { draggable: true, icon: icon }).addTo(map);
      marker.bindPopup("<b>Your Atelier Shop</b><br>Exact customer discovery location").openPopup();

      function notifyParent(newLat, newLng) {
        var payload = JSON.stringify({ type: 'TAILOR_PIN_MOVED', lat: newLat, lng: newLng });
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(payload);
        } else if (window.parent) {
          window.parent.postMessage(payload, '*');
        }
      }

      marker.on('dragend', function (e) {
        var pos = marker.getLatLng();
        notifyParent(pos.lat, pos.lng);
      });

      map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        notifyParent(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(function() {
        map.invalidateSize();
      }, 250);
    </script>
  </body>
</html>
  `;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 18 }}>🗺️</Text>
                <Text style={styles.headerTitle}>Pinpoint Shop Location</Text>
              </View>
              <Text style={styles.headerSub} numberOfLines={1}>
                Drag or tap the pin to set your exact workshop location
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar & Action Controls */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Nellore, street, market, landmark..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {isSearching ? (
                <ActivityIndicator size="small" color="#D97706" style={{ marginRight: 6 }} />
              ) : searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 6 }}>
                  <Text style={{ color: '#94A3B8', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={handleSearch} style={styles.searchActionBtn} activeOpacity={0.8}>
                <Text style={styles.searchActionText}>Find</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions Row */}
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                onPress={handleUseCurrentGPS}
                style={[styles.quickBtn, styles.gpsBtn, isGpsLocating && { opacity: 0.6 }]}
                disabled={isGpsLocating}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 12 }}>🛰️</Text>
                <Text style={[styles.quickBtnText, { color: '#047857' }]}>
                  {isGpsLocating ? 'Detecting GPS...' : 'My Current GPS'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleOpenGoogleMaps} style={styles.quickBtn} activeOpacity={0.8}>
                <Text style={{ fontSize: 12 }}>🌐</Text>
                <Text style={styles.quickBtnText}>Open in Google Maps App ↗</Text>
              </TouchableOpacity>
            </View>

            {/* Popular Local Hubs Chips */}
            {matchedHubs && matchedHubs.length > 0 && searchResults.length === 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hubChipsScroll}>
                <Text style={styles.hubChipsLabel}>{currentCity || 'Area'} Hubs:</Text>
                {matchedHubs.map((hub) => (
                  <TouchableOpacity
                    key={hub.name}
                    style={styles.hubChip}
                    onPress={() => {
                      updateCoords(hub.lat, hub.lng);
                      if (hub.state) setCurrentState(hub.state);
                      reverseGeocode(hub.lat, hub.lng);
                    }}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.hubChipText}>📍 {hub.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Autocomplete Results Dropdown Overlay */}
            {searchResults.length > 0 && (
              <View style={styles.searchResultsBox}>
                <View style={styles.searchResultsHeader}>
                  <Text style={styles.searchResultsTitle}>Select Exact Location Match:</Text>
                  <TouchableOpacity onPress={() => setSearchResults([])}>
                    <Text style={{ fontSize: 12, color: '#D97706', fontWeight: '700' }}>Close ✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 140 }} keyboardShouldPersistTaps="handled">
                  {searchResults.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectSearchResult(item)}
                    >
                      <Text style={{ fontSize: 14 }}>📍</Text>
                      <Text style={styles.searchResultText} numberOfLines={2}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Interactive Live Map Viewport (Leaflet + CartoDB Road Map - 0 API Key Requirements) */}
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              // Browser Web Embedded Map
              <iframe
                key={`${currentLat}_${currentLng}`}
                srcDoc={mapHtml}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block'
                }}
                title="Shop Location Selector"
              />
            ) : NativeWebView ? (
              // Native Mobile Expo / Android WebView with Interactive Map
              <NativeWebView
                key={`${currentLat}_${currentLng}`}
                source={{ html: mapHtml }}
                style={styles.nativeWebView}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                onMessage={(event: any) => {
                  try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data && data.type === 'TAILOR_PIN_MOVED') {
                      const { lat, lng } = data;
                      if (typeof lat === 'number' && typeof lng === 'number') {
                        updateCoords(lat, lng);
                        reverseGeocode(lat, lng);
                      }
                    }
                  } catch (e) {}
                }}
              />
            ) : (
              // Fallback
              <View style={styles.fallbackBox}>
                <Text style={{ fontSize: 32 }}>📍</Text>
                <Text style={{ fontWeight: '800', fontSize: 15, color: '#0F172A', marginTop: 4 }}>
                  {currentCity} Atelier Location
                </Text>
                <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>
                  {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E
                </Text>
                <TouchableOpacity onPress={handleOpenGoogleMaps} style={[styles.quickBtn, { marginTop: 10 }]}>
                  <Text style={styles.quickBtnText}>Open Full Google Maps App ↗</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Micro Nudge Pill */}
            <View style={styles.nudgePill}>
              <Text style={styles.nudgePillLabel}>Fine-Tune (100m):</Text>
              <View style={styles.nudgeBtnRow}>
                <TouchableOpacity onPress={() => handleNudge(0.001, 0)} style={styles.nudgeBtn}>
                  <Text style={styles.nudgeBtnText}>▲ N</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNudge(-0.001, 0)} style={styles.nudgeBtn}>
                  <Text style={styles.nudgeBtnText}>▼ S</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNudge(0, -0.001)} style={styles.nudgeBtn}>
                  <Text style={styles.nudgeBtnText}>◀ W</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNudge(0, 0.001)} style={styles.nudgeBtn}>
                  <Text style={styles.nudgeBtnText}>▶ E</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Coordinate Direct Adjustment Bar */}
          <View style={styles.coordBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.coordLabel}>Latitude (°N)</Text>
              <TextInput
                style={styles.coordInput}
                value={latInput}
                onChangeText={setLatInput}
                keyboardType="numeric"
                onBlur={handleApplyManualCoords}
                onSubmitEditing={handleApplyManualCoords}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.coordLabel}>Longitude (°E)</Text>
              <TextInput
                style={styles.coordInput}
                value={lngInput}
                onChangeText={setLngInput}
                keyboardType="numeric"
                onBlur={handleApplyManualCoords}
                onSubmitEditing={handleApplyManualCoords}
              />
            </View>
            <TouchableOpacity onPress={handleApplyManualCoords} style={styles.applyCoordsBtn} activeOpacity={0.8}>
              <Text style={styles.applyCoordsBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Fixed Bottom Confirmation Footer */}
          <View style={styles.footerCard}>
            <View style={styles.locationSummaryRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Text style={styles.locationTitle}>
                    {currentCity || 'Selected Location'} {currentPincode ? `(${currentPincode})` : ''}
                  </Text>
                  {isReverseGeocoding && <ActivityIndicator size="small" color="#D97706" />}
                </View>
                <Text style={styles.locationAddress} numberOfLines={1}>
                  {currentAddress || `${currentLat.toFixed(5)}° N, ${currentLng.toFixed(5)}° E (${currentCity})`}
                </Text>
                <Text style={styles.coordTag}>
                  {currentLat.toFixed(5)}° N, {currentLng.toFixed(5)}° E • {currentState}
                </Text>
              </View>

              <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn} activeOpacity={0.85}>
                <Text style={styles.confirmBtnText}>✓ Set This Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  modalBox: {
    width: '100%',
    maxWidth: 760,
    height: Math.min(SCREEN_HEIGHT * 0.94, 760),
    maxHeight: '94%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '700'
  },
  searchSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 38
  },
  searchIcon: {
    fontSize: 13,
    marginRight: 6
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    paddingVertical: 4
  },
  searchActionBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  searchActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  quickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  gpsBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  hubChipsScroll: {
    marginTop: 6
  },
  hubChipsLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    alignSelf: 'center',
    marginRight: 5
  },
  hubChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginRight: 5
  },
  hubChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#92400E'
  },
  searchResultsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 6,
    overflow: 'hidden'
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  searchResultsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  searchResultText: {
    fontSize: 11,
    color: '#1E293B',
    flex: 1
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    minHeight: 220
  },
  nativeWebView: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  fallbackBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F1F5F9'
  },
  nudgePill: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20
  },
  nudgePillLabel: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700'
  },
  nudgeBtnRow: {
    flexDirection: 'row',
    gap: 4
  },
  nudgeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4
  },
  nudgeBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  coordBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2
  },
  coordInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    fontSize: 11.5,
    color: '#0F172A',
    fontWeight: '700'
  },
  applyCoordsBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  applyCoordsBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  footerCard: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  locationSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  locationTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  locationAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  coordTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 2
  },
  confirmBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
