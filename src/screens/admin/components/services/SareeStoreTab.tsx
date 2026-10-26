import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { SareeProduct } from './types';
import { servicesStyles as styles } from './styles';

interface Props {
  sarees: SareeProduct[];
  onOpenAddSaree: () => void;
  onToggleStock: (id: string) => void;
  onDeleteSaree: (id: string) => void;
}

const SAREE_CATEGORIES = ['All', 'Saree', 'Saree Fabric', 'Summer Collection', 'Pure Silk', 'Georgette'];

export default function SareeStoreTab({
  sarees,
  onOpenAddSaree,
  onToggleStock,
  onDeleteSaree
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSarees = useMemo(() => {
    if (selectedCategory === 'All') return sarees;
    return sarees.filter(
      s => s.category === selectedCategory || s.fabric === selectedCategory
    );
  }, [sarees, selectedCategory]);

  const handleDelete = (id: string) => {
    Alert.alert('Remove Saree', 'Are you sure you want to remove this item from your boutique?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onDeleteSaree(id)
      }
    ]);
  };

  return (
    <View style={{ paddingHorizontal: 18, gap: 14 }}>
      {/* 1. Saree High-Ticket Banner Card matching Screenshot 4 */}
      <View style={styles.activeShopBanner}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.activeShopBannerTitle}>Sarees & Stitching Store</Text>
          <Text style={styles.activeShopBannerSubtitle}>
            Manage your saree collection and stock status.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.activeShopBannerAddBtn}
          onPress={onOpenAddSaree}
          activeOpacity={0.85}
        >
          <Text style={styles.activeShopBannerAddBtnText}>+ New Saree</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Filter Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
      >
        {SAREE_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.serviceCategoryChip,
                isSelected && styles.serviceCategoryChipActive,
                { paddingHorizontal: 18 }
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.85}
            >
              <Text style={[styles.serviceCategoryChipText, isSelected && styles.serviceCategoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Saree 2-Column Grid matching Screenshot 4 */}
      <View style={styles.sareeGrid}>
        {filteredSarees.length === 0 ? (
          <View style={[styles.emptyCardBox, { width: '100%', marginVertical: 20 }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>🥻</Text>
            <Text style={styles.emptyCardText}>No sarees added yet.</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
              Add sarees to showcase in your shop.
            </Text>
            <TouchableOpacity
              style={[styles.btnPrimary, { marginTop: 14, paddingHorizontal: 20 }]}
              onPress={onOpenAddSaree}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>+ Add Saree</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredSarees.map(s => (
            <View key={s.id} style={styles.sareeCard}>
              <View style={styles.sareeCardImgBox}>
                <Image source={{ uri: s.imageUrl }} style={styles.sareeCardImg} resizeMode="cover" />
                {s.discountPercent > 0 && (
                  <View style={styles.sareeDiscountBadge}>
                    <Text style={styles.sareeDiscountBadgeText}>{s.discountPercent}% OFF</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.sareeQuickDeleteBtn}
                  onPress={() => handleDelete(s.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '800' }}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sareeCardBody}>
                <Text style={styles.sareeCardTitle} numberOfLines={1}>{s.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 3 }}>
                  <View style={styles.sareeFabricPill}>
                    <Text style={styles.sareeFabricPillText}>{s.fabric}</Text>
                  </View>
                  {s.category !== s.fabric && (
                    <View style={styles.sareeFabricPill}>
                      <Text style={styles.sareeFabricPillText}>{s.category}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.sareePriceRow}>
                  <Text style={styles.sareePriceText}>₹{s.price}</Text>
                  {s.mrp > s.price && (
                    <Text style={styles.sareeMrpText}>₹{s.mrp}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.sareeStockPill,
                    s.inStock ? styles.sareeStockPillInStock : styles.sareeStockPillOut
                  ]}
                  onPress={() => onToggleStock(s.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.sareeStockPillText, { color: s.inStock ? '#059669' : '#DC2626' }]}>
                    {s.inStock ? `In Stock (${s.stockCount})` : 'Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
