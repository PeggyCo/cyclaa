/**
 * Auth Controller
 * Registration, login, and current-user lookup for riders and mechanics.
 */

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@models/User';
import { RiderProfile } from '@models/RiderProfile';
import { MechanicProfile, MechanicStatus } from '@models/MechanicProfile';

const SALT_ROUNDS = 10;

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'rider' | 'mechanic';
}

export interface LoginInput {
  email: string;
  password: string;
}

function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    role: user.role,
  };
}

export class AuthController {
  static async register(data: RegisterInput) {
    const { email, password, firstName, lastName, phone, role = 'rider' } = data;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const displayName = `${firstName} ${lastName}`.trim();

    const user = await User.create({
      email,
      phone,
      passwordHash,
      firstName,
      lastName,
      displayName,
      role: role === 'mechanic' ? UserRole.MECHANIC : UserRole.RIDER,
      referralCode: uuidv4().slice(0, 8).toUpperCase(),
    } as any);

    if (role === 'mechanic') {
      // No admin-review flow exists yet, so mechanics go live immediately
      // on signup rather than sitting in the migration's default
      // 'pending_review' status forever. Revisit once there's an admin
      // approval screen — see docs/DEPLOYMENT.md "Known gaps".
      await MechanicProfile.create({
        userId: user.id,
        specialties: [],
        status: MechanicStatus.ACTIVE,
        isAvailable: true,
      } as any);
    } else {
      await RiderProfile.create({
        userId: user.id,
      } as any);
    }

    return { user: toPublicUser(user) };
  }

  static async login(data: LoginInput) {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return { user: toPublicUser(user) };
  }

  static async getById(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('NOT_FOUND');
    }
    return toPublicUser(user);
  }
}
