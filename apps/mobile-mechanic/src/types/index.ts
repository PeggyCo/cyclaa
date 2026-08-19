export interface BookingRequest {
  id: string;
  riderName: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  notes?: string;
  price: number;
  requestedFor: string;
}
