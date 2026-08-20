/**
 * Service Type Controller
 * Read-only catalog of bookable services (tune-ups, flat repairs, etc).
 */

import { ServiceType } from '@models/ServiceType';

export class ServiceTypeController {
  static async list() {
    const types = await ServiceType.findAll({
      where: { isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']],
    });

    return types.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: t.description,
      category: t.category,
      minPrice: t.basePriceMin,
      maxPrice: t.basePriceMax,
      estimatedDurationMinutes: t.estimatedDurationMinutes,
    }));
  }
}
