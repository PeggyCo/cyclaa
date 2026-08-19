import { jest } from '@jest/globals';

// Mock Resend so tests never attempt a real network call, regardless of
// whether a RESEND_API_KEY is configured in the environment running tests.
jest.unstable_mockModule('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn(async () => ({ id: 'mock-email-id' })) },
  })),
}));

const { WaitlistController } = await import('../controllers/waitlistController');
const { EmailService } = await import('../services/emailService');
const { Waitlist } = await import('../models/Waitlist');

describe('WaitlistController', () => {
  afterEach(async () => {
    await Waitlist.destroy({ where: {}, truncate: true, cascade: true });
  });

  it('joins the waitlist and assigns position 1 for the first signup', async () => {
    const entry = await WaitlistController.joinWaitlist({ email: 'alice@example.com', name: 'Alice' });

    expect(entry.position).toBe(1);
    expect(entry.referralCode).toHaveLength(8);
    expect(entry.confirmationToken).toBeTruthy();
  });

  it('rejects a duplicate email', async () => {
    await WaitlistController.joinWaitlist({ email: 'dup@example.com' });

    await expect(WaitlistController.joinWaitlist({ email: 'dup@example.com' })).rejects.toThrow(
      'EMAIL_ALREADY_REGISTERED'
    );
  });

  it('increments the referrer referral count when a referral code is used', async () => {
    const referrer = await WaitlistController.joinWaitlist({ email: 'referrer@example.com' });

    await WaitlistController.joinWaitlist({
      email: 'referred@example.com',
      referredBy: referrer.referralCode,
    });

    const referrerRow = await Waitlist.findOne({ where: { email: 'referrer@example.com' } });
    expect(referrerRow?.referralCount).toBe(1);
  });

  it('ignores an unknown referral code without failing the signup', async () => {
    const entry = await WaitlistController.joinWaitlist({
      email: 'noref@example.com',
      referredBy: 'DOES-NOT-EXIST',
    });

    expect(entry.email).toBe('noref@example.com');
  });

  it('confirms an email with the correct confirmation token', async () => {
    const entry = await WaitlistController.joinWaitlist({ email: 'confirmme@example.com' });

    const confirmed = await WaitlistController.confirmEmail(entry.confirmationToken as string);
    expect(confirmed.email).toBe('confirmme@example.com');

    const row = await Waitlist.findOne({ where: { email: 'confirmme@example.com' } });
    expect(row?.emailConfirmed).toBe(true);
  });

  it('rejects confirmation with an invalid token', async () => {
    await expect(WaitlistController.confirmEmail('not-a-real-token')).rejects.toThrow('INVALID_TOKEN');
  });

  it('rejects confirming the same email twice', async () => {
    const entry = await WaitlistController.joinWaitlist({ email: 'twice@example.com' });
    await WaitlistController.confirmEmail(entry.confirmationToken as string);

    await expect(WaitlistController.confirmEmail(entry.confirmationToken as string)).rejects.toThrow(
      'ALREADY_CONFIRMED'
    );
  });

  it('looks up an entry by referral code', async () => {
    const entry = await WaitlistController.joinWaitlist({ email: 'findme@example.com', name: 'Find Me' });

    const found = await WaitlistController.getByReferralCode(entry.referralCode as string);
    expect(found.email).toBe('findme@example.com');
  });

  it('throws NOT_FOUND for an unknown referral code lookup', async () => {
    await expect(WaitlistController.getByReferralCode('NOPE1234')).rejects.toThrow('NOT_FOUND');
  });

  it('reports accurate stats across multiple signups and confirmations', async () => {
    const a = await WaitlistController.joinWaitlist({ email: 'stat1@example.com', borough: 'brooklyn' });
    await WaitlistController.joinWaitlist({ email: 'stat2@example.com', borough: 'queens' });
    await WaitlistController.confirmEmail(a.confirmationToken as string);

    const stats = await WaitlistController.getStats();
    expect(stats.total).toBe(2);
    expect(stats.confirmed).toBe(1);
  });

  it('grants access and records the timestamp', async () => {
    await WaitlistController.joinWaitlist({ email: 'grantme@example.com' });

    const granted = await WaitlistController.grantAccess('grantme@example.com');
    expect(granted.accessGranted).toBe(true);
    expect(granted.accessGrantedAt).toBeTruthy();
  });

  it('throws NOT_FOUND when granting access to an unknown email', async () => {
    await expect(WaitlistController.grantAccess('nobody@example.com')).rejects.toThrow('NOT_FOUND');
  });
});

describe('EmailService', () => {
  it('builds the referral link from the referral code, not the email address', async () => {
    // Regression test: the confirmation email used to embed the recipient's
    // raw email in the ?ref= link instead of their referralCode, which
    // silently broke referral attribution for anyone who used the link.
    const sendSpy = jest.spyOn(EmailService as any, 'deliver');

    await EmailService.sendConfirmationEmail('user@example.com', 'User', 'tok-123', 5, 'REFCODE1');

    expect(sendSpy).toHaveBeenCalled();
    const call = sendSpy.mock.calls[0][0] as { html: string };
    expect(call.html).toContain('?ref=REFCODE1');
    expect(call.html).not.toContain('?ref=user@example.com');

    sendSpy.mockRestore();
  });
});
