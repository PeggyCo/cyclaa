/**
 * Booking requests for the logged-in mechanic.
 * The backend doesn't have a /bookings route yet, so this resolves with
 * fixture data — same pattern as the rider app's useMechanics hook. Swap
 * the queryFn for a real apiClient.get('/bookings') call once it exists.
 */
import { useQuery } from '@tanstack/react-query';
import type { BookingRequest } from '@/types';

const FIXTURE_REQUESTS: BookingRequest[] = [
  {
    id: 'b1',
    riderName: 'Alice Kim',
    serviceType: 'Flat tire fix',
    status: 'pending',
    address: '142 Bedford Ave, Brooklyn',
    notes: 'Rear tire, valve seems bent',
    price: 35,
    requestedFor: 'Today, 4:30 PM',
  },
  {
    id: 'b2',
    riderName: 'Marcus Lee',
    serviceType: 'Basic tune-up',
    status: 'confirmed',
    address: '88 Grand St, Brooklyn',
    price: 60,
    requestedFor: 'Today, 6:00 PM',
  },
];

export function useBookingRequests() {
  return useQuery({
    queryKey: ['bookingRequests'],
    queryFn: async (): Promise<BookingRequest[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return FIXTURE_REQUESTS;
    },
  });
}
