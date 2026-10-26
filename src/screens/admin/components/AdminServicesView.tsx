import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Service, TailorShop } from '../../../types';
import { useLanguage } from '../../../i18n/LanguageContext';
import {
  SareeProduct,
  ServiceCategoryItem,
  INITIAL_SAREES,
  INITIAL_CATEGORIES
} from './services/types';
import { servicesStyles as styles } from './services/styles';

// Modular Child Components
import ServicesCatalogTab from './services/ServicesCatalogTab';
import ServiceStudioTab from './services/ServiceStudioTab';
import SareeStoreTab from './services/SareeStoreTab';
import SareeStudioTab from './services/SareeStudioTab';
import ServiceCategoriesTab from './services/ServiceCategoriesTab';

interface Props {
  activeShopObj?: TailorShop;
  services: Service[];
  sarees?: SareeProduct[];
  categories?: ServiceCategoryItem[];
  tailors?: any[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onOpenAddServiceModal?: () => void;
  onPublishService?: (service: Service) => void;
  onDeleteService?: (id: string) => void;
  onPublishSaree?: (saree: SareeProduct) => void;
  onDeleteSaree?: (id: string) => void;
  onToggleSareeStock?: (id: string) => void;
  onAddCategory?: (category: ServiceCategoryItem) => void;
}

export default function AdminServicesView({
  activeShopObj,
  services = [],
  sarees = [],
  categories = [],
  tailors = [],
  refreshing = false,
  onRefresh,
  onOpenAddServiceModal,
  onPublishService,
  onDeleteService,
  onPublishSaree,
  onDeleteSaree,
  onToggleSareeStock,
  onAddCategory
}: Props) {
  const { language } = useLanguage();

  const canListServices = activeShopObj?.canListServicesOnline ?? true;
  const canSellSarees = activeShopObj?.canSellSareesOnline ?? true;

  // Subtab navigation: 'catalog' | 'add-studio' | 'sarees' | 'add-saree' | 'categories'
  const [servicesSubTab, setServicesSubTab] = useState<'catalog' | 'add-studio' | 'sarees' | 'add-saree' | 'categories'>('catalog');

  // Dynamic Current Data (Multi-tenant for active shop)
  const currentServices = services;
  const currentSarees = sarees;
  const currentCategories = (categories && categories.length > 0) ? categories : INITIAL_CATEGORIES;

  const availableCategoryNames = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    currentCategories.forEach(c => cats.add(c.name));
    currentServices.forEach(s => {
      if ((s as any).categoryName) cats.add((s as any).categoryName);
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [currentCategories, currentServices]);

  // Saree Handlers
  const handlePublishSaree = (newSaree: SareeProduct) => {
    if (onPublishSaree) {
      onPublishSaree(newSaree);
    }
    Alert.alert('Saree Added', `"${newSaree.title}" added to store.`);
    setServicesSubTab('sarees');
  };

  const handleToggleSareeStock = (id: string) => {
    if (onToggleSareeStock) {
      onToggleSareeStock(id);
    }
  };

  const handleDeleteSaree = (id: string) => {
    if (onDeleteSaree) {
      onDeleteSaree(id);
    }
  };

  // Service Handlers
  const handlePublishService = (newService: Service) => {
    if (onPublishService) {
      onPublishService(newService);
    }
    Alert.alert('Service Added', `"${newService.name}" added successfully.`);
    setServicesSubTab('catalog');
  };

  const handleDeleteService = (id: string) => {
    if (onDeleteService) {
      onDeleteService(id);
    }
  };

  const handleAddCategory = (newCategory: ServiceCategoryItem) => {
    if (onAddCategory) {
      onAddCategory(newCategory);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.tabContent}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* 1. Executive Services Top Bar */}
        <View style={styles.servicesHeaderCard}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.servicesHeaderTitle}>
              {canListServices && canSellSarees ? 'Services & Sarees' :
               canSellSarees ? 'Sarees' :
               'Stitching Services'}
            </Text>
            <Text style={styles.servicesHeaderSub}>
              {canListServices && canSellSarees ? `Services and sarees for ${activeShopObj?.name || 'your shop'}` :
               canSellSarees ? `Sarees for ${activeShopObj?.name || 'your shop'}` :
               `Services for ${activeShopObj?.name || 'your shop'}`}
            </Text>
          </View>

          {/* Dynamic Top Action Button */}
          {servicesSubTab === 'catalog' && canListServices && (
            <TouchableOpacity
              style={styles.btnServicesPrimaryAction}
              onPress={() => setServicesSubTab('add-studio')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnServicesPrimaryActionText}>+ Add Service</Text>
            </TouchableOpacity>
          )}

          {servicesSubTab === 'sarees' && canSellSarees && (
            <TouchableOpacity
              style={styles.btnServicesPrimaryAction}
              onPress={() => setServicesSubTab('add-saree')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnServicesPrimaryActionText}>+ Add Saree</Text>
            </TouchableOpacity>
          )}

          {servicesSubTab === 'categories' && canListServices && (
            <TouchableOpacity
              style={styles.btnServicesPrimaryAction}
              onPress={() => {}}
              activeOpacity={0.85}
            >
              <Text style={styles.btnServicesPrimaryActionText}>+ Category</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Segmented Pill Switcher (Shows only enabled modules) */}
        {(servicesSubTab === 'catalog' || servicesSubTab === 'sarees' || servicesSubTab === 'categories') && (
          <View style={styles.servicesSegmentContainer}>
            {canListServices && (
              <TouchableOpacity
                style={[styles.servicesSegmentBtn, servicesSubTab === 'catalog' && styles.servicesSegmentBtnActive]}
                onPress={() => setServicesSubTab('catalog')}
                activeOpacity={0.85}
              >
                <Text style={[styles.servicesSegmentBtnText, servicesSubTab === 'catalog' && styles.servicesSegmentBtnTextActive]}>
                  ✂️ Services ({currentServices.length})
                </Text>
              </TouchableOpacity>
            )}

            {canSellSarees && (
              <TouchableOpacity
                style={[styles.servicesSegmentBtn, servicesSubTab === 'sarees' && styles.servicesSegmentBtnActive]}
                onPress={() => setServicesSubTab('sarees')}
                activeOpacity={0.85}
              >
                <Text style={[styles.servicesSegmentBtnText, servicesSubTab === 'sarees' && styles.servicesSegmentBtnTextActive]}>
                  🥻 Saree Store ({currentSarees.length})
                </Text>
              </TouchableOpacity>
            )}

            {canListServices && (
              <TouchableOpacity
                style={[styles.servicesSegmentBtn, servicesSubTab === 'categories' && styles.servicesSegmentBtnActive]}
                onPress={() => setServicesSubTab('categories')}
                activeOpacity={0.85}
              >
                <Text style={[styles.servicesSegmentBtnText, servicesSubTab === 'categories' && styles.servicesSegmentBtnTextActive]}>
                  🏷️ Categories ({availableCategoryNames.filter(c => c !== 'All').length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 3. SUBTAB 1: SERVICES CATALOG LIST */}
        {servicesSubTab === 'catalog' && canListServices && (
          <ServicesCatalogTab
            services={currentServices}
            availableCategories={availableCategoryNames}
            onOpenAddStudio={() => setServicesSubTab('add-studio')}
            onDeleteService={handleDeleteService}
          />
        )}

        {/* 4. SUBTAB 2: SERVICE STUDIO (ADD SERVICE FORM - IMAGE 5) */}
        {servicesSubTab === 'add-studio' && (
          <ServiceStudioTab
            onBackToCatalog={() => setServicesSubTab('catalog')}
            onPublishService={handlePublishService}
            categories={availableCategoryNames.filter(c => c !== 'All')}
            shopId={activeShopObj?.id}
            shopName={activeShopObj?.name}
            onOpenAddCategoryModal={() => setServicesSubTab('categories')}
          />
        )}

        {/* 5. SUBTAB 3: SAREE STOREFRONT (IMAGE 4) */}
        {servicesSubTab === 'sarees' && canSellSarees && (
          <SareeStoreTab
            sarees={currentSarees}
            onOpenAddSaree={() => setServicesSubTab('add-saree')}
            onToggleStock={handleToggleSareeStock}
            onDeleteSaree={handleDeleteSaree}
          />
        )}

        {/* 6. SUBTAB 4: SAREE PRODUCTION & BOUTIQUE CREATOR (IMAGES 1, 2, 3) */}
        {servicesSubTab === 'add-saree' && (
          <SareeStudioTab
            onBackToStore={() => setServicesSubTab('sarees')}
            onPublishSaree={handlePublishSaree}
            shopId={activeShopObj?.id}
            shopName={activeShopObj?.name}
          />
        )}

        {/* 7. SUBTAB 5: CATEGORIES MANAGER */}
        {servicesSubTab === 'categories' && (
          <ServiceCategoriesTab
            categories={currentCategories}
            onBackToCatalog={() => setServicesSubTab('catalog')}
            onAddCategory={handleAddCategory}
          />
        )}
      </ScrollView>
    </View>
  );
}