/**
 * Booking requests for the logged-in mechanic. Calls GET /bookings
 * (@routes/bookings.ts), which is role-aware server-side — a mechanic
 * token sees jobs assigned to them.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingRequest } from '@/types';
import { apiClient } from '@api/client';

// Server shape from @controllers/bookingController.ts's `serialize()`.
interface ServerBooking {
  id: string;
  status: BookingRequest['status'];
  serviceType: { id: string; name: string } | null;
  scheduledFor: string;
  price: number | string | null;
  address: string;
  notes: string | null;
  rider: { id: string; name: string } | null;
}

function toClientRequest(b: ServerBooking): BookingRequest {
  const when = new Date(b.scheduledFor);
  const requestedFor = Number.isNaN(when.getTime())
    ? b.scheduledFor
    : when.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return {
    id: b.id,
    riderName: b.rider?.name || 'Rider',
    serviceType: b.serviceType?.name || 'Service',
    status: b.status,
    address: b.address,
    notes: b.notes || undefined,
    price: typeof b.price === 'string' ? parseFloat(b.price) : b.price ?? 0,
    requestedFor,
  };
}

export function useBookingRequests() {
  return useQuery({
    queryKey: ['bookingRequests'],
    queryFn: async (): Promise<BookingRequest[]> => {
      const response = await apiClient.get('/bookings');
      return (response.data.data as ServerBooking[]).map(toClientRequest);
    },
  });
}

export function useRespondToBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'accept' | 'decline' | 'start' | 'complete' }) => {
      const response = await apiClient.patch(`/bookings/${id}/status`, { action });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingRequests'] });
    },
  });
}
