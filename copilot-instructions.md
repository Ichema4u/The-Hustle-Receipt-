# The Hustle Receipt - Development Instructions

## Project Overview

The Hustle Receipt is a Next.js TypeScript application that allows creators to receive tips from supporters through Flutterwave payment integration. The app features creator authentication, public tip pages, server-side payment verification, and a creator dashboard with analytics.

## Quick Start

### 1. Installation

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 2. Environment Setup

Create a `.env` file with:

- `DATABASE_URL`: SQLite database URL
- `JWT_SECRET`: Authentication secret
- `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`: Flutterwave test public key
- `FLUTTERWAVE_SECRET_KEY`: Flutterwave test secret key

### 3. Available Routes

**Public Routes:**

- `/` - Home page
- `/signup` - Creator signup
- `/login` - Creator login
- `/tip/[slug]` - Public tip page for any creator
- `/tip/[slug]/success` - Payment success confirmation

**Protected Routes:**

- `/dashboard` - Creator dashboard with stats and tips
- `/api/creator/profile` - Creator profile management

## Key Features Implemented

### ✅ Authentication System

- JWT-based authentication with cookies
- Password hashing with bcrypt
- Session management
- Protected routes requiring authentication

### ✅ Flutterwave Payment Integration

- Payment initialization with Flutterwave SDK
- Server-side transaction verification
- Reference-based payment tracking
- Test API keys configured

### ✅ Creator Dashboard

- Total tips and earnings overview
- Recent tips list with supporter information
- Message wall for tipper messages
- Real-time statistics

### ✅ Database Schema

- User authentication model
- Creator profile with unique slugs
- Tip tracking with payment status
- Verified payment recording

### ✅ Styling

- Tailwind CSS with busy color palette
- Dark theme with pink/orange gradients
- Smooth animations and transitions
- Responsive design

## Development Notes

### Adding New Features

1. Add Zod schemas in `lib/validators.ts`
2. Create API routes in `app/api/`
3. Build UI components in pages
4. Use React hooks for state management

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Restart development server

### Payment Testing

- Use test Flutterwave card: 4242 4242 4242 4242
- Any future expiry and CVV
- Payments verified server-side before saving

## File Structure

- `app/` - Next.js app directory with pages and API routes
- `lib/` - Utility functions for auth, validation, payments
- `prisma/` - Database schema and migrations
- `public/` - Static assets
- Configuration files for TypeScript, Tailwind, Next.js

## Common Tasks

**Run migrations:**

```bash
npm run prisma:migrate
```

**Open database UI:**

```bash
npm run prisma:studio
```

**Build production:**

```bash
npm run build && npm start
```

**Linting:**

```bash
npm run lint
```

---

Created for The Front-End Bootcamp - Building With AI
