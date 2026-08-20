/**
 * Mechanic Controller
 * Search and profile lookups for the rider-facing "find a mechanic" flow.
 */

import { Op } from 'sequelize';
import { MechanicProfile, MechanicStatus } from '@models/MechanicProfile';
import { User } from '@models/User';

interface SearchFilters {
  specialty?: string;
}

// Haversine distance in miles between two lat/lng points.
function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class MechanicController {
  static async search(filters: SearchFilters & { lat?: number; lng?: number }) {
    const where: any = { status: MechanicStatus.ACTIVE };

    if (filters.specialty) {
      where.specialties = { [Op.contains]: [filters.specialty] };
    }

    const profiles = await MechanicProfile.findAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatarUrl'] }],
      order: [['ratingAverage', 'DESC']],
      limit: 50,
    });

    return profiles.map((profile) => {
      const p = profile.toJSON() as any;
      const distance =
        filters.lat != null &&
        filters.lng != null &&
        p.baseLocationLat != null &&
        p.baseLocationLng != null
          ? distanceMiles(filters.lat, filters.lng, Number(p.baseLocationLat), Number(p.baseLocationLng))
          : null;

      return {
        id: p.userId,
        displayName: p.user?.displayName || 'Cyclaa Mechanic',
        avatarUrl: p.user?.avatarUrl || null,
        rating: Number(p.ratingAverage),
        reviewCount: p.ratingCount,
        specialties: p.specialties || [],
        distanceMiles: distance != null ? Math.round(distance * 10) / 10 : null,
        hourlyRate: null, // pricing is per-service, not hourly; see ServiceTypes
        available: p.status === MechanicStatus.ACTIVE && p.isAvailable,
      };
    });
  }

  static async getByUserId(userId: string) {
    const profile = await MechanicProfile.findOne({
      where: { userId },
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatarUrl'] }],
    });

    if (!profile) {
      throw new Error('NOT_FOUND');
    }

    const p = profile.toJSON() as any;
    return {
      id: p.userId,
      displayName: p.user?.displayName || 'Cyclaa Mechanic',
      avatarUrl: p.user?.avatarUrl || null,
      bio: p.bio || null,
      headline: p.headline || null,
      rating: Number(p.ratingAverage),
      reviewCount: p.ratingCount,
      specialties: p.specialties || [],
      totalJobsCompleted: p.totalJobsCompleted,
      available: p.status === MechanicStatus.ACTIVE && p.isAvailable,
    };
  }
}
