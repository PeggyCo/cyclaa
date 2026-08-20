export interface Mechanic {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distanceMiles: number | null;
  hourlyRate: number | null;
  available: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  minPrice: string | number;
  maxPrice: string | number;
  estimatedDurationMinutes: number;
}

export interface Booking {
  id: string;
  mechanicName: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  scheduledFor: string;
  price: number | string | null;
}
