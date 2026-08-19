/**
 * Waitlist Controller
 * Handles all waitlist operations
 */

import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';

interface WaitlistEntry {
  email: string;
  name?: string;
  borough?: string;
  referredBy?: string;
  source?: string;
}

export class WaitlistController {
  // Generate unique referral code
  static generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Submit email to waitlist
  static async joinWaitlist(data: WaitlistEntry) {
    const { email, name, borough = 'other', referredBy, source = 'website' } = data;

    // Check if email already exists
    const existing = await (global as any).sequelize.models.Waitlist.findOne({
      where: { email },
    });

    if (existing) {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    // Get current position (total count + 1)
    const count = await (global as any).sequelize.models.Waitlist.count();
    const position = count + 1;

    // Create confirmation token
    const confirmationToken = uuidv4();
    const referralCode = this.generateReferralCode();

    // Parse referred by if it's a referral code
    let referredById = null;
    if (referredBy) {
      const referrer = await (global as any).sequelize.models.Waitlist.findOne({
        where: { referralCode: referredBy },
      });
      if (referrer) {
        referredById = referrer.id;
        // Increment referrer's count
        await referrer.increment('referralCount');
      }
    }

    // Create waitlist entry
    const entry = await (global as any).sequelize.models.Waitlist.create({
      email,
      name,
      borough,
      referredBy: referredById,
      position,
      referralCode,
      confirmationToken,
      confirmationSentAt: new Date(),
      source,
    });

    return {
      id: entry.id,
      email: entry.email,
      position: entry.position,
      referralCode: entry.referralCode,
    };
  }

  // Confirm email
  static async confirmEmail(token: string) {
    const entry = await (global as any).sequelize.models.Waitlist.findOne({
      where: { confirmationToken: token },
    });

    if (!entry) {
      throw new Error('INVALID_TOKEN');
    }

    if (entry.emailConfirmed) {
      throw new Error('ALREADY_CONFIRMED');
    }

    entry.emailConfirmed = true;
    entry.confirmedAt = new Date();
    await entry.save();

    return {
      email: entry.email,
      position: entry.position,
      referralCode: entry.referralCode,
    };
  }

  // Get waitlist entry by referral code
  static async getByReferralCode(referralCode: string) {
    const entry = await (global as any).sequelize.models.Waitlist.findOne({
      where: { referralCode },
      attributes: [
        'email',
        'name',
        'position',
        'referralCode',
        'referralCount',
        'emailConfirmed',
      ],
    });

    if (!entry) {
      throw new Error('NOT_FOUND');
    }

    return entry;
  }

  // Get waitlist stats
  static async getStats() {
    const total = await (global as any).sequelize.models.Waitlist.count();
    const confirmed = await (global as any).sequelize.models.Waitlist.count({
      where: { emailConfirmed: true },
    });
    const byBorough = await (global as any).sequelize.models.Waitlist.findAll({
      attributes: [
        'borough',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      group: ['borough'],
      raw: true,
    });

    return {
      total,
      confirmed,
      byBorough,
    };
  }

  // Grant access to user
  static async grantAccess(email: string) {
    const entry = await (global as any).sequelize.models.Waitlist.findOne({
      where: { email },
    });

    if (!entry) {
      throw new Error('NOT_FOUND');
    }

    entry.accessGranted = true;
    entry.accessGrantedAt = new Date();
    await entry.save();

    return entry;
  }
}
