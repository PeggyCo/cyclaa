/**
 * Email Service
 * Handles sending confirmation and notification emails via Resend
 */

import { Resend } from 'resend';
import { config } from '@config/env';
import { logger } from '@utils/logger';

const RESEND_API_KEY = config.notifications.resend.apiKey;
const IS_PLACEHOLDER_KEY = !RESEND_API_KEY || RESEND_API_KEY === 'your-resend-api-key';

const resend = new Resend(IS_PLACEHOLDER_KEY ? 're_dev_placeholder' : RESEND_API_KEY);
const FROM_EMAIL = config.notifications.resend.fromEmail;
const APP_URL = process.env.APP_URL || 'https://cyclaa.app';

if (IS_PLACEHOLDER_KEY) {
  logger.warn(
    'RESEND_API_KEY is not set (or still the placeholder value) — emails will be logged instead of sent. Set a real key from https://resend.com/api-keys in apps/api/.env to enable delivery.'
  );
}

export class EmailService {
  /**
   * Wraps resend.emails.send: in dev without a real API key, logs the email
   * instead of attempting a network call that would just fail with a 401.
   */
  private static async deliver(payload: { to: string; subject: string; html: string }) {
    if (IS_PLACEHOLDER_KEY) {
      logger.info(
        { to: payload.to, subject: payload.subject },
        '[EmailService] RESEND_API_KEY not configured — email NOT sent (logged only)'
      );
      return { success: true, skipped: true };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
    return { success: true };
  }

  // Send confirmation email
  static async sendConfirmationEmail(
    email: string,
    name: string | null,
    confirmationToken: string,
    position: number,
    referralCode: string
  ) {
    const confirmUrl = `${APP_URL}/confirm?token=${confirmationToken}`;
    const userName = name ? name.split(' ')[0] : 'there';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0B0B0B; color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { padding: 30px 20px; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 20px; }
            .btn { background: #E8430A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .position { background: #F0EDE5; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .position-num { font-size: 32px; font-weight: bold; color: #E8430A; }
            .position-text { color: #666; font-size: 14px; }
            .footer { color: #999; font-size: 12px; text-align: center; margin-top: 30px; }
            .referral-section { background: #F0EDE5; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Cyclaa 🚴</h1>
            </div>

            <div class="content">
              <p>Hey ${userName},</p>

              <p>Thanks for joining the Cyclaa waitlist! We're building the world's first fully integrated cycling platform, and we're excited to have you on board.</p>

              <div class="position">
                <div class="position-num">#${position}</div>
                <div class="position-text">Your position in line</div>
              </div>

              <p><strong>Confirm your email</strong> to secure your spot and get updates about our launch:</p>

              <a href="${confirmUrl}" class="btn">Confirm Email Address</a>

              <div class="referral-section">
                <h3 style="margin-top: 0;">Invite Friends & Move Up</h3>
                <p>Want to jump ahead in the queue? Share your referral link with friends—each person who signs up moves you up 5 spots:</p>
                <p style="font-family: monospace; background: white; padding: 10px; border-radius: 4px; word-break: break-all;">
                  ${APP_URL}?ref=${referralCode}
                </p>
              </div>

              <p>Questions? Reply to this email or reach out to <a href="mailto:hello@cyclaa.app">hello@cyclaa.app</a>.</p>

              <p>See you soon,<br>The Cyclaa Team</p>
            </div>

            <div class="footer">
              <p>© 2026 Cyclaa. Built in Brooklyn.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.deliver({
      to: email,
      subject: `You're #${position} on the Cyclaa waitlist 🚴`,
      html,
    });
  }

  // Send position update email
  static async sendPositionUpdateEmail(email: string, name: string | null, newPosition: number) {
    const userName = name ? name.split(' ')[0] : 'there';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0B0B0B; color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
            .position { background: #F0EDE5; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
            .position-num { font-size: 32px; font-weight: bold; color: #E8430A; }
            .content { padding: 30px 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Great News! 🎉</h1>
            </div>

            <div class="content">
              <p>Hey ${userName},</p>

              <p>Your referrals are working! Thanks to your friends joining, you've moved up in the waitlist.</p>

              <div class="position">
                <div class="position-num">#${newPosition}</div>
                <div class="position-text">Your new position</div>
              </div>

              <p>Keep sharing to jump even higher! Each referral moves you up 5 spots.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.deliver({
      to: email,
      subject: `You're now #${newPosition} on the Cyclaa waitlist!`,
      html,
    });
  }

  // Send access granted email
  static async sendAccessGrantedEmail(email: string, name: string | null) {
    const userName = name ? name.split(' ')[0] : 'there';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0B0B0B 0%, #E8430A 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
            .header h1 { margin: 0; font-size: 32px; }
            .content { padding: 30px 20px; border: 1px solid #e5e5e5; border-radius: 8px; margin-top: 20px; }
            .btn { background: #E8430A; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're In! 🎉</h1>
            </div>

            <div class="content">
              <p>Hey ${userName},</p>

              <p>We're thrilled to let you know that Cyclaa is now available in your borough! Your early access is ready.</p>

              <a href="${APP_URL}/download" class="btn">Download the App</a>

              <p>You're getting in on day one. Enjoy the platform—and thanks for being an early believer in what we're building.</p>

              <p>The Cyclaa Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.deliver({
      to: email,
      subject: 'Cyclaa is here! Your early access is ready 🚴',
      html,
    });
  }
}
