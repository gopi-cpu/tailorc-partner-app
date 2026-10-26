export interface TailorWorker {
  id: string;
  name: string;
  phone?: string;
  role?: string;
  specialties?: string;
  baseRate?: number | string;
  active?: boolean;
  tailorShopId?: string;
  rating?: number;
}
