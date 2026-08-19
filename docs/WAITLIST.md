# Cyclaa Waitlist System

Complete waitlist implementation with email confirmations, referral tracking, and early access management.

## Components

### 1. Frontend (Website)

**Location**: `apps/website/index.html`

**Form Fields**:
- Name (optional)
- Email (required)
- Borough (optional)

**Features**:
- Real-time validation
- Success screen with position number
- Referral code display
- Error handling
- Loading state management

**API Integration**:
- POST `/api/waitlist` - Submit email
- Calls backend to validate and store

### 2. Backend API

**Endpoints**:

#### `POST /waitlist` - Join the waitlist
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "borough": "brooklyn",
    "referredBy": "REFERRAL_CODE",
    "source": "website"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "data": {
    "email": "user@example.com",
    "position": 1234,
    "referralCode": "ABC123XY"
  }
}
```

#### `GET /waitlist/confirm?token=TOKEN` - Confirm email
```bash
curl http://localhost:3000/api/waitlist/confirm?token=CONFIRMATION_TOKEN
```

#### `GET /waitlist/referral/:code` - Get referral info
```bash
curl http://localhost:3000/api/waitlist/referral/ABC123XY
```

#### `GET /waitlist/stats` - Get statistics (public)
```bash
curl http://localhost:3000/api/waitlist/stats
```

**Response**:
```json
{
  "success": true,
  "data": {
    "total": 5234,
    "confirmed": 3100,
    "byBorough": [
      { "borough": "brooklyn", "count": 2100 },
      { "borough": "manhattan", "count": 1800 }
    ]
  }
}
```

#### `POST /waitlist/grant-access` - Grant early access (admin only)
```bash
curl -X POST http://localhost:3000/api/waitlist/grant-access \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### 3. Database

**Table**: `Waitlists`

**Schema**:
```sql
CREATE TABLE Waitlists (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  borough ENUM('manhattan', 'brooklyn', 'queens', 'bronx', 'staten_island', 'other'),
  referralCode VARCHAR UNIQUE,
  referredBy UUID REFERENCES Waitlists(id),
  position INTEGER,
  emailConfirmed BOOLEAN DEFAULT false,
  confirmationToken VARCHAR,
  confirmationSentAt TIMESTAMP,
  confirmedAt TIMESTAMP,
  referralCount INTEGER DEFAULT 0,
  accessGranted BOOLEAN DEFAULT false,
  accessGrantedAt TIMESTAMP,
  source ENUM('website', 'app', 'social', 'other'),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Indexes**:
- `email` - Fast lookups by email
- `referralCode` - Fast lookups by referral code
- `borough` - Filter by location
- `position` - Sort by position

### 4. Email Templates

**Confirmation Email**:
- Displays position number
- Explains referral system
- "Invite friends to move up 5 spots"
- Confirmation link to `GET /waitlist/confirm?token=...`

**Position Update Email**:
- Sent when referrals help user move up
- Shows new position
- Encourages more referrals

**Access Granted Email**:
- Sent via `POST /waitlist/grant-access`
- Call-to-action to download app
- Launch confirmation message

## Setup Instructions

### 1. Add Resend API Key
```bash
# In apps/api/.env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
APP_URL=https://cyclaa.app
```

Get API key at: https://resend.com

### 2. Database Migration
```bash
cd apps/api
npm run migrate
```

This creates the `Waitlists` table with all indexes.

### 3. Register Routes in API
In `apps/api/src/index.ts`:
```typescript
import { waitlistRoutes } from '@routes/waitlist';

