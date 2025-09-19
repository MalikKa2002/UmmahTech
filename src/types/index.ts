export type UserRole = 'customer' | 'merchant' | 'ngo' | 'admin';

export type DealCategory = 'food' | 'retail' | 'services';

export type ReasonTag = 'surplus' | 'near-expiry' | 'overstock' | 'last-slot';

export type DealStatus = 'active' | 'sold_out' | 'expired' | 'closed';

export type ClaimStatus = 'claimed' | 'redeemed' | 'expired' | 'canceled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

export interface Merchant {
  id: string;
  ownerUserId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  verified: boolean;
  createdAt: string;
}

export interface NGOProfile {
  userId: string;
  orgName: string;
  verified: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface FoodSafetyChecklist {
  packaging: boolean;
  temperatureBand: 'cold' | 'ambient' | 'hot';
  allergens: string[];
  useByDate: string;
  photo?: string;
}

export interface Deal {
  id: string;
  merchantId: string;
  merchant?: Merchant;
  title: string;
  description: string;
  mainCategory: DealCategory;
  reasonTag: ReasonTag;
  wasPrice: number;
  dealPrice: number;
  qtyTotal: number;
  qtyRemaining: number;
  pickupStart: string;
  pickupEnd: string;
  photoUrl?: string;
  status: DealStatus;
  location: Location;
  foodSafety?: FoodSafetyChecklist;
  createdAt: string;
  viewCount?: number;
  claimCount?: number;
}

export interface Claim {
  id: string;
  dealId: string;
  deal?: Deal;
  userId: string;
  user?: User;
  qty: number;
  status: ClaimStatus;
  qrCode: string;
  otpCode: string;
  claimedAt: string;
  redeemedAt?: string;
  expiresAt: string;
}

export interface DealFilters {
  category?: DealCategory;
  freeOnly?: boolean;
  radius?: number;
  userLocation?: { lat: number; lng: number };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CreateDealData {
  title: string;
  description: string;
  mainCategory: DealCategory;
  reasonTag: ReasonTag;
  wasPrice: number;
  dealPrice: number;
  qtyTotal: number;
  pickupStart: string;
  pickupEnd: string;
  photoUrl?: string;
  location: Location;
  foodSafety?: FoodSafetyChecklist;
}