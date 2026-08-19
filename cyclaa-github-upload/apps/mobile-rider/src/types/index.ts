export interface Mechanic {
  id: string;
  displayName: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  distanceMiles: number;
  hourlyRate: number;
  available: boolean;
}

export interface Booking {
  id: string;
  mechanicName: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  scheduledFor: string;
  price: number;
}
