/**
 * Mechanic search query. Calls GET /mechanics (@routes/mechanics.ts).
 * Pricing is per-service, not hourly, so `hourlyRate` is always null here —
 * see BookingRequestScreen for the actual service catalog and pricing.
 */
import { useQuery } from '@tanstack/react-query';
import type { Mechanic } from '@/types';
import { apiClient } from '@api/client';

export function useMechanics(filters: { specialty?: string } = {}) {
  return useQuery({
    queryKey: ['mechanics', filters],
    queryFn: async (): Promise<Mechanic[]> => {
      const response = await apiClient.get('/mechanics', { params: filters });
      return response.data.data;
    },
  });
}
