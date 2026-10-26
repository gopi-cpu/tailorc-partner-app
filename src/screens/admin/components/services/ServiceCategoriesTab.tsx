import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { ServiceCategoryItem } from './types';
import { servicesStyles as styles } from './styles';
import { colors } from '../../../../theme/colors';

interface Props {
  categories: ServiceCategoryItem[];
  onBackToCatalog: () => void;
  onAddCategory: (newCategory: ServiceCategoryItem) => void;
}

export default function ServiceCategoriesTab({
  categories,
  onBackToCatalog,
  onAddCategory
}: Props) {
  const [newCatName, setNewCatName] = useState('');

  const handleCreateCategory = () => {
    if (!newCatName.trim()) {
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }
    const item: ServiceCategoryItem = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim()
    };
    onAddCategory(item);
    Alert.alert('Category Created', `"${newCatName.trim()}" saved.`);
    setNewCatName('');
  };

  return (
    <View style={{ paddingHorizontal: 18 }}>
      {/* 1. Category Header Banner */}
      <View style={styles.studioHeaderBanner}>
        <View style={{ width: '100%', marginBottom: 6 }}>
          <Text style={styles.studioHeaderTitle}>Categories</Text>
          <Text style={styles.studioHeaderSubtitle}>
            Organize your services by category.
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

      {/* 2. Inline Add Category Card */}
      <View style={styles.studioCard}>
        <Text style={[styles.formSectionTitle, { marginTop: 0, marginBottom: 10 }]}>
          + Add Category
        </Text>

        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Category Name *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter category name (e.g. Bridal Lehengas)..."
            placeholderTextColor="#94A3B8"
            value={newCatName}
            onChangeText={setNewCatName}
          />
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, { marginTop: 10 }]}
          onPress={handleCreateCategory}
          activeOpacity={0.88}
        >
          <Text style={styles.btnPrimaryText}>✓ Save Category</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Existing Categories List */}
      <Text style={{ fontSize: 14, fontWeight: '800', color: colors.primary, marginTop: 4, marginBottom: 12 }}>
        Existing Categories ({categories.length}):
      </Text>
      <View style={{ gap: 10, marginBottom: 20 }}>
        {categories.map(cat => (
          <View key={cat.id || cat.name} style={styles.serviceCatalogCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.gold, marginRight: 8 }}>🏷️</Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.primary, flex: 1 }}>{cat.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
