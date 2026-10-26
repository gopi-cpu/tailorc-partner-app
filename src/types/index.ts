export type UserRole = 'ADMIN' | 'TAILOR' | 'CUSTOMER';

export type ShopOperatingModel = 'SOLO' | 'MULTI';

export interface ShopCraftsman {
  id: string;
  name: string;
  role: string;
  phone?: string;
  specialty?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  tailorShopId?: string | null;
  shop?: TailorShop | null;
  shopName?: string | null;
}

export type ShopSubscriptionPlan = 
  | 'MANAGEMENT_ONLY'      // Tier 1: In-Shop POS & Tailoring Management (₹499/mo)
  | 'SERVICES_ONLINE'      // Tier 2: Online Tailoring Services & App Bookings (₹999/mo)
  | 'SAREE_STORE_ONLY'     // Tier 3: Boutique Saree & Clothes Selling (₹1,499/mo)
  | 'OMNICHANNEL_SUITE';   // Tier 4: All-In-One Omnichannel Suite (₹1,999/mo)

export interface TailorShop {
  id: string;
  name: string;
  city?: string;
  area: string;
  address: string;
  landmark?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  rating?: number;
  reviewsCount?: number;
  specialties?: string;
  baseRate?: number;
  rates?: Record<string, number>;
  status?: string;
  operatingModel?: ShopOperatingModel;
  teamSize?: number;
  teamMembers?: ShopCraftsman[];
  ownerName?: string;
  experienceYears?: number;
  workshopHours?: string;
  hasTrialRoom?: boolean;
  turnaroundDays?: string;
  upiId?: string;
  subscriptionPlan?: ShopSubscriptionPlan;
  subscriptionStatus?: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
  canManageInShopOrders?: boolean;
  canListServicesOnline?: boolean;
  canSellSareesOnline?: boolean;
  customMeasurements?: CustomMeasurementField[];
  customMeasurementsJson?: string;
  createdAt?: string;
}

export interface CustomMeasurementField {
  id: string;
  en: string;
  hi?: string;
  bodyType: 'upper' | 'lower';
  def: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  emoji: string;
  tailorShopId?: string | null;
}

export const SUBSCRIPTION_PLANS: Record<ShopSubscriptionPlan, {
  name: string;
  monthlyPrice: number;
  description: string;
  features: string[];
}> = {
  MANAGEMENT_ONLY: {
    name: 'Solo Atelier Basic',
    monthlyPrice: 499,
    description: 'In-shop offline orders, paperless naap ledger, and customer CRM.',
    features: ['In-shop order entries', '18-point biometric naap passport', 'Offline POS billing', 'Staff assignments']
  },
  SERVICES_ONLINE: {
    name: 'Online Booking Studio',
    monthlyPrice: 999,
    description: 'Accept customer orders & digital appointments from TailorC User App.',
    features: ['Publish tailor services to app', 'Customer app push notifications', 'Online appointment booking', 'In-shop POS included']
  },
  SAREE_STORE_ONLY: {
    name: 'Boutique Saree Merchant',
    monthlyPrice: 1499,
    description: 'Sell pure silk sarees, dress materials & ready-to-wear garments online.',
    features: ['Online saree storefront', 'Stock inventory manager', 'Fall & pico addons', 'Integrated payment payouts']
  },
  OMNICHANNEL_SUITE: {
    name: 'Omnichannel Enterprise',
    monthlyPrice: 1999,
    description: 'Complete all-in-one suite: in-shop POS, online tailoring, and saree store.',
    features: ['All in-shop POS & ledger features', 'Full online app booking catalog', 'Saree & fabric ecommerce store', 'Priority master craftsman branding']
  }
};

export interface Service {
  id?: string;
  name: string;
  categoryName?: string;
  category?: string;
  tailorShopId?: string | null;
  tailorShopName?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  features?: string | string[] | null;
  garmentType?: string;
  emoji?: string;
  startingPrice?: number;
  basePrice?: number;
  price?: number;
  turnaround?: string;
  estimatedDays?: number;
  rating?: number;
  description?: string;
}

export interface Order {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  tailorShopId?: string | null;
  tailorName: string;
  serviceName: string;
  category?: string;
  modelName?: string;
  qty?: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  status: string;
  appointmentDate?: string;
  deliveryDate?: string;
  appointmentTime?: string;
  paymentMode?: string;
  specialNotes?: string;
  assignedTailor?: string | null;
  orderChannel?: 'IN_SHOP' | 'ONLINE_APP';
  channel?: 'IN_SHOP' | 'ONLINE_APP';
  naap?: Record<string, string>;
  measurements?: Record<string, string>;
  createdAt?: string;
}


export interface CustomQuote {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  tailorShopId?: string | null;
  tailorName?: string;
  garment: string;
  description: string;
  photosCount?: number;
  quotedPrice?: number | null;
  counterPrice?: number | null;
  customerResponse?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'REVISION_REQUESTED' | null;
  customerFeedback?: string | null;
  status: string;
  convertedOrderId?: string | null;
}

export interface SareeProduct {
  id: string;
  tailorShopId?: string | null;
  tailorShopName?: string | null;
  title: string;
  category: string;
  fabric: string;
  price: number;
  mrp: number;
  discountPercent: number;
  inStock: boolean;
  stockCount: number;
  imageUrl: string;
  colors?: string[];
  description?: string;
  blouseIncluded?: boolean;
  blouseStitchingAddonPrice?: number;
  fallPicoAddonPrice?: number;
  tags?: string[];
}