async function start() {
  // ... existing code ...
  
  await fastify.register(waitlistRoutes, { prefix: '/api' });
  
  // ... rest of setup ...
}
```

### 4. Update website API URL
In `apps/website/index.html` (`handleWaitlistSubmit` function):
```javascript
const response = await fetch('https://api.cyclaa.app/waitlist', {
  // ... rest of config
});
```

Or use relative URL if website and API are on same domain.

## Referral System

### How It Works

1. User joins waitlist, gets unique `referralCode` (e.g., `ABC123XY`)
2. User shares link: `cyclaa.app?ref=ABC123XY`
3. New user clicks link and fills form with `referredBy: ABC123XY`
4. API increments referrer's `referralCount`
5. Position updates: `position = totalCount - referralCount * 5`
6. Confirmation email sent to referrer with new position

### Example Flow

```
User A joins → Position: #1000, Code: ABC123XY
User A invites 3 friends → referralCount: 3
User B,C,D join with ref=ABC123XY
User A's new position: 1000 - (3 × 5) = #985
Email sent: "You're now #985! Keep inviting to move up."
```

## Admin Operations

### Grant Access
```bash
curl -X POST http://localhost:3000/api/waitlist/grant-access \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

This will:
1. Set `accessGranted: true`
2. Set `accessGrantedAt: now`
3. Send "Access Granted" email with download link

### Get Stats
```bash
curl http://localhost:3000/api/waitlist/stats
```

Returns:
- Total signups
- Confirmed emails
- Breakdown by borough

## Frontend Integration

### Success State
After successful submission, the form shows:
- ✓ Confirmation message
- Position number
- Referral code (in monospace)
- Share instructions

### Error Handling
- Email already registered → "This email is already on the waitlist"
- Email already registered (user refreshes) → "Email already confirmed"
- Network errors → "Check your connection"

## Email Sending

### Transactional Emails via Resend
All emails sent through `EmailService`:
- Confirmation email: Immediately after signup
- Position update: When referral count changes
- Access granted: When admin grants access

### Email Template Features
- Dark mode compatible
- Mobile responsive
- Brand colors (Cyclaa orange #E8430A)
- Call-to-action buttons
- Footer with copyright

## Testing

### Test Email Signup
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "borough": "brooklyn"
  }'
```

### Test Confirmation
```bash
# Replace TOKEN with actual token from response
curl http://localhost:3000/api/waitlist/confirm?token=TOKEN
```

### Test with Referral
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "referred@example.com",
    "name": "Referred User",
    "referredBy": "ABC123XY"
  }'
```

## Future Enhancements

- [ ] Batch grant access to top N by borough
- [ ] Waitlist countdown timer
- [ ] Share to social media (Twitter, Facebook)
- [ ] Leaderboard of top referrers
- [ ] Weekly position updates
- [ ] SMS notifications (optional)
- [ ] User dashboard showing position history
- [ ] Duplicate email detection during signup
- [ ] IP-based duplicate prevention
- [ ] Captcha integration

## Security Considerations

- Validation: Email format check, no SQL injection
- Tokens: UUID-based confirmation tokens (unguessable)
- Rate limiting: 5 requests/minute per IP on `POST /waitlist` (`@fastify/rate-limit`)
- CORS: Set appropriate origins for website
- Admin auth: Requires JWT token for access grant endpoint (`fastify.authenticate`, `src/middleware/auth.ts`)

## Files

- Migration: `apps/api/src/migrations/009_create_waitlist.ts`
- Model: `apps/api/src/models/Waitlist.ts`
- Controller: `apps/api/src/controllers/waitlistController.ts`
- Routes: `apps/api/src/routes/waitlist.ts`
- Email: `apps/api/src/services/emailService.ts`
- Tests: `apps/api/src/__tests__/waitlist.test.ts`
- Frontend: `apps/website/index.html` (form + handler)

## Running migrations

`npm run migrate` (in `apps/api`) does **not** use `sequelize-cli` — this
project is ESM + TypeScript migrations, which the CLI can't load directly.
It uses a small custom runner instead: `apps/api/src/scripts/migrate.ts`,
tracking applied migrations in a `SequelizeMeta` table just like the CLI
would. `npm run migrate:undo` rolls back the most recent one.

---

Status: ✅ Complete implementation ready for integration
