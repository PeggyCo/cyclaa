/**
 * Booking Controller
 * Create/list/respond-to service bookings between riders and mechanics.
 *
 * Client apps use a simplified status string (`pending`, `confirmed`,
 * `en_route`, `in_progress`, `completed`, `cancelled`) rather than the
 * full BookingStatus enum stored on the model — `toClientStatus` maps
 * between the two so the mobile apps never need to know about the finer
 * grained internal states (matched vs pending_match, declined vs
 * cancelled, etc).
 */

import { Booking, BookingStatus, BookingType } from '@models/Booking';
import { Bike, BikeType } from '@models/Bike';
import { ServiceType } from '@models/ServiceType';
import { User } from '@models/User';

export type ClientBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

function toClientStatus(status: BookingStatus): ClientBookingStatus {
  switch (status) {
    case BookingStatus.PENDING_MATCH:
    case BookingStatus.MATCHED:
      return 'pending';
    case BookingStatus.CONFIRMED:
      return 'confirmed';
    case BookingStatus.MECHANIC_EN_ROUTE:
      return 'en_route';
    case BookingStatus.IN_PROGRESS:
      return 'in_progress';
    case BookingStatus.COMPLETED:
      return 'completed';
    case BookingStatus.CANCELLED_BY_RIDER:
    case BookingStatus.DECLINED_BY_MECHANIC:
    case BookingStatus.DISPUTED:
      return 'cancelled';
    default:
      return 'pending';
  }
}

interface CreateBookingInput {
  riderId: string;
  mechanicId?: string;
  serviceTypeId: string;
  description?: string;
  address: string;
  lat?: number;
  lng?: number;
}

const include = [
  { model: User, as: 'rider', attributes: ['id', 'firstName', 'lastName', 'displayName'] },
  { model: User, as: 'mechanic', attributes: ['id', 'firstName', 'lastName', 'displayName'] },
  { model: ServiceType, as: 'serviceType' },
];

function serialize(booking: Booking) {
  const b = booking.toJSON() as any;

  return {
    id: b.id,
    status: toClientStatus(b.status),
    serviceType: b.serviceType ? { id: b.serviceType.id, name: b.serviceType.name } : null,
    scheduledFor: b.scheduledDate || b.createdAt,
    price: b.finalPrice ?? b.quotedPrice ?? b.serviceType?.basePriceMin ?? null,
    address: b.serviceLocation?.address || '',
    notes: b.description || null,
    rider: b.rider ? { id: b.rider.id, name: b.rider.displayName } : null,
    mechanic: b.mechanic ? { id: b.mechanic.id, name: b.mechanic.displayName } : null,
  };
}

export class BookingController {
  // Finds the rider's first bike, creating a placeholder one if they
  // haven't added one yet. Bike management UI doesn't exist yet on the
  // client, so this keeps the booking flow usable without it.
  private static async resolveDefaultBike(riderId: string) {
    const existing = await Bike.findOne({ where: { ownerId: riderId } });
    if (existing) return existing;

    return Bike.create({
      ownerId: riderId,
      nickname: 'My bike',
      make: 'Unspecified',
      model: 'Unspecified',
      type: BikeType.OTHER,
      isEbike: false,
      totalMiles: 0,
      milesSinceLastService: 0,
      isStolen: false,
    } as any);
  }

  static async create(data: CreateBookingInput) {
    const serviceType = await ServiceType.findByPk(data.serviceTypeId);
    if (!serviceType) {
      throw new Error('INVALID_SERVICE_TYPE');
    }

    const bike = await this.resolveDefaultBike(data.riderId);

    const booking = await Booking.create({
      riderId: data.riderId,
      mechanicId: data.mechanicId,
      bikeId: bike.id,
      serviceTypeId: data.serviceTypeId,
      status: data.mechanicId ? BookingStatus.MATCHED : BookingStatus.PENDING_MATCH,
      bookingType: BookingType.ON_DEMAND,
      serviceLocation: {
        type: 'custom',
        address: data.address,
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
      },
      description: data.description,
      quotedPrice: serviceType.basePriceMin,
    } as any);

    const full = await Booking.findByPk(booking.id, { include });
    return serialize(full!);
  }

  static async listForUser(userId: string, role: 'rider' | 'mechanic') {
    const where = role === 'mechanic' ? { mechanicId: userId } : { riderId: userId };
    const bookings = await Booking.findAll({ where, include, order: [['createdAt', 'DESC']] });
    return bookings.map(serialize);
  }

  static async getById(bookingId: string, userId: string) {
    const booking = await Booking.findByPk(bookingId, { include });
    if (!booking) {
      throw new Error('NOT_FOUND');
    }
    if (booking.riderId !== userId && booking.mechanicId !== userId) {
      throw new Error('FORBIDDEN');
    }
    return serialize(booking);
  }

  static async updateStatus(
    bookingId: string,
    userId: string,
    role: 'rider' | 'mechanic',
    action: 'accept' | 'decline' | 'cancel' | 'start' | 'complete'
  ) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error('NOT_FOUND');
    }

    const isRider = booking.riderId === userId;
    const isMechanic = booking.mechanicId === userId;
    if (!isRider && !isMechanic) {
      throw new Error('FORBIDDEN');
    }

    if (action === 'accept' && role === 'mechanic' && isMechanic) {
      booking.status = BookingStatus.CONFIRMED;
    } else if (action === 'decline' && role === 'mechanic' && isMechanic) {
      booking.status = BookingStatus.DECLINED_BY_MECHANIC;
    } else if (action === 'start' && role === 'mechanic' && isMechanic) {
      booking.status = BookingStatus.IN_PROGRESS;
      booking.actualArrivedAt = new Date();
    } else if (action === 'complete' && role === 'mechanic' && isMechanic) {
      booking.status = BookingStatus.COMPLETED;
      booking.actualCompletedAt = new Date();
      booking.finalPrice = booking.finalPrice ?? booking.quotedPrice;
    } else if (action === 'cancel' && role === 'rider' && isRider) {
      booking.status = BookingStatus.CANCELLED_BY_RIDER;
    } else {
      throw new Error('INVALID_ACTION');
    }

    await booking.save();

    const full = await Booking.findByPk(booking.id, { include });
    return serialize(full!);
  }
}
