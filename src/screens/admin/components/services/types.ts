import { Service, TailorShop } from '../../../../types';

export interface SareeProduct {
  id: string;
  tailorShopId: string;
  tailorShopName: string;
  title: string;
  category: string;
  fabric: string;
  price: number;
  mrp: number;
  discountPercent: number;
  inStock: boolean;
  stockCount: number;
  imageUrl: string;
  description: string;
  blouseIncluded: boolean;
  blouseStitchingAddonPrice: number;
  fallPicoAddonPrice: number;
  tags: string[];
}

export interface ServiceCategoryItem {
  id: string;
  name: string;
  tailorShopId?: string;
}

export const SERVICE_IMAGE_PRESETS = [
  { label: '🥻 Maggam Blouse', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80' },
  { label: '👔 Formal Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80' },
  { label: '👖 Pants / Chinos', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80' },
  { label: '🤵 Bespoke Suit', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80' },
  { label: '👑 Sherwani Kurta', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80' },
  { label: '💃 Bridal Lehenga', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80' },
  { label: '✂️ Alterations', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80' }
];

export const SAREE_IMAGE_PRESETS = [
  { label: '🌸 Pink Floral Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', fabric: 'Silk' },
  { label: '🧵 Pure Silk Fabric Material', url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80', fabric: 'Silk' },
  { label: '👑 Kanchipuram Bridal Gold', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', fabric: 'Pure Silk' },
  { label: '✨ Banarasi Zari Georgette', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80', fabric: 'Georgette' },
  { label: '🌿 Chanderi Cotton Handloom', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80', fabric: 'Chanderi Cotton' },
  { label: '🌺 Organza Floral Digital', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80', fabric: 'Organza' }
];

export const INITIAL_SAREES: SareeProduct[] = [
  {
    id: 'sar-1',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Saree',
    category: 'Saree',
    fabric: 'Silk',
    price: 1400,
    mrp: 2400,
    discountPercent: 42,
    inStock: true,
    stockCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    description: 'Graceful floral drape with rich pallu border. Comes with 0.8m unstitched matching blouse piece.',
    blouseIncluded: true,
    blouseStitchingAddonPrice: 450,
    fallPicoAddonPrice: 99,
    tags: ['Summer Collection', 'Silk', 'Popular']
  },
  {
    id: 'sar-2',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Saree Fabric',
    category: 'Saree Fabric',
    fabric: 'Silk',
    price: 200,
    mrp: 500,
    discountPercent: 60,
    inStock: true,
    stockCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80',
    description: 'Raw silk unstitched cut fabric piece per meter. Ideal for custom designer blouses and lehenga borders.',
    blouseIncluded: false,
    blouseStitchingAddonPrice: 450,
    fallPicoAddonPrice: 99,
    tags: ['Premium Fabrics', 'Silk']
  },
  {
    id: 'sar-3',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Kanchipuram Silk Bridal Saree',
    category: 'Pure Silk',
    fabric: 'Pure Silk',
    price: 3800,
    mrp: 6500,
    discountPercent: 41,
    inStock: true,
    stockCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    description: 'Traditional temple border pure Kanchipuram silk with heavy zari weaving. Perfect for muhurtham.',
    blouseIncluded: true,
    blouseStitchingAddonPrice: 650,
    fallPicoAddonPrice: 99,
    tags: ['Bridal Sarees', 'Pure Silk']
  },
  {
    id: 'sar-4',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Banarasi Georgette Festive Saree',
    category: 'Summer Collection',
    fabric: 'Georgette',
    price: 1850,
    mrp: 3200,
    discountPercent: 42,
    inStock: true,
    stockCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    description: 'Lightweight flowy Banarasi georgette saree featuring intricate silver zari floral jaal weaving.',
    blouseIncluded: true,
    blouseStitchingAddonPrice: 450,
    fallPicoAddonPrice: 99,
    tags: ['Summer Collection', 'Festive']
  },
  {
    id: 'sar-5',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Chanderi Cotton Handloom Drape',
    category: 'Summer Collection',
    fabric: 'Chanderi Cotton',
    price: 950,
    mrp: 1800,
    discountPercent: 47,
    inStock: true,
    stockCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    description: 'Breathable authentic handcrafted Chanderi cotton drape with elegant pastel border detailing.',
    blouseIncluded: true,
    blouseStitchingAddonPrice: 400,
    fallPicoAddonPrice: 99,
    tags: ['Daily Wear', 'Handloom']
  },
  {
    id: 'sar-6',
    tailorShopId: 'shop-1',
    tailorShopName: 'Elite Ladies Boutique & Maggam Works',
    title: 'Organza Floral Digital Print Saree',
    category: 'Summer Collection',
    fabric: 'Organza',
    price: 1600,
    mrp: 2900,
    discountPercent: 45,
    inStock: true,
    stockCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80',
    description: 'Trending sheer organza saree with HD digital botanical blooms and scalloped zari embroidered borders.',
    blouseIncluded: true,
    blouseStitchingAddonPrice: 450,
    fallPicoAddonPrice: 99,
    tags: ['Party Wear', 'Trending']
  }
];

export const INITIAL_CATEGORIES: ServiceCategoryItem[] = [
  { id: 'cat-1', name: "Women's Wear" },
  { id: 'cat-2', name: "Men's Wear" },
  { id: 'cat-3', name: 'Bridal & Maggam' },
  { id: 'cat-4', name: 'Alterations & Fitting' },
  { id: 'cat-5', name: 'Kids Wear' },
  { id: 'cat-6', name: 'Festive & Ceremonial' },
  { id: 'cat-7', name: 'Designer Blouses' },
  { id: 'cat-8', name: 'Formal Suits & Blazers' },
  { id: 'cat-9', name: 'Ethnic Kurta & Pyjama' },
  { id: 'cat-10', name: 'Saree Pre-Pleating' },
  { id: 'cat-11', name: 'Lehenga Choli' },
  { id: 'cat-12', name: 'Custom Gowns' },
  { id: 'cat-13', name: 'Sherwani Crafting' },
  { id: 'cat-14', name: 'Embroidery & Zari' },
  { id: 'cat-15', name: 'Western Formals' },
  { id: 'cat-16', name: 'Silk Dhotis & Kurtas' }
];
