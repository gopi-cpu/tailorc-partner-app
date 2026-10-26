import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Linking } from 'react-native';
import { colors } from '../../../theme/colors';
import { fontFamily } from '../../../theme/typography';
import { Order, TailorShop, Service, ShopSubscriptionPlan, SUBSCRIPTION_PLANS } from '../../../types';
import { useLanguage } from '../../../i18n/LanguageContext';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  shopTailors: any[];
  onAssignTailor: (orderId: string, tailorName: string) => void;
  formatDeliveryDate: (dateStr?: string) => string;
}

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  shopTailors,
  onAssignTailor,
  formatDeliveryDate
}: OrderDetailModalProps) {
  const { language } = useLanguage();
  if (!order) return null;

  const loc = (en: string, te: string, hi: string, ta: string, kn: string) => {
    if (language === 'te') return te;
    if (language === 'hi') return hi;
    if (language === 'ta') return ta;
    if (language === 'kn') return kn;
    return en;
  };

  const statusSteps = [
    'PENDING',
    'CONFIRMED',
    'MEASURED',
    'CUTTING',
    'STITCHING',
    'TRIAL_READY',
    'DELIVERED'
  ];

  return (
    <Modal visible={!!order} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Order Details · #{order.id}</Text>
              <Text style={styles.modalSubtitle}>{order.customerName} • {order.customerPhone}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Status Stepper */}
            <Text style={styles.sectionLabel}>{loc('Order Status', 'ఆర్డర్ స్థితి', 'ऑर्डर स्थिति', 'ஆர்டர் நிலை', 'ಆರ್ಡರ್ ಸ್ಥಿತಿ')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 14 }}>
              {statusSteps.map((st) => {
                const isActive = order.status === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.statusStepPill, isActive && styles.statusStepPillActive]}
                    onPress={() => onUpdateStatus(order.id, st)}
                  >
                    <Text style={[styles.statusStepPillText, isActive && styles.statusStepPillTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Service & Pricing Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>{loc('Service:', 'సేవ:', 'सेवा:', 'சேவை:', 'ಸೇವೆ:')}</Text>
                <Text style={styles.infoRowValue}>{order.serviceName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>{loc('Total Amount:', 'మొత్తం ధర:', 'कुल राशि:', 'மொத்த தொகை:', 'ಒಟ್ಟು ಮೊತ್ತ:')}</Text>
                <Text style={styles.infoRowValue}>₹{order.totalAmount}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>{loc('Advance Paid:', 'అడ్వాన్స్ చెల్లించినది:', 'अग्रिम भुगतान:', 'முன்பணம்:', 'ಮುಂಗಡ ಪಾವತಿ:')}</Text>
                <Text style={[styles.infoRowValue, { color: '#16A34A' }]}>₹{order.advancePaid || 0}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>{loc('Balance Due:', 'బాకీ ఉన్నది:', 'बकाया राशि:', 'நிலுவை தொகை:', 'ಬಾಕಿ ಮೊತ್ತ:')}</Text>
                <Text style={[styles.infoRowValue, { color: '#DC2626' }]}>₹{order.balanceDue || 0}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoRowLabel}>{loc('Delivery Due Date:', 'డెలివరీ గడువు తేదీ:', 'डिलीवरी तारीख:', 'டெலிவரி தேதி:', 'ತಲುಪಿಸುವ ದಿನಾಂಕ:')}</Text>
                <Text style={styles.infoRowValue}>{formatDeliveryDate(order.deliveryDate)}</Text>
              </View>
            </View>

            {/* Measurements Grid */}
            {order.measurements && Object.keys(order.measurements).length > 0 ? (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.sectionLabel}>{loc('Customer Measurements (Inches)', 'కస్టమర్ కొలతలు (అంగుళాలు)', 'ग्राहक नाप (इंच में)', 'வாடிக்கையாளர் அளவீடுகள் (இன்ச்)', 'ಗ್ರಾಹಕರ ಅಳತೆಗಳು (ಇಂಚುಗಳು)')}</Text>
                <View style={styles.measurementsGrid}>
                  {Object.entries(order.measurements).map(([k, v]) => (
                    <View key={k} style={styles.measureItem}>
                      <Text style={styles.measureKey}>{k}</Text>
                      <Text style={styles.measureVal}>{String(v)}"</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Special Instructions */}
            {order.specialNotes ? (
              <View style={[styles.infoCard, { marginTop: 14, backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#92400E' }}>{loc('Special Instructions:', 'ప్రత్యేక సూచనలు:', 'विशेष निर्देश:', 'சிறப்பு வழிமுறைகள்:', 'ವಿಶೇಷ ಸೂಚನೆಗಳು:')}</Text>
                <Text style={{ fontSize: 12.5, color: '#451A03', marginTop: 4 }}>{order.specialNotes}</Text>
              </View>
            ) : null}

            {/* Quick Contact Buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}
                onPress={() => {
                  const msg = `Namaste ${order.customerName}! Your order #${order.id} (${order.serviceName}) status: ${order.status}. Due Balance: ₹${order.balanceDue || 0}.`;
                  Linking.openURL(`https://wa.me/91${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`);
                }}
              >
                <Text style={[styles.actionBtnText, { color: '#166534' }]}>💬 WhatsApp Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                onPress={() => Linking.openURL(`tel:${order.customerPhone}`)}
              >
                <Text style={[styles.actionBtnText, { color: '#1D4ED8' }]}>📞 Call Customer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface AddTailorModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string, role: string, rate: string) => void;
}

export function AddTailorModal({ visible, onClose, onAdd }: AddTailorModalProps) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState('Stitching Specialist');
  const [rate, setRate] = React.useState('450');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter tailor name.');
      return;
    }
    onAdd(name.trim(), phone.trim(), role.trim(), rate.trim());
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>+ Add Tailor</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Tailor Name *</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. Master Rafiq" value={name} onChangeText={setName} />
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Mobile Phone</Text>
            <TextInput style={styles.modalInput} placeholder="10-digit phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Role / Specialization</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. Blouse Specialist, Cutting Master" value={role} onChangeText={setRole} />
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Base Rate (₹)</Text>
            <TextInput style={styles.modalInput} placeholder="450" keyboardType="numeric" value={rate} onChangeText={setRate} />
          </View>

          <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSubmit}>
            <Text style={styles.modalSubmitBtnText}>✓ Save Tailor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

interface AddServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, category: string, price: string, days: string, desc: string) => void;
}

export function AddServiceModal({ visible, onClose, onAdd }: AddServiceModalProps) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Women Blouse');
  const [price, setPrice] = React.useState('550');
  const [days, setDays] = React.useState('3');
  const [desc, setDesc] = React.useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter service title.');
      return;
    }
    onAdd(name.trim(), category.trim(), price.trim(), days.trim(), desc.trim());
    setName('');
    setDesc('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>+ Add Service</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Service Name *</Text>
            <TextInput style={styles.modalInput} placeholder="e.g. Pattu Blouse with Piping" value={name} onChangeText={setName} />
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Category</Text>
            <TextInput style={styles.modalInput} placeholder="Women Blouse, Kurti, Salwar" value={category} onChangeText={setCategory} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[styles.modalFormGroup, { flex: 1 }]}>
              <Text style={styles.modalLabel}>Price (₹) *</Text>
              <TextInput style={styles.modalInput} keyboardType="numeric" placeholder="550" value={price} onChangeText={setPrice} />
            </View>
            <View style={[styles.modalFormGroup, { flex: 1 }]}>
              <Text style={styles.modalLabel}>Est. Days</Text>
              <TextInput style={styles.modalInput} keyboardType="numeric" placeholder="3" value={days} onChangeText={setDays} />
            </View>
          </View>

          <View style={styles.modalFormGroup}>
            <Text style={styles.modalLabel}>Description</Text>
            <TextInput style={[styles.modalInput, { height: 60 }]} multiline placeholder="Service inclusions..." value={desc} onChangeText={setDesc} />
          </View>

          <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSubmit}>
            <Text style={styles.modalSubmitBtnText}>✓ Save Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

interface UpgradePlanModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan: ShopSubscriptionPlan;
  onSelectPlan: (plan: ShopSubscriptionPlan) => void;
}

export function UpgradePlanModal({ visible, onClose, currentPlan, onSelectPlan }: UpgradePlanModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Subscription Plans</Text>
              <Text style={styles.modalSubtitle}>Choose a plan for your tailor shop</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(SUBSCRIPTION_PLANS).map(([planKey, planMeta]) => {
              const isCurrent = currentPlan === planKey;
              return (
                <View key={planKey} style={[styles.planCard, isCurrent && styles.planCardActive]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <Text style={styles.planCardTitle}>{planMeta.name}</Text>
                    <Text style={styles.planCardPrice}>₹{planMeta.monthlyPrice}/mo</Text>
                  </View>
                  <Text style={styles.planCardDesc}>{planMeta.description}</Text>

                  <TouchableOpacity
                    style={[styles.planSelectBtn, isCurrent && { backgroundColor: '#16A34A' }]}
                    onPress={() => {
                      onSelectPlan(planKey as ShopSubscriptionPlan);
                      onClose();
                    }}
                  >
                    <Text style={styles.planSelectBtnText}>
                      {isCurrent ? '✓ Current Plan Active' : 'Switch to this Plan →'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  modalContentLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 540,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  modalTitle: {
    fontFamily,
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A'
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B'
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 8
  },
  statusStepPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statusStepPillActive: {
    backgroundColor: '#78350F',
    borderColor: '#78350F'
  },
  statusStepPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  statusStepPillTextActive: {
    color: '#FFFFFF'
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoRowLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  infoRowValue: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A'
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  measureItem: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  measureKey: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600'
  },
  measureVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  modalFormGroup: {
    marginBottom: 12
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13.5,
    color: '#0F172A'
  },
  modalSubmitBtn: {
    backgroundColor: '#78350F',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800'
  },
  planCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  planCardActive: {
    borderColor: '#78350F',
    backgroundColor: '#FEF3C7'
  },
  planCardTitle: {
    fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  planCardPrice: {
    fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309'
  },
  planCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10
  },
  planSelectBtn: {
    backgroundColor: '#78350F',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center'
  },
  planSelectBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});
