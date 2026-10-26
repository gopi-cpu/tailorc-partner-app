import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../../../theme/colors';

export const servicesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  tabContent: {
    flex: 1
  },

  // 1. Top Executive Bar
  servicesHeaderCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE3D5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  servicesHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  servicesHeaderSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500'
  },
  btnServicesPrimaryAction: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2
  },
  btnServicesPrimaryActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },

  // 2. Segmented Pill Switcher
  servicesSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 18,
    marginVertical: 14,
    padding: 4,
    borderRadius: 14,
    gap: 6
  },
  servicesSegmentBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  servicesSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  servicesSegmentBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  servicesSegmentBtnTextActive: {
    color: '#0F172A',
    fontWeight: '800'
  },

  // 3. Stats Strip
  servicesStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  servicesStatItem: {
    alignItems: 'center',
    flex: 1
  },
  servicesStatNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F'
  },
  servicesStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1
  },
  servicesStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0'
  },
  servicesQuickAddBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  servicesQuickAddBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E'
  },

  // 4. Search Bar
  servicesSearchContainer: {
    paddingHorizontal: 18,
    marginBottom: 12
  },
  servicesSearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 42
  },
  servicesSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0
  },
  searchClearBtn: {
    padding: 4
  },
  searchClearBtnText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700'
  },

  // 5. Category Chips (Catalog Filter)
  serviceCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8
  },
  serviceCategoryChipActive: {
    backgroundColor: '#5C2C16',
    borderColor: '#5C2C16'
  },
  serviceCategoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569'
  },
  serviceCategoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  serviceCategoryCountChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6
  },
  serviceCategoryCountChipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  serviceCategoryCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B'
  },
  serviceCategoryCountTextActive: {
    color: '#FFFFFF'
  },

  // 6. Services Cards
  serviceCatalogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  serviceCardImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#F1F5F9'
  },
  serviceCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1
  },
  serviceCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginVertical: 4
  },
  serviceCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2
  },
  servicePriceBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#5C2C16'
  },
  serviceTurnaroundText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669'
  },
  serviceDeleteBtn: {
    padding: 4
  },

  // 7. Dark Hero Banner (Saree Studio & Service Studio)
  studioHeaderBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  studioHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2
  },
  studioHeaderSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 17
  },
  studioHeaderBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)'
  },
  studioHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // 8. Studio Form Card & Form Elements
  studioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EBE3D5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20
  },
  formSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5C2C16',
    letterSpacing: 0.3,
    marginTop: 14,
    marginBottom: 8
  },
  formRow: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6
  },
  formInput: {
    backgroundColor: '#F5EFE6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E8DFD1'
  },
  pricingInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  pricingInputCol: {
    flex: 1
  },

  // 9. Luxury Chips (Form Selectors for Saree Category & Fabric)
  luxuryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#F5EFE6',
    borderWidth: 1,
    borderColor: '#E8DFD1',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  luxuryChipActive: {
    backgroundColor: '#5C2C16',
    borderColor: '#5C2C16'
  },
  luxuryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C2C16'
  },
  luxuryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },

  // 10. Pricing & Discount Box (Image 2)
  pricingSummaryBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14
  },
  pricingSummaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626'
  },

  // 11. Stock Toggle Button (Image 2)
  stockToggleBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stockToggleBtnIn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  stockToggleBtnOut: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA'
  },
  stockToggleTextIn: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669'
  },
  stockToggleTextOut: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626'
  },

  // 12. Presets Selection
  presetChip: {
    backgroundColor: '#F5EFE6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8DFD1',
    marginRight: 8
  },
  presetChipActive: {
    backgroundColor: '#5C2C16',
    borderColor: '#5C2C16'
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569'
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },

  // 13. Customer App Live Preview (Image 3)
  mockupCardWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 14
  },
  mockupCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  mockupCardHeaderBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.3
  },

  // 14. Primary CTA Buttons
  btnPrimary: {
    backgroundColor: '#5C2C16',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C2C16',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2
  },

  // 15. Saree Storefront High-Ticket Banner (Image 4)
  activeShopBanner: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  activeShopBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#9D174D'
  },
  activeShopBannerSubtitle: {
    fontSize: 11,
    color: '#701A75',
    marginTop: 4,
    lineHeight: 15
  },
  activeShopBannerAddBtn: {
    backgroundColor: '#BE185D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10
  },
  activeShopBannerAddBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // 16. Saree 2-Column Grid (Image 4)
  sareeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  sareeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBE3D5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4
  },
  sareeCardImgBox: {
    height: 150,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9'
  },
  sareeCardImg: {
    width: '100%',
    height: '100%'
  },
  sareeDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  sareeDiscountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  sareeQuickDeleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sareeCardBody: {
    padding: 10
  },
  sareeCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  sareeFabricPill: {
    backgroundColor: '#F5EFE6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4
  },
  sareeFabricPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5C2C16'
  },
  sareePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4
  },
  sareePriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  sareeMrpText: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500'
  },
  sareeStockPill: {
    marginTop: 6,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center'
  },
  sareeStockPillInStock: {
    backgroundColor: '#ECFDF5'
  },
  sareeStockPillOut: {
    backgroundColor: '#FEF2F2'
  },
  sareeStockPillText: {
    fontSize: 11,
    fontWeight: '700'
  },

  // 17. Empty State Box
  emptyCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBE3D5'
  },
  emptyCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center'
  }
});
