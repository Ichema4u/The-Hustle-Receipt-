# The Hustle Receipt

A modern Next.js application for creators to monetize their audience through tips. Built with TypeScript, Prisma, Tailwind CSS, Flutterwave payments, and React Query caching.

## Features

✨ **Creator Authentication**

- Secure signup/login with JWT tokens
- Password hashing with bcrypt
- Session-based authentication

🎯 **Public Tip Pages**

- Creator-specific tip pages at `/tip/[creator-slug]`
- Accessible to anyone, signed in or not
- Beautiful UI with Tailwind CSS

💰 **Flutterwave Payment Integration**

- Flutterwave Standard or Inline JS for checkout
- Server-side payment verification (never trust client)
- Test API keys included for development

📊 **Creator Dashboard**

- Total tips received overview
- Recent tips list with supporter info
- Tipper message wall
- Real-time stats and analytics

⚡ **React Query Caching**

- 5-minute stale time for dashboard data
- Background revalidation
- Optimized for performance

🎨 **Busy Color Palette**

- Primary: Pink/Magenta gradient
- Accent: Orange/Amber gradient
- Dark theme for contrast
- Smooth animations and transitions

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: Prisma with SQLite (or Supabase)
- **Styling**: Tailwind CSS
- **Authentication**: JWT + Cookies
- **Payments**: Flutterwave API
- **Data Fetching**: React Query (TanStack Query)
- **Validation**: Zod
- **Password Hashing**: bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Flutterwave test API keys

### Installation

1. Clone the repository or navigate to the project:

```bash
cd "The Hustle Receipt"
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your Flutterwave test keys:

```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_your_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_your_key
JWT_SECRET=your-secret-key-change-in-production
```

5. Set up the database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
The Hustle Receipt/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── creator/
│   │   │   └── profile/route.ts
│   │   ├── tip/
│   │   │   ├── [slug]/route.ts
│   │   │   └── [slug]/verify/route.ts
│   │   └── dashboard/
│   │       └── tips/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── tip/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── success/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── validators.ts
│   ├── session.ts
│   ├── flutterwave.ts
│   └── password.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env
```

## Usage

### For Creators

1. **Sign Up**: Create an account at `/signup`
2. **Login**: Access your account at `/login`
3. **Create Tip Page**: Set up your public slug and bio in the dashboard
4. **Share**: Copy your tip page URL (`/tip/[your-slug]`) and share with supporters
5. **Monitor**: View tips, messages, and earnings in your dashboard

### For Supporters

1. **Visit Tip Page**: Go to `/tip/[creator-slug]`
2. **Enter Details**: Name (optional), email, amount, and message
3. **Select Amount**: Choose from presets or enter custom amount (minimum ₦100)
4. **Complete Payment**: Pay using Flutterwave (card, mobile money, USSD)
5. **Verification**: Payment verified server-side automatically

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Creator

- `GET /api/creator/profile` - Get creator profile
- `POST /api/creator/profile` - Create/update creator profile

### Tips

- `POST /api/tip/[slug]` - Initialize tip payment
- `POST /api/tip/[slug]/verify` - Verify payment with Flutterwave
- `GET /api/dashboard/tips` - Get creator's tips (requires auth)

## Payment Flow

1. **Client**: User fills tip form and clicks "Send Tip"
2. **Server**: Generate reference, save tip with "pending" status
3. **Flutterwave**: User completes payment via Flutterwave modal
4. **Callback**: Success callback triggers verification
5. **Server Verification**: Call Flutterwave verify endpoint (never trust client)
6. **Update**: Mark tip as "verified" or "failed"
7. **Client**: Redirect to success page with confirmation

## Flutterwave Integration

The app uses Flutterwave's Inline JS SDK for secure payments:

- **Public Key**: Used on the client to initialize payments
- **Secret Key**: Used on server for payment verification
- **Test Keys**: Provided in `.env` for development
- **Verification**: All payments verified server-side before being saved

### Testing Flutterwave Payments

Use these test card details:

- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)

## Database Schema

### User

- `id`: Unique identifier
- `email`: Email address (unique)
- `name`: Full name
- `password`: Hashed password
- `createdAt`: Registration timestamp

### CreatorProfile

- `id`: Unique identifier
- `userId`: Reference to User
- `slug`: Public URL slug (unique)
- `bio`: Creator biography
- `avatarUrl`: Avatar image URL
- `createdAt/updatedAt`: Timestamps

### Tip

- `id`: Unique identifier
- `creatorId`: Reference to CreatorProfile
- `tipperName`: Tipper's name (optional)
- `tipperEmail`: Tipper's email
- `amount`: Tip amount in Naira
- `message`: Optional message
- `flutterwaveRef`: Flutterwave transaction reference (unique)
- `paymentStatus`: "pending", "verified", or "failed"
- `createdAt/updatedAt`: Timestamps

## Styling

The app uses a bold, busy color palette with gradients:

- **Primary**: Pink (#ec4899) to Red (#ef4444)
- **Accent**: Orange (#f97316) to Amber (#fbbf24)
- **Dark**: Dark Gray (#111827) backgrounds
- **Text**: Light text on dark backgrounds

Tailwind CSS components:

- `.btn-primary`: Primary button with gradient
- `.btn-secondary`: Secondary button
- `.input-field`: Form input with focus states
- `.card`: Dark card with borders
- `.gradient-text`: Text with gradient color

## Environment Variables

```
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-secret-key"

# Flutterwave (Test Keys)
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST_..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Production Deployment

1. **Update environment variables** with production values
2. **Use Supabase or PostgreSQL** instead of SQLite
3. **Update `.env`** with production database URL
4. **Set secure JWT_SECRET** (minimum 32 characters)
5. **Use production Flutterwave keys**
6. **Run migrations**: `npm run prisma:migrate`
7. **Deploy**: Use Vercel, Netlify, or any Node.js hosting

## Security Notes

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire after 7 days
- ✅ HTTPOnly cookies prevent XSS attacks
- ✅ Server-side payment verification (never trust client)
- ✅ Input validation with Zod
- ✅ CORS and CSRF protections
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS only in production
- ⚠️ Set appropriate cookie settings for production domains

## Troubleshooting

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npm run prisma:migrate
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Flutterwave Integration

- Verify API keys in `.env`
- Check Flutterwave dashboard for test mode
- Use correct test card numbers
- Ensure public key is FLWPUBK_TEST

## Future Enhancements

- 📧 Email notifications for tips
- 📈 Advanced analytics and charts
- 🎨 Custom tip page branding
- 💳 Multiple payment methods
- 🌍 Multi-currency support
- 🔔 Real-time notifications
- 👥 Supporter profiles and history
- 🎁 Tip rewards and tiers

## License

MIT

## Support

For issues or questions, please check the documentation or contact support.

---

**Built with ❤️ for creators by creators**
