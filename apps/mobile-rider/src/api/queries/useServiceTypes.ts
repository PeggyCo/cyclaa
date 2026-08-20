/**
 * Service catalog query. Calls GET /service-types (@routes/serviceTypes.ts) —
 * the list of bookable services (tune-up, flat fix, etc) with real IDs and
 * pricing, used by BookingRequestScreen's "what do you need?" step.
 */
import { useQuery } from '@tanstack/react-query';
import type { ServiceType } from '@/types';
import { apiClient } from '@api/client';

export function useServiceTypes() {
  return useQuery({
    queryKey: ['serviceTypes'],
    queryFn: async (): Promise<ServiceType[]> => {
      const response = await apiClient.get('/service-types');
      return response.data.data;
    },
  });
}
