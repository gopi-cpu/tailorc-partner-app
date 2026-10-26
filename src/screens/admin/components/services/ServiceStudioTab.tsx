import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { Service } from '../../../../types';
import { SERVICE_IMAGE_PRESETS } from './types';
import { servicesStyles as styles } from './styles';
import { colors } from '../../../../theme/colors';

interface Props {
  onBackToCatalog: () => void;
  onPublishService: (newService: Service) => void;
  categories: string[];
  shopId?: string;
  shopName?: string;
  onOpenAddCategoryModal?: () => void;
}

const BADGE_SUGGESTIONS = ['Royal Bridal', 'Trend Fit', 'Express 24h', 'Master Handcrafted', 'Premium Pure Silk'];

export default function ServiceStudioTab({
  onBackToCatalog,
  onPublishService,
  categories,
  shopId = 'shop-1',
  shopName = 'Partner Shop',
  onOpenAddCategoryModal
}: Props) {
  const [serviceName, setServiceName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || "Women's Wear");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [highlightBadge, setHighlightBadge] = useState('Handcrafted Fit');
  const [startingRate, setStartingRate] = useState('450');
  const [turnaroundDelivery, setTurnaroundDelivery] = useState('3-4 Days');
  const [description, setDescription] = useState('');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState(SERVICE_IMAGE_PRESETS[0].url);

  const handlePublish = () => {
    if (!serviceName.trim()) {
      Alert.alert('Required Field', 'Please enter a service name.');
      return;
    }

    const price = parseInt(startingRate, 10) || 450;
    const newService: Service = {
      id: 'svc-' + Date.now(),
      name: serviceName.trim(),
      category: selectedCategory,
      categoryName: selectedCategory,
      basePrice: price,
      startingPrice: price,
      estimatedDays: parseInt(turnaroundDelivery.replace(/[^0-9]/g, ''), 10) || 3,
      turnaround: turnaroundDelivery || '3-4 Days',
      imageUrl: selectedPresetUrl,
      description: description || 'Custom tailoring with perfect fit.',
      tailorShopId: shopId,
      tailorShopName: shopName,
      rating: 5.0
    } as any;

    onPublishService(newService);
  };

  return (
    <View style={{ paddingHorizontal: 18 }}>
      {/* 1. Header Banner matching Original */}
      <View style={styles.studioHeaderBanner}>
        <View style={{ width: '100%', marginBottom: 6 }}>
          <Text style={styles.studioHeaderTitle}>Add New Service</Text>
          <Text style={styles.studioHeaderSubtitle}>
            Add stitching services with pricing and delivery time.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.studioHeaderBtn}
          onPress={onBackToCatalog}
          activeOpacity={0.85}
        >
          <Text style={styles.studioHeaderBtnText}>← Back to Catalog</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Studio Form Card */}
      <View style={styles.studioCard}>
        {/* Section 1: Category with Dropdown + Inline Chips */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
          <Text style={styles.formSectionTitle}>1. CATEGORY *</Text>
          {onOpenAddCategoryModal && (
            <TouchableOpacity onPress={onOpenAddCategoryModal}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>+ Add New Category</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.luxuryChip, isSelected && styles.luxuryChipActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.85}
              >
                <Text style={[styles.luxuryChipText, isSelected && styles.luxuryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Section 2: Service Title & Signature Badge */}
        <Text style={styles.formSectionTitle}>2. SERVICE DETAILS *</Text>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Service Name *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter service name..."
            placeholderTextColor="#94A3B8"
            value={serviceName}
            onChangeText={setServiceName}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Highlight Badge (Optional)</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Handcrafted Fit"
            placeholderTextColor="#94A3B8"
            value={highlightBadge}
            onChangeText={setHighlightBadge}
          />
          {/* Badge Suggestions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 2 }}
          >
            {BADGE_SUGGESTIONS.map(badge => (
              <TouchableOpacity
                key={badge}
                style={{
                  backgroundColor: '#F1F5F9',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: '#E2E8F0'
                }}
                onPress={() => setHighlightBadge(badge)}
                activeOpacity={0.85}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>{badge}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 3: Pricing & Delivery Timeline */}
        <Text style={styles.formSectionTitle}>3. PRICING & DELIVERY TIMELINE *</Text>
        <View style={styles.pricingInputRow}>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Starting Rate (₹) *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="450"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={startingRate}
              onChangeText={setStartingRate}
            />
          </View>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Turnaround Delivery *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="3-4 Days"
              placeholderTextColor="#94A3B8"
              value={turnaroundDelivery}
              onChangeText={setTurnaroundDelivery}
            />
          </View>
        </View>

        {/* Section 4: Craftsmanship & Inclusions */}
        <Text style={styles.formSectionTitle}>4. CRAFTSMANSHIP & INCLUSIONS</Text>
        <View style={styles.formRow}>
          <TextInput
            style={[styles.formInput, { height: 75, textAlignVertical: 'top', paddingTop: 10 }]}
            placeholder="Enter service description & craftsmanship inclusions..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Section 5: Photography Presets */}
        <Text style={styles.formSectionTitle}>5. SERVICE PHOTOGRAPHY PRESET *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          {SERVICE_IMAGE_PRESETS.map(preset => {
            const isSelected = selectedPresetUrl === preset.url;
            return (
              <TouchableOpacity
                key={preset.label}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
                onPress={() => setSelectedPresetUrl(preset.url)}
                activeOpacity={0.85}
              >
                <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={[styles.formRow, { marginTop: 8 }]}>
          <TextInput
            style={[styles.formInput, { fontSize: 11, color: '#64748B' }]}
            placeholder="Enter garment image URL (https://...)"
            placeholderTextColor="#94A3B8"
            value={selectedPresetUrl}
            onChangeText={setSelectedPresetUrl}
          />
        </View>

        {/* Section 6: Live Patron Customer App Card Mockup */}
        <View style={styles.mockupCardWrap}>
          <View style={styles.mockupCardHeader}>
            <Text style={styles.mockupCardHeaderBadge}>Live Patron App Preview</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>Rendered in real-time</Text>
          </View>
          <View style={styles.serviceCatalogCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: selectedPresetUrl }}
                style={styles.serviceCardImage}
                resizeMode="cover"
              />
              <View style={{ flex: 1, paddingLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.serviceCardTitle} numberOfLines={1}>
                    {serviceName || 'Your Bespoke Garment Title'}
                  </Text>
                  {highlightBadge ? (
                    <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#B45309' }}>{highlightBadge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.gold, marginTop: 2 }}>
                  {shopName}
                </Text>
                <Text style={styles.serviceCardDesc} numberOfLines={2}>
                  {description || 'Master bespoke tailoring, lining included, with custom neckline & perfect fit guarantee.'}
                </Text>
                <View style={styles.serviceCardFooter}>
                  <Text style={styles.servicePriceBold}>From ₹{startingRate || '450'}</Text>
                  <Text style={styles.serviceTurnaroundText}>⚡ {turnaroundDelivery || '3-4 Days'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
          <TouchableOpacity
            style={[styles.btnPrimary, { flex: 1, backgroundColor: '#E2E8F0' }]}
            onPress={onBackToCatalog}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnPrimaryText, { color: '#334155' }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnPrimary, { flex: 1.8 }]}
            onPress={handlePublish}
            activeOpacity={0.88}
          >
            <Text style={styles.btnPrimaryText}>✓ Publish to Customer Store</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
