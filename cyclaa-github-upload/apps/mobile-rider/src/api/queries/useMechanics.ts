/**
 * Mechanic search query.
 * The backend doesn't have a /mechanics route yet, so this resolves with
 * fixture data. Once GET /mechanics exists, swap the queryFn body for the
 * commented-out apiClient call below — the hook's shape won't need to change.
 */
import { useQuery } from '@tanstack/react-query';
import type { Mechanic } from '@/types';
// import { apiClient } from '@api/client';

const FIXTURE_MECHANICS: Mechanic[] = [
  {
    id: 'm1',
    displayName: 'Jordan Reyes',
    rating: 4.9,
    reviewCount: 132,
    specialties: ['road', 'gravel'],
    distanceMiles: 0.8,
    hourlyRate: 65,
    available: true,
  },
  {
    id: 'm2',
    displayName: 'Sam Chen',
    rating: 4.8,
    reviewCount: 87,
    specialties: ['e-bike', 'commuter'],
    distanceMiles: 1.4,
    hourlyRate: 75,
    available: true,
  },
  {
    id: 'm3',
    displayName: 'Priya Nair',
    rating: 5.0,
    reviewCount: 54,
    specialties: ['mountain', 'general'],
    distanceMiles: 2.1,
    hourlyRate: 60,
    available: false,
  },
];

export function useMechanics(filters: { specialty?: string } = {}) {
  return useQuery({
    queryKey: ['mechanics', filters],
    queryFn: async (): Promise<Mechanic[]> => {
      // const response = await apiClient.get('/mechanics', { params: filters });
      // return response.data.data;
      await new Promise((resolve) => setTimeout(resolve, 300));
      return filters.specialty
        ? FIXTURE_MECHANICS.filter((m) => m.specialties.includes(filters.specialty!))
        : FIXTURE_MECHANICS;
    },
  });
}
