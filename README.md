# TechConnect - Smart Networking for Tech Events

A networking app for tech events that helps attendees discover relevant connections through AI-powered recommendations, icebreaker messaging, and profile matching.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Database**: PostgreSQL via Neon (Vercel Postgres)
- **ORM**: Prisma
- **Auth**: Auth.js v5 (magic link email login)
- **UI**: Tailwind CSS with custom design system (Manrope font, dark theme)
- **Icons**: Material Icons
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and auth secret.

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Run database migrations**:
   ```bash
   npx prisma db push
   ```

5. **Seed demo data** (optional):
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Demo Event

After seeding, visit `/events/techconnect-2025` to see the demo event with 10 pre-configured attendee profiles, sample messages, and connections.

To test login: use any of the seed emails (e.g., `sarah@techflow.com`) - in development mode, magic links are logged to the console.

## Features (Phase 1 MVP)

- **Event Welcome Page**: Hero landing with event info and "Join Event" CTA
- **Multi-Step Onboarding**: 4-step wizard to build your profile
- **Profile Setup**: About Me, Skills/Interests tags, Current Role, "Enhance with AI" button
- **Attendee Profiles**: Detailed profile view with skills, interests, experience
- **Recommendations Dashboard**: AI-powered match percentages, search, role filters
- **Direct Messaging**: Chat threads, icebreaker quick messages, read receipts
- **Bottom Navigation**: Discover, Schedule, Chats, Profile tabs

## Deployment to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` - Neon/Vercel Postgres connection string
   - `AUTH_SECRET` - Generate with `npx auth secret`
   - `AUTH_URL` - Your production URL
   - `EMAIL_FROM` - Sender email address
   - Email server variables (for production magic links)
4. Deploy

## Project Structure

```
src/
  app/
    page.tsx                          # Redirect to /events
    login/                            # Magic link login
    events/
      page.tsx                        # Events list
      [slug]/
        page.tsx                      # Event welcome (Mockup 1)
        actions.ts                    # Join event action
        onboarding/                   # Profile setup wizard (Mockup 2)
        (app)/
          layout.tsx                  # Bottom nav layout
          discover/                   # Recommendations (Mockup 4)
          chats/                      # Messages list + threads (Mockup 5)
          attendee/[userId]/          # Attendee profile (Mockup 3)
          profile/                    # My profile
          schedule/                   # Schedule placeholder
  components/
    bottom-nav-bar.tsx
    glass-header.tsx
    sticky-header.tsx
    tag-input.tsx
  lib/
    auth.ts                           # Auth.js config
    db.ts                             # Prisma client
    recommendations.ts                # Match algorithm
```

Last edit 11FEB 8pm gmt-5