import { StyleSheet, Platform } from 'react-native';
import { fontFamily } from '../../../../theme/typography';

export const tailorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2'
  },
  scrollList: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 140
  },

  // =========================================================================
  // 1. Executive Top Header Banner (Luxury Atelier)
  // =========================================================================
  headerCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE3D5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerIconPill: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  headerIconEmoji: {
    fontSize: 18
  },
  headerTitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.3
  },
  headerSub: {
    fontFamily,
    fontSize: 12,
    color: '#78716C',
    marginTop: 3,
    fontWeight: '500'
  },
  btnPrimaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6D2E0E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#853A14',
    shadowColor: '#3D1807',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3
  },
  btnPrimaryActionText: {
    fontFamily,
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2
  },

  // =========================================================================
  // 2. Executive Roster KPI Ribbon
  // =========================================================================
  kpiRibbon: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1
  },
  kpiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  kpiValue: {
    fontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1917'
  },
  kpiLabel: {
    fontFamily,
    fontSize: 10.5,
    fontWeight: '600',
    color: '#78716C',
    marginTop: 2
  },

  // =========================================================================
  // 3. Search Container
  // =========================================================================
  searchWrap: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontFamily,
    fontSize: 13.5,
    color: '#1C1917',
    paddingVertical: 0
  },
  clearSearchBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3ECE2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearSearchBtnText: {
    fontSize: 11,
    color: '#78716C',
    fontWeight: '700'
  },

  // =========================================================================
  // 4. Craftsman Master Card
  // =========================================================================
  cardsContainer: {
    paddingHorizontal: 16,
    marginTop: 4
  },
  tailorDirectoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    marginBottom: 14,
    shadowColor: '#6D2E0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  craftsmanIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  avatarContainer: {
    position: 'relative'
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6D2E0E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D97706',
    shadowColor: '#3D1807',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  avatarInitials: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#FEF3C7',
    letterSpacing: 0.5
  },
  onlineDotBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  craftsmanMeta: {
    flex: 1
  },
  tailorShopName: {
    fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: -0.2
  },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 3
  },
  rolePillText: {
    fontFamily,
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700'
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  btnMiniEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDFBF7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  btnMiniEditText: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6D2E0E'
  },
  btnMiniDelete: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 6,
    paddingHorizontal: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  btnMiniDeleteText: {
    fontFamily,
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DC2626'
  },

  // Details Chips (Specialties & Phone)
  cardDetails: {
    gap: 6,
    marginBottom: 12
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDFBF7',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F5EFE6'
  },
  detailChipIcon: {
    fontSize: 13
  },
  detailChipText: {
    fontFamily,
    fontSize: 12.5,
    color: '#44403C',
    fontWeight: '600'
  },

  // Stats Strip (Rating & Status)
  cardStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF7F2',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    marginBottom: 12
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#EBE3D5'
  },
  statLabel: {
    fontFamily,
    fontSize: 9.5,
    color: '#78716C',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  statVal: {
    fontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 2
  },

  // Contact Quick Actions Row (Refined Pills)
  contactActionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  contactActionBtnCall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  contactActionBtnCallText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F'
  },
  contactActionBtnWa: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  contactActionBtnWaText: {
    fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46'
  },

  // =========================================================================
  // 5. Empty State
  // =========================================================================
  emptyCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    marginTop: 12
  },
  emptyCardText: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: '#78716C',
    textAlign: 'center',
    marginBottom: 16
  },
  btnPrimary: {
    backgroundColor: '#6D2E0E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#853A14',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnPrimaryText: {
    fontFamily,
    color: '#FEF3C7',
    fontSize: 13,
    fontWeight: '800'
  },

  // =========================================================================
  // 6. Modal Styles (Add / Edit Craftsman)
  // =========================================================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6'
  },
  modalTitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1917'
  },
  modalSubtitle: {
    fontFamily,
    fontSize: 12,
    color: '#78716C',
    marginTop: 2
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3ECE2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalCloseBtnText: {
    fontSize: 14,
    color: '#78716C',
    fontWeight: '700'
  },
  formRow: {
    marginBottom: 14
  },
  formLabel: {
    fontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#44403C',
    marginBottom: 6
  },
  formInput: {
    fontFamily,
    fontSize: 14,
    color: '#1C1917',
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44
  }
});
