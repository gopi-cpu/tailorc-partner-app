import React, { useState, useMemo } from 'react';
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

interface Props {
  services: Service[];
  availableCategories: string[];
  onOpenAddStudio: () => void;
  onDeleteService?: (id: string) => void;
}

export default function ServicesCatalogTab({
  services,
  availableCategories,
  onOpenAddStudio,
  onDeleteService
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: services.length };
    services.forEach(s => {
      const cat = (s as any).categoryName || s.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      if (selectedCategory !== 'All') {
        const cat = (s as any).categoryName || s.category || '';
        if (cat.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchCat = ((s as any).categoryName || s.category || '').toLowerCase().includes(q);
        const matchDesc = (s.description || '').toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchDesc) return false;
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleDelete = (id: string) => {
    Alert.alert('Remove Service', 'Are you sure you want to remove this service from your catalog?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          if (onDeleteService) onDeleteService(id);
        }
      }
    ]);
  };

  return (
    <>
      {/* 1. Quick Stats Strip */}
      <View style={styles.servicesStatsStrip}>
        <View style={styles.servicesStatItem}>
          <Text style={styles.servicesStatNumber}>{services.length}</Text>
          <Text style={styles.servicesStatLabel}>Shop Services</Text>
        </View>
        <View style={styles.servicesStatDivider} />
        <View style={styles.servicesStatItem}>
          <Text style={styles.servicesStatNumber}>{availableCategories.filter(c => c !== 'All').length}</Text>
          <Text style={styles.servicesStatLabel}>Categories</Text>
        </View>
        <View style={styles.servicesStatDivider} />
        <View style={styles.servicesStatItem}>
          <Text style={styles.servicesStatNumber}>{filteredServices.length}</Text>
          <Text style={styles.servicesStatLabel}>Matching</Text>
        </View>
        <View style={styles.servicesStatDivider} />
        <TouchableOpacity
          style={styles.servicesQuickAddBtn}
          onPress={onOpenAddStudio}
          activeOpacity={0.8}
        >
          <Text style={styles.servicesQuickAddBtnText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Instant Search Bar */}
      <View style={styles.servicesSearchContainer}>
        <View style={styles.servicesSearchInputWrap}>
          <TextInput
            style={styles.servicesSearchInput}
            placeholder="Search your services, categories, prices..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
              <Text style={styles.searchClearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Category Filter Chips with Badges */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 18, marginBottom: 14 }}
      >
        {availableCategories.map(cat => {
          const count = categoryCounts[cat] ?? 0;
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.serviceCategoryChip, isSelected && styles.serviceCategoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.85}
            >
              <Text style={[styles.serviceCategoryChipText, isSelected && styles.serviceCategoryChipTextActive]}>
                {cat}
              </Text>
              <View style={[styles.serviceCategoryCountChip, isSelected && styles.serviceCategoryCountChipActive]}>
                <Text style={[styles.serviceCategoryCountText, isSelected && styles.serviceCategoryCountTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Service Cards List */}
      <View style={{ paddingHorizontal: 18, gap: 12 }}>
        {filteredServices.length === 0 ? (
          <View style={styles.emptyCardBox}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>✂️</Text>
            <Text style={styles.emptyCardText}>No services added yet.</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
              Tap below to add your first service.
            </Text>
            <TouchableOpacity
              style={[styles.btnPrimary, { marginTop: 14, paddingHorizontal: 20 }]}
              onPress={onOpenAddStudio}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>+ Add Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredServices.map(s => {
            const price = (s as any).startingPrice ?? s.basePrice ?? 450;
            const turnaround = (s as any).turnaround ?? (s.estimatedDays ? `${s.estimatedDays} Days Turnaround` : '3-4 Days Turnaround');
            return (
              <View key={s.id} style={styles.serviceCatalogCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: (s as any).imageUrl || SERVICE_IMAGE_PRESETS[0].url }}
                    style={styles.serviceCardImage}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1, paddingLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={styles.serviceCardTitle} numberOfLines={1}>{s.name}</Text>
                      {onDeleteService && (
                        <TouchableOpacity
                          onPress={() => handleDelete(s.id)}
                          style={styles.serviceDeleteBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '700' }}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.serviceCardDesc} numberOfLines={2}>
                      {s.description || 'Custom stitching with perfect fit.'}
                    </Text>
                    <View style={styles.serviceCardFooter}>
                      <Text style={styles.servicePriceBold}>₹{price}</Text>
                      <Text style={styles.serviceTurnaroundText}>⚡ {turnaround}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </>
  );
}
