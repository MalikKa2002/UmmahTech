import { Deal, User, Merchant, Claim, UserRole } from '@/types';

// Import generated images
import challahImage from '@/assets/challah-pastries.jpg';
import vegetablesImage from '@/assets/organic-vegetables.jpg';
import phoneRepairImage from '@/assets/phone-repair.jpg';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Cohen',
    email: 'sarah@example.com',
    role: 'customer',
    verified: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2', 
    name: 'David Restaurant',
    email: 'david@bakery.com',
    role: 'merchant',
    verified: true,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Leket Israel',
    email: 'contact@leket.org',
    role: 'ngo',
    verified: true,
    createdAt: '2024-01-05T09:00:00Z'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@surplusdeals.org',
    role: 'admin',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Merchants
export const mockMerchants: Merchant[] = [
  {
    id: 'merchant-1',
    ownerUserId: 'user-2',
    name: "David's Fresh Bakery",
    address: '123 Ben Yehuda St, Tel Aviv',
    lat: 32.0853,
    lng: 34.7818,
    category: 'food',
    verified: true,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'merchant-2',
    ownerUserId: 'user-4',
    name: 'Green Valley Organic',
    address: '456 Dizengoff St, Tel Aviv',
    lat: 32.0754,
    lng: 34.7749,
    category: 'food',
    verified: true,
    createdAt: '2024-01-12T10:00:00Z'
  },
  {
    id: 'merchant-3',
    ownerUserId: 'user-5',
    name: 'TechFix Repair',
    address: '789 Rothschild Blvd, Tel Aviv',
    lat: 32.0644,
    lng: 34.7734,
    category: 'services',
    verified: true,
    createdAt: '2024-01-14T14:00:00Z'
  }
];

// Generate pickup times for today
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const pickupStart1 = new Date(today.getTime() + 18 * 60 * 60 * 1000); // 6 PM today
const pickupEnd1 = new Date(pickupStart1.getTime() + 2 * 60 * 60 * 1000); // 8 PM today

const pickupStart2 = new Date(today.getTime() + 19 * 60 * 60 * 1000); // 7 PM today  
const pickupEnd2 = new Date(pickupStart2.getTime() + 1.5 * 60 * 60 * 1000); // 8:30 PM today

const pickupStart3 = new Date(today.getTime() + 16 * 60 * 60 * 1000); // 4 PM today
const pickupEnd3 = new Date(pickupStart3.getTime() + 3 * 60 * 60 * 1000); // 7 PM today

// Mock Deals
export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    merchantId: 'merchant-1',
    merchant: mockMerchants[0],
    title: 'Fresh Challah & Pastries',
    description: 'End-of-day fresh challah, croissants, and Danish pastries. Perfect for tomorrow\'s breakfast!',
    mainCategory: 'food',
    reasonTag: 'surplus',
    wasPrice: 45,
    dealPrice: 18,
    qtyTotal: 8,
    qtyRemaining: 5,
    pickupStart: pickupStart1.toISOString(),
    pickupEnd: pickupEnd1.toISOString(),
    photoUrl: challahImage,
    status: 'active',
    location: {
      lat: 32.0853,
      lng: 34.7818,
      address: '123 Ben Yehuda St, Tel Aviv'
    },
    createdAt: '2024-01-20T14:00:00Z',
    viewCount: 24,
    claimCount: 3
  },
  {
    id: 'deal-2',
    merchantId: 'merchant-2',
    merchant: mockMerchants[1],
    title: 'Organic Vegetable Box - Free for NGOs',
    description: 'Fresh organic vegetables approaching best-by date. Mixed seasonal box with tomatoes, cucumbers, peppers, and leafy greens.',
    mainCategory: 'food',
    reasonTag: 'near-expiry',
    wasPrice: 35,
    dealPrice: 0,
    qtyTotal: 12,
    qtyRemaining: 8,
    pickupStart: pickupStart2.toISOString(),
    pickupEnd: pickupEnd2.toISOString(),
    photoUrl: vegetablesImage,
    status: 'active',
    location: {
      lat: 32.0754,
      lng: 34.7749,
      address: '456 Dizengoff St, Tel Aviv'
    },
    foodSafety: {
      packaging: true,
      temperatureBand: 'cold',
      allergens: [],
      useByDate: '2024-01-22',
      photo: vegetablesImage
    },
    createdAt: '2024-01-20T12:00:00Z',
    viewCount: 18,
    claimCount: 4
  },
  {
    id: 'deal-3',
    merchantId: 'merchant-3',
    merchant: mockMerchants[2],
    title: 'Last-Minute Phone Screen Repair',
    description: 'Final appointment slot available today. Professional screen replacement for iPhone and Samsung devices.',
    mainCategory: 'services',
    reasonTag: 'last-slot',
    wasPrice: 120,
    dealPrice: 80,
    qtyTotal: 1,
    qtyRemaining: 1,
    pickupStart: pickupStart3.toISOString(),
    pickupEnd: pickupEnd3.toISOString(),
    photoUrl: phoneRepairImage,
    status: 'active',
    location: {
      lat: 32.0644,
      lng: 34.7734,
      address: '789 Rothschild Blvd, Tel Aviv'
    },
    createdAt: '2024-01-20T11:00:00Z',
    viewCount: 7,
    claimCount: 0
  }
];

// Mock current user (can be changed to simulate different roles)
export let mockCurrentUser: User | null = mockUsers[0]; // Default to customer

export const setMockCurrentUser = (user: User | null) => {
  mockCurrentUser = user;
};

// Helper to switch user roles for testing
export const switchUserRole = (role: UserRole) => {
  const user = mockUsers.find(u => u.role === role);
  if (user) {
    setMockCurrentUser(user);
  }
};

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    dealId: 'deal-1',
    deal: mockDeals[0],
    userId: 'user-1',
    user: mockUsers[0],
    qty: 1,
    status: 'claimed',
    qrCode: 'DL-ABC123',
    otpCode: '642857',
    claimedAt: '2024-01-20T15:30:00Z',
    expiresAt: pickupEnd1.toISOString()
  }
];

// Location for user (Tel Aviv center)
export const mockUserLocation = {
  lat: 32.0853,
  lng: 34.7818
};