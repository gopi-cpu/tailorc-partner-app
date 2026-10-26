import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { TailorWorker } from './types';
import { tailorStyles as styles } from './styles';

interface Props {
  visible: boolean;
  editingTailor: TailorWorker | null;
  onClose: () => void;
  onSave: (tailorData: {
    id?: string;
    name: string;
    phone: string;
    role: string;
    specialties: string;
  }) => void;
}

export default function AddEditTailorModal({
  visible,
  editingTailor,
  onClose,
  onSave
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Tailor');
  const [specialties, setSpecialties] = useState('Cutting & Stitching');

  useEffect(() => {
    if (editingTailor) {
      setName(editingTailor.name || '');
      setPhone(editingTailor.phone || '');
      setRole(editingTailor.role || 'Master Craftsman');
      setSpecialties(editingTailor.specialties || 'Master Cutting & Stitching');
    } else {
      setName('');
      setPhone('');
      setRole('Master Craftsman');
      setSpecialties('Master Cutting & Stitching');
    }
  }, [editingTailor, visible]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter tailor name.');
      return;
    }

    onSave({
      id: editingTailor ? editingTailor.id : undefined,
      name: name.trim(),
      phone: phone.trim(),
      role: role.trim() || 'Tailor',
      specialties: specialties.trim() || 'Cutting & Stitching'
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.modalTitle}>
                {editingTailor ? 'Edit Tailor' : '+ Add Tailor'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Add a tailor or worker to your shop
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} activeOpacity={0.8}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Tailor Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter tailor full name..."
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter 10-digit phone number..."
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Role / Designation</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Master Cutter, Maggam Specialist..."
                placeholderTextColor="#94A3B8"
                value={role}
                onChangeText={setRole}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Specialties & Skills</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Bridal Blouse, Sherwani Fitting, Lehengas..."
                placeholderTextColor="#94A3B8"
                value={specialties}
                onChangeText={setSpecialties}
              />
            </View>



            {/* Save CTA */}
            <TouchableOpacity
              style={[styles.btnPrimary, { marginTop: 14 }]}
              onPress={handleSubmit}
              activeOpacity={0.88}
            >
              <Text style={styles.btnPrimaryText}>
                {editingTailor ? '✓ Save Changes' : '✓ Add Craftsman to Workshop'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
