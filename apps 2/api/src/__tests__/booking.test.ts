import { describe, expect, it, beforeAll } from '@jest/globals';
import { AuthController } from '@controllers/authController';
import { BookingController } from '@controllers/bookingController';
import { ServiceType } from '@models/ServiceType';

let riderId: string;
let mechanicId: string;
let serviceTypeId: string;

beforeAll(async () => {
  const { user: rider } = await AuthController.register({
    email: 'booking-rider@example.com',
    password: 'supersecret123',
    firstName: 'Rae',
    lastName: 'Rider',
    phone: '+12125550003',
  });
  riderId = rider.id;

  const { user: mechanic } = await AuthController.register({
    email: 'booking-mechanic@example.com',
    password: 'supersecret123',
    firstName: 'Mo',
    lastName: 'Mechanic',
    phone: '+12125550004',
    role: 'mechanic',
  });
  mechanicId = mechanic.id;

  const serviceType = await ServiceType.create({
    name: 'Basic tune-up',
    slug: 'basic-tune-up-test',
    category: 'maintenance' as any,
    basePriceMin: 45,
    basePriceMax: 65,
    estimatedDurationMinutes: 45,
    skillLevelRequired: 'basic',
  } as any);
  serviceTypeId = serviceType.id;
});

describe('BookingController', () => {
  it('creates a booking targeting a specific mechanic, auto-creating a placeholder bike', async () => {
    const booking = await BookingController.create({
      riderId,
      mechanicId,
      serviceTypeId,
      address: '123 Main St',
      description: 'Squeaky brake',
    });

    expect(booking.status).toBe('pending');
    expect(booking.rider?.id).toBe(riderId);
    expect(booking.mechanic?.id).toBe(mechanicId);
    expect(booking.price).toBe('45.00');
  });

  it('walks a booking through accept -> complete, visible to both parties', async () => {
    const created = await BookingController.create({
      riderId,
      mechanicId,
      serviceTypeId,
      address: '456 Side St',
    });

    const accepted = await BookingController.updateStatus(created.id, mechanicId, 'mechanic', 'accept');
    expect(accepted.status).toBe('confirmed');

    const completed = await BookingController.updateStatus(created.id, mechanicId, 'mechanic', 'complete');
    expect(completed.status).toBe('completed');

    const riderView = await BookingController.listForUser(riderId, 'rider');
    const mechanicView = await BookingController.listForUser(mechanicId, 'mechanic');
    expect(riderView.some((b) => b.id === created.id && b.status === 'completed')).toBe(true);
    expect(mechanicView.some((b) => b.id === created.id && b.status === 'completed')).toBe(true);
  });

  it('lets a mechanic decline and a rider cancel, but blocks the wrong party from acting', async () => {
    const declined = await BookingController.create({ riderId, mechanicId, serviceTypeId, address: '1 A St' });
    const declineResult = await BookingController.updateStatus(declined.id, mechanicId, 'mechanic', 'decline');
    expect(declineResult.status).toBe('cancelled');

    const cancelled = await BookingController.create({ riderId, mechanicId, serviceTypeId, address: '2 B St' });
    const cancelResult = await BookingController.updateStatus(cancelled.id, riderId, 'rider', 'cancel');
    expect(cancelResult.status).toBe('cancelled');

    const blocked = await BookingController.create({ riderId, mechanicId, serviceTypeId, address: '3 C St' });
    await expect(BookingController.updateStatus(blocked.id, riderId, 'rider', 'accept')).rejects.toThrow(
      'INVALID_ACTION'
    );
  });

  it('rejects fetching or updating a booking that belongs to someone else', async () => {
    const { user: stranger } = await AuthController.register({
      email: 'stranger@example.com',
      password: 'supersecret123',
      firstName: 'Stan',
      lastName: 'Stranger',
      phone: '+12125550005',
    });

    const booking = await BookingController.create({ riderId, mechanicId, serviceTypeId, address: '4 D St' });

    await expect(BookingController.getById(booking.id, stranger.id)).rejects.toThrow('FORBIDDEN');
    await expect(
      BookingController.updateStatus(booking.id, stranger.id, 'rider', 'cancel')
    ).rejects.toThrow('FORBIDDEN');
  });
});
