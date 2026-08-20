import { describe, expect, it } from '@jest/globals';
import { AuthController } from '@controllers/authController';
import { MechanicProfile, MechanicStatus } from '@models/MechanicProfile';
import { RiderProfile } from '@models/RiderProfile';

const RIDER_INPUT = {
  email: 'rider@example.com',
  password: 'supersecret123',
  firstName: 'Rae',
  lastName: 'Rider',
  phone: '+12125550001',
};

const MECHANIC_INPUT = {
  email: 'mechanic@example.com',
  password: 'supersecret123',
  firstName: 'Mo',
  lastName: 'Mechanic',
  phone: '+12125550002',
  role: 'mechanic' as const,
};

describe('AuthController', () => {
  it('registers a rider and creates a matching RiderProfile', async () => {
    const { user } = await AuthController.register(RIDER_INPUT);

    expect(user.role).toBe('rider');
    expect(user.displayName).toBe('Rae Rider');

    const profile = await RiderProfile.findOne({ where: { userId: user.id } });
    expect(profile).not.toBeNull();
  });

  it('registers a mechanic as immediately active (no admin-review flow yet)', async () => {
    const { user } = await AuthController.register(MECHANIC_INPUT);

    const profile = await MechanicProfile.findOne({ where: { userId: user.id } });
    expect(profile?.status).toBe(MechanicStatus.ACTIVE);
    expect(profile?.isAvailable).toBe(true);
  });

  it('rejects registering the same email twice', async () => {
    await AuthController.register({ ...RIDER_INPUT, email: 'dupe@example.com', phone: '+12125550011' });
    await expect(
      AuthController.register({ ...RIDER_INPUT, email: 'dupe@example.com', phone: '+12125550012' })
    ).rejects.toThrow('EMAIL_ALREADY_REGISTERED');
  });

  it('logs in with correct credentials and rejects incorrect ones', async () => {
    await AuthController.register({ ...RIDER_INPUT, email: 'login@example.com', phone: '+12125550013' });

    const { user } = await AuthController.login({ email: 'login@example.com', password: RIDER_INPUT.password });
    expect(user.email).toBe('login@example.com');

    await expect(
      AuthController.login({ email: 'login@example.com', password: 'wrong-password' })
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });

  it('rejects login for an unknown email', async () => {
    await expect(
      AuthController.login({ email: 'nobody@example.com', password: 'whatever123' })
    ).rejects.toThrow('INVALID_CREDENTIALS');
  });
});
