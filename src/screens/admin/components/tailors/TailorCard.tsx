import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { TailorWorker } from './types';
import { tailorStyles as styles } from './styles';

interface Props {
  tailor: TailorWorker;
  onEdit: (tailor: TailorWorker) => void;
  onDelete: (tailorId: string) => void;
}

export default function TailorCard({ tailor, onEdit, onDelete }: Props) {
  const phone = tailor.phone || '';

  const initials = (tailor.name || 'TW')
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'TC';

  const handleCall = () => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = () => {
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      Linking.openURL(`https://wa.me/91${cleanPhone}`);
    }
  };

  return (
    <View style={styles.tailorDirectoryCard}>
      {/* 1. Top Row: Craftsman Identity (Avatar + Name + Role) & Action Buttons */}
      <View style={styles.cardTopRow}>
        <View style={styles.craftsmanIdentity}>
          {/* Artisan Avatar with Online Duty Indicator */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <View style={styles.onlineDotBadge} />
          </View>

          {/* Name & Role Tag */}
          <View style={styles.craftsmanMeta}>
            <Text style={styles.tailorShopName} numberOfLines={1}>{tailor.name}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>{tailor.role || 'Tailor'}</Text>
            </View>
          </View>
        </View>

        {/* Edit & Delete Mini Action Buttons */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity
            style={styles.btnMiniEdit}
            onPress={() => onEdit(tailor)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnMiniEditText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnMiniDelete}
            onPress={() => onDelete(tailor.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnMiniDeleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Details Chips: Specialties & Contact */}
      <View style={styles.cardDetails}>
        <View style={styles.detailChip}>
          <Text style={styles.detailChipIcon}>✂️</Text>
          <Text style={styles.detailChipText} numberOfLines={1}>
            {tailor.specialties || 'Cutting & Stitching'}
          </Text>
        </View>

        {phone ? (
          <View style={styles.detailChip}>
            <Text style={styles.detailChipIcon}>📞</Text>
            <Text style={styles.detailChipText}>{phone}</Text>
          </View>
        ) : null}
      </View>

      {/* 3. Performance & Status Strip */}
      <View style={styles.cardStatsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>RATING</Text>
          <Text style={styles.statVal}>⭐ {tailor.rating ? Number(tailor.rating).toFixed(1) : '4.9'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>STATUS</Text>
          <Text style={[styles.statVal, { color: '#059669' }]}>🟢 Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>EXPERIENCE</Text>
          <Text style={[styles.statVal, { color: '#B45309' }]}>Expert</Text>
        </View>
      </View>

      {/* 4. Quick Contact Actions (Call & WhatsApp) */}
      {phone ? (
        <View style={styles.contactActionsRow}>
          <TouchableOpacity
            style={styles.contactActionBtnCall}
            onPress={handleCall}
            activeOpacity={0.85}
          >
            <Text style={styles.contactActionBtnCallText}>📞 Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactActionBtnWa}
            onPress={handleWhatsApp}
            activeOpacity={0.85}
          >
            <Text style={styles.contactActionBtnWaText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
