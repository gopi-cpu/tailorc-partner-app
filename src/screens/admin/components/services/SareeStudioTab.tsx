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
import { SareeProduct, SAREE_IMAGE_PRESETS } from './types';
import { servicesStyles as styles } from './styles';
import { colors } from '../../../../theme/colors';

interface Props {
  onBackToStore: () => void;
  onPublishSaree: (newSaree: SareeProduct) => void;
  shopId?: string;
  shopName?: string;
}

const CATEGORY_OPTIONS = ['Saree', 'Saree Fabric', 'Summer Collection', 'Pure Silk', 'Bridal Sarees'];
const FABRIC_OPTIONS = ['Silk', 'Pure Silk', 'Georgette', 'Chanderi Cotton', 'Organza', 'Chiffon', 'Linen'];

export default function SareeStudioTab({
  onBackToStore,
  onPublishSaree,
  shopId = 'shop-1',
  shopName = 'My Shop'
}: Props) {
  const [sareeTitle, setSareeTitle] = useState('');
  const [sareeCategory, setSareeCategory] = useState('Saree');
  const [sareeFabric, setSareeFabric] = useState('Silk');
  const [sareePrice, setSareePrice] = useState('1400');
  const [sareeMrp, setSareeMrp] = useState('2400');
  const [sareeStockCount, setSareeStockCount] = useState('18');
  const [sareeInStock, setSareeInStock] = useState(true);
  const [sareeImageUrl, setSareeImageUrl] = useState(SAREE_IMAGE_PRESETS[0].url);
  const [sareeDescription, setSareeDescription] = useState('Graceful floral drape with rich pallu border. Comes with 0.8m unstitched matching blouse piece.');
  const [sareeBlouseStitchingAddon, setSareeBlouseStitchingAddon] = useState('450');
  const [sareeFallPicoAddon, setSareeFallPicoAddon] = useState('99');

  const sellPriceNum = parseInt(sareePrice, 10) || 0;
  const mrpNum = parseInt(sareeMrp, 10) || 0;
  const discountPercent = mrpNum > sellPriceNum && mrpNum > 0 ? Math.round(((mrpNum - sellPriceNum) / mrpNum) * 100) : 0;
  const savingsAmount = mrpNum > sellPriceNum ? mrpNum - sellPriceNum : 0;

  const handlePublish = () => {
    if (!sareeTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a product title.');
      return;
    }

    const newProduct: SareeProduct = {
      id: 'sar-' + Date.now(),
      tailorShopId: shopId,
      tailorShopName: shopName,
      title: sareeTitle.trim(),
      category: sareeCategory,
      fabric: sareeFabric,
      price: sellPriceNum || 1400,
      mrp: mrpNum || 2400,
      discountPercent: discountPercent,
      inStock: sareeInStock,
      stockCount: parseInt(sareeStockCount, 10) || 10,
      imageUrl: sareeImageUrl || SAREE_IMAGE_PRESETS[0].url,
      description: sareeDescription,
      blouseIncluded: true,
      blouseStitchingAddonPrice: parseInt(sareeBlouseStitchingAddon, 10) || 450,
      fallPicoAddonPrice: parseInt(sareeFallPicoAddon, 10) || 99,
      tags: [sareeCategory, sareeFabric, 'Boutique Collection']
    };

    onPublishSaree(newProduct);
  };

  return (
    <View style={{ paddingHorizontal: 18 }}>
      {/* 1. Header Banner matching Screenshot 1 */}
      <View style={styles.studioHeaderBanner}>
        <View style={{ width: '100%', marginBottom: 6 }}>
          <Text style={styles.studioHeaderTitle}>Add New Saree</Text>
          <Text style={styles.studioHeaderSubtitle}>
            Add sarees with prices and stitching options.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.studioHeaderBtn}
          onPress={onBackToStore}
          activeOpacity={0.85}
        >
          <Text style={styles.studioHeaderBtnText}>← Back to Saree Store</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Main Creator Form Card */}
      <View style={styles.studioCard}>
        {/* Section 1: Product Title */}
        <Text style={styles.formSectionTitle}>1. PRODUCT TITLE *</Text>
        <View style={styles.formRow}>
          <TextInput
            style={styles.formInput}
            placeholder="Enter product title..."
            placeholderTextColor="#94A3B8"
            value={sareeTitle}
            onChangeText={setSareeTitle}
          />
        </View>

        {/* Section 3: Category & Fabric Material */}
        <Text style={styles.formSectionTitle}>3. CATEGORY & FABRIC MATERIAL *</Text>
        
        {/* Collection Category Chips */}
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Collection Category:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
          >
            {CATEGORY_OPTIONS.map(cat => {
              const isSelected = sareeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.luxuryChip, isSelected && styles.luxuryChipActive]}
                  onPress={() => setSareeCategory(cat)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.luxuryChipText, isSelected && styles.luxuryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Fabric Material Chips */}
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Fabric Material:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
          >
            {FABRIC_OPTIONS.map(fab => {
              const isSelected = sareeFabric === fab;
              return (
                <TouchableOpacity
                  key={fab}
                  style={[styles.luxuryChip, isSelected && styles.luxuryChipActive]}
                  onPress={() => setSareeFabric(fab)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.luxuryChipText, isSelected && styles.luxuryChipTextActive]}>
                    {fab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section 4: Retail Pricing & Discount */}
        <Text style={styles.formSectionTitle}>4. RETAIL PRICING & DISCOUNT *</Text>
        <View style={styles.pricingInputRow}>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Selling Price (₹) *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="1400"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sareePrice}
              onChangeText={setSareePrice}
            />
          </View>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>MRP / Original (₹)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="2400"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sareeMrp}
              onChangeText={setSareeMrp}
            />
          </View>
        </View>

        {/* Pink Discount Banner matching Screenshot 2 */}
        {discountPercent > 0 && (
          <View style={styles.pricingSummaryBox}>
            <Text style={styles.pricingSummaryText}>
              Discount to display on app: {discountPercent}% OFF (Save ₹{savingsAmount})
            </Text>
          </View>
        )}

        {/* Section 5: Inventory & Stock Status */}
        <Text style={styles.formSectionTitle}>5. INVENTORY & STOCK STATUS</Text>
        <View style={styles.pricingInputRow}>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Available Units</Text>
            <TextInput
              style={styles.formInput}
              placeholder="18"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sareeStockCount}
              onChangeText={setSareeStockCount}
            />
          </View>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Stock Status</Text>
            <TouchableOpacity
              style={[
                styles.stockToggleBtn,
                sareeInStock ? styles.stockToggleBtnIn : styles.stockToggleBtnOut
              ]}
              onPress={() => setSareeInStock(!sareeInStock)}
              activeOpacity={0.85}
            >
              <Text style={sareeInStock ? styles.stockToggleTextIn : styles.stockToggleTextOut}>
                {sareeInStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 6: High-Ticket Tailoring Bundles */}
        <Text style={styles.formSectionTitle}>6. HIGH-TICKET TAILORING BUNDLES (REVENUE MULTIPLIER)</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
          When patrons add this saree in the user app, they are prompted to add custom stitching in 1 tap:
        </Text>
        <View style={styles.pricingInputRow}>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Blouse Stitching Add-on (₹)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="450"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sareeBlouseStitchingAddon}
              onChangeText={setSareeBlouseStitchingAddon}
            />
          </View>
          <View style={styles.pricingInputCol}>
            <Text style={styles.formLabel}>Fall & Pico Add-on (₹)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="99"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={sareeFallPicoAddon}
              onChangeText={setSareeFallPicoAddon}
            />
          </View>
        </View>

        {/* Section 7: Product Description & Inclusions */}
        <Text style={styles.formSectionTitle}>7. PRODUCT DESCRIPTION & INCLUSIONS</Text>
        <View style={styles.formRow}>
          <TextInput
            style={[styles.formInput, { height: 75, textAlignVertical: 'top', paddingTop: 10 }]}
            placeholder="Enter saree description, weave details, blouse piece details..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={sareeDescription}
            onChangeText={setSareeDescription}
          />
        </View>

        {/* Section 8: Saree Photography Preset */}
        <Text style={styles.formSectionTitle}>8. SAREE PHOTOGRAPHY PRESET *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          {SAREE_IMAGE_PRESETS.map(preset => {
            const isSelected = sareeImageUrl === preset.url;
            return (
              <TouchableOpacity
                key={preset.label}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
                onPress={() => {
                  setSareeImageUrl(preset.url);
                  if (preset.fabric) setSareeFabric(preset.fabric);
                }}
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
            placeholder="Image URL"
            placeholderTextColor="#94A3B8"
            value={sareeImageUrl}
            onChangeText={setSareeImageUrl}
          />
        </View>

        {/* Live Patron App Preview Card matching Screenshot 3 */}
        <View style={styles.mockupCardWrap}>
          <View style={styles.mockupCardHeader}>
            <Text style={styles.mockupCardHeaderBadge}>LIVE PATRON APP PREVIEW (CUSTOMER CARD)</Text>
            <Text style={{ fontSize: 10, color: '#64748B' }}>Exact 2-column user app card</Text>
          </View>
          <View style={[styles.sareeCard, { alignSelf: 'center', width: 220, marginTop: 10 }]}>
            <View style={styles.sareeCardImgBox}>
              <Image source={{ uri: sareeImageUrl || SAREE_IMAGE_PRESETS[0].url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              {discountPercent > 0 && (
                <View style={styles.sareeDiscountBadge}>
                  <Text style={styles.sareeDiscountBadgeText}>{discountPercent}% OFF</Text>
                </View>
              )}
            </View>
            <View style={{ padding: 10 }}>
              <Text style={styles.sareeCardTitle} numberOfLines={1}>{sareeTitle || 'Saree'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <View style={styles.sareeFabricPill}>
                  <Text style={styles.sareeFabricPillText}>{sareeFabric || 'Silk'}</Text>
                </View>
              </View>
              <View style={styles.sareePriceRow}>
                <Text style={styles.sareePriceText}>₹{sareePrice || '1400'}</Text>
                {mrpNum > sellPriceNum && (
                  <Text style={styles.sareeMrpText}>₹{sareeMrp}</Text>
                )}
              </View>
              <View style={[styles.sareeStockPill, sareeInStock ? styles.sareeStockPillInStock : styles.sareeStockPillOut]}>
                <Text style={[styles.sareeStockPillText, { color: sareeInStock ? '#059669' : '#DC2626' }]}>
                  {sareeInStock ? `In Stock (${sareeStockCount || '18'})` : 'Out of Stock'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Publish CTA Button */}
        <TouchableOpacity
          style={[styles.btnPrimary, { marginTop: 18 }]}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Text style={styles.btnPrimaryText}>✓ Publish Saree to Boutique Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
