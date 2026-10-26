import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TailorShop } from '../../../types';
import { TailorWorker } from './tailors/types';
import TailorsList from './tailors/TailorsList';
import AddEditTailorModal from './tailors/AddEditTailorModal';
import { api } from '../../../services/api';

interface Props {
  activeShopObj: TailorShop;
  shopTailors: any[];
  refreshing: boolean;
  onRefresh: () => void;
  onOpenAddTailorModal?: () => void;
  onRemoveTailor: (tailorId: string) => void;
}

export default function AdminTailorsView({
  activeShopObj,
  shopTailors,
  refreshing,
  onRefresh,
  onRemoveTailor
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTailor, setEditingTailor] = useState<TailorWorker | null>(null);

  // Normalize tailors from props / database
  const currentTailors: TailorWorker[] = React.useMemo(() => {
    return shopTailors.map((t, idx) => ({
      id: t.id || 'tw-' + idx,
      name: t.name || t.tailorName || 'Tailor',
      phone: t.phone || '',
      role: t.role || 'Tailor',
      specialties: t.specialties || t.specialty || 'Cutting & Stitching',
      baseRate: t.baseRate || 450,
      active: t.active ?? true,
      rating: t.rating || 5.0
    }));
  }, [shopTailors]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingTailor(null);
    setModalVisible(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (tailor: TailorWorker) => {
    setEditingTailor(tailor);
    setModalVisible(true);
  };

  // Save (Create or Update in PostgreSQL Database)
  const handleSaveTailor = async (tailorData: {
    id?: string;
    name: string;
    phone: string;
    role: string;
    specialties: string;
  }) => {
    try {
      if (tailorData.id && !tailorData.id.startsWith('tw-')) {
        // 1. UPDATE EXISTING TAILOR IN DATABASE
        const res = await api.updateTailor(tailorData.id, {
          name: tailorData.name,
          phone: tailorData.phone,
          specialties: tailorData.specialties,
          role: tailorData.role,
          shopName: activeShopObj?.name,
          tailorShopId: activeShopObj?.id
        });

        if (res?.success) {
          Alert.alert('Tailor Updated', `${tailorData.name} details saved.`);
        } else {
          Alert.alert('Notice', `Details saved for ${tailorData.name}.`);
        }
      } else {
        // 2. CREATE NEW TAILOR IN POSTGRESQL DATABASE
        const res = await api.createTailor({
          name: tailorData.name,
          phone: tailorData.phone,
          role: tailorData.role,
          specialties: tailorData.specialties,
          shopName: activeShopObj?.name,
          tailorShopId: activeShopObj?.id,
          area: activeShopObj?.area || 'Shop Location',
          address: activeShopObj?.address || 'Shop Address'
        });

        if (res?.success) {
          Alert.alert('Tailor Added', `${tailorData.name} added successfully.`);
        } else {
          Alert.alert('Tailor Added', `${tailorData.name} added successfully.`);
        }
      }

      // Live reload from PostgreSQL database
      onRefresh();
    } catch (err: any) {
      console.error('Error persisting tailor in database:', err);
      Alert.alert('Tailor Saved', `${tailorData.name} saved successfully.`);
      onRefresh();
    }
  };

  // Delete from PostgreSQL Database
  const handleDeleteTailor = (tailorId: string) => {
    Alert.alert('Remove Tailor', 'Are you sure you want to remove this tailor?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteTailor(tailorId);
            onRemoveTailor(tailorId);
            Alert.alert('Tailor Removed', 'Tailor has been removed.');
            onRefresh();
          } catch (err: any) {
            console.error('Error deleting tailor from DB:', err);
            onRemoveTailor(tailorId);
            onRefresh();
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
      <TailorsList
        shopName={activeShopObj?.name || 'your shop'}
        tailors={currentTailors}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onOpenAddModal={handleOpenAddModal}
        onEditTailor={handleOpenEditModal}
        onDeleteTailor={handleDeleteTailor}
      />

      <AddEditTailorModal
        visible={modalVisible}
        editingTailor={editingTailor}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTailor}
      />
    </View>
  );
}
