import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { TailorWorker } from './types';
import { tailorStyles as styles } from './styles';
import TailorCard from './TailorCard';

interface Props {
  shopName: string;
  tailors: TailorWorker[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  onEditTailor: (tailor: TailorWorker) => void;
  onDeleteTailor: (tailorId: string) => void;
}

export default function TailorsList({
  shopName,
  tailors,
  refreshing,
  onRefresh,
  onOpenAddModal,
  onEditTailor,
  onDeleteTailor
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTailors = useMemo(() => {
    if (!searchQuery.trim()) return tailors;
    const q = searchQuery.toLowerCase();
    return tailors.filter(t => {
      const matchName = (t.name || '').toLowerCase().includes(q);
      const matchRole = (t.role || '').toLowerCase().includes(q);
      const matchPhone = (t.phone || '').includes(q);
      const matchSpecialties = (t.specialties || '').toLowerCase().includes(q);
      return matchName || matchRole || matchPhone || matchSpecialties;
    });
  }, [tailors, searchQuery]);

  const activeCount = useMemo(() => {
    return tailors.filter(t => t.active !== false).length;
  }, [tailors]);

  const avgRating = useMemo(() => {
    if (tailors.length === 0) return '5.0';
    const sum = tailors.reduce((acc, t) => acc + (Number(t.rating) || 5.0), 0);
    return (sum / tailors.length).toFixed(1);
  }, [tailors]);

  return (
    <View style={styles.container}>
      {/* 1. Executive Top Header Banner (Luxury Atelier) */}
      <View style={styles.headerCard}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconPill}>
              <Text style={styles.headerIconEmoji}>✂️</Text>
            </View>
            <Text style={styles.headerTitle}>Tailors & Staff</Text>
          </View>
          <Text style={styles.headerSub}>
            Tailors working in {shopName || 'your shop'} ({tailors.length})
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnPrimaryAction}
          onPress={onOpenAddModal}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryActionText}>+ Add Tailor</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6D2E0E']}
            tintColor="#6D2E0E"
          />
        }
      >
        {/* 2. Executive Roster KPI Ribbon */}
        <View style={styles.kpiRibbon}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 14 }}>👥</Text>
            </View>
            <Text style={styles.kpiValue}>{tailors.length}</Text>
            <Text style={styles.kpiLabel}>Total Staff</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Text style={{ fontSize: 14 }}>🟢</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#059669' }]}>{activeCount}</Text>
            <Text style={styles.kpiLabel}>Active</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FFFBEB' }]}>
              <Text style={{ fontSize: 14 }}>⭐</Text>
            </View>
            <Text style={[styles.kpiValue, { color: '#B45309' }]}>{avgRating} ★</Text>
            <Text style={styles.kpiLabel}>Rating</Text>
          </View>
        </View>

        {/* 3. Artisan Instant Search Bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tailors by name or phone..."
              placeholderTextColor="#A8A29E"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.clearSearchBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 4. Tailors Cards List / Empty State */}
        <View style={styles.cardsContainer}>
          {filteredTailors.length === 0 ? (
            <View style={styles.emptyCardBox}>
              <Text style={{ fontSize: 36, marginBottom: 10 }}>✂️</Text>
              <Text style={styles.emptyCardText}>
                {searchQuery.trim()
                  ? 'No tailors found matching your search.'
                  : `No tailors registered under ${shopName || 'this shop'} yet.`}
              </Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={onOpenAddModal}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>+ Add First Tailor</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredTailors.map(t => (
              <TailorCard
                key={t.id}
                tailor={t}
                onEdit={onEditTailor}
                onDelete={onDeleteTailor}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
