/**
 * Rider's own bookings. Calls GET /bookings (@routes/bookings.ts), which is
 * role-aware server-side — a rider token sees their requests, a mechanic
 * token would see jobs assigned to them (see the mechanic app's
 * useBookingRequests for that side).
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/types';
import { apiClient } from '@api/client';

// Server shape from @controllers/bookingController.ts's `serialize()` —
// nested serviceType/mechanic objects, not the flat fields the rider UI
// wants — so this maps it down to the client's `Booking` shape.
interface ServerBooking {
  id: string;
  status: Booking['status'];
  serviceType: { id: string; name: string } | null;
  scheduledFor: string;
  price: number | string | null;
  mechanic: { id: string; name: string } | null;
}

function toClientBooking(b: ServerBooking): Booking {
  return {
    id: b.id,
    mechanicName: b.mechanic?.name || 'Pending match',
    serviceType: b.serviceType?.name || 'Service',
    status: b.status,
    scheduledFor: b.scheduledFor,
    price: b.price,
  };
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async (): Promise<Booking[]> => {
      const response = await apiClient.get('/bookings');
      return (response.data.data as ServerBooking[]).map(toClientBooking);
    },
  });
}

interface CreateBookingInput {
  mechanicId?: string;
  serviceTypeId: string;
  description?: string;
  address: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const response = await apiClient.post('/bookings', input);
      return toClientBooking(response.data.data as ServerBooking);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
