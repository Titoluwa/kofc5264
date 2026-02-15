# Setup & Deployment Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 12+ database instance
- npm or yarn package manager

## Step 1: Initial Setup

### 1.1 Install Dependencies

```bash
npm install
```

### 1.2 Configure Environment Variables

Create a `.env.local` file based on `env.example`:

```bash
cp env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Database Configuration
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:password@localhost:5432/community_db

# Environment
NODE_ENV=development
```

### 1.3 Create PostgreSQL Database

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE community_db;"

# Or using your database client of choice
```

## Step 2: Initialize Drizzle Schema

### 2.1 Generate Initial Migration

```bash
# Generate migration files from schema.ts
npx drizzle-kit generate:pg
```

This creates migration files in `src/db/migrations/`.

### 2.2 Run Migration

```bash
# Apply migrations to your database
npx drizzle-kit migrate
```

This creates all Drizzle-managed tables:
- `users`
- `member_profiles`
- `events`
- `rsvps`
- `form_submissions`

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

## Step 4: Verify Everything Works

### 4.1 Check Database

Verify tables were created:

```bash
# Using psql
psql -U user -d community_db -c "\dt"

# Should show these tables:
# - users
# - member_profiles
# - events
# - rsvps
# - form_submissions
```

### 4.2 Test Events Page

1. Visit `http://localhost:3000/events`
2. You should see the events you created
3. (Optional) Test RSVP button if you've set up authentication

## Step 5: Development Workflow

### Adding New Fields to Events

1. **Update Drizzle Schema**
   ```typescript
   // src/db/schema.ts
   export const events = pgTable('events', {
     // ... existing fields
     eventType: varchar('event_type'), // new field
   });
   ```

2. **Generate and Run Migration**
   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit migrate
   ```

3. **Update UI Components**
   Update EventCard or other components to use the new field

### Creating New Server Actions

1. Create action file: `src/app/actions/myaction.ts`
   ```typescript
   'use server';
   import { db } from '@/src/db';
   
   export async function myAction(params: any) {
     // Database operations
   }
   ```

2. Use in components:
   ```typescript
   'use client';
   import { myAction } from '@/src/app/actions/myaction';
   
   // In event handler:
   await myAction(params);
   ```

### Creating New API Routes

1. Create route file: `src/app/api/myendpoint/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   
   export async function GET(request: NextRequest) {
     // Handle GET
   }
   ```

## Step 6: Production Deployment

### 7.1 Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```env
DATABASE_URL=postgresql://user:password@your-prod-db.example.com:5432/db
NODE_ENV=production
```

### 7.2 Database Migration

Before deploying:

```bash
# Run migrations against production database
DATABASE_URL=postgresql://... npx drizzle-kit migrate
```

### 7.3 Deploy to Vercel

```bash
# Push to GitHub (if not already done)
git push origin main

# Deploy via Vercel dashboard or CLI
vercel
```

### 6.4 Post-Deployment

1. Test the application
2. Verify database connectivity
3. Test events page

## Troubleshooting

### Database Connection Error

```
Error: ECONNREFUSED - Connection refused
```

**Solution:**
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Migration Fails

```
Error: relation "users" already exists
```

**Solution:**
- Check if migrations already ran
- If database is fresh, migrations should be new
- Drop database and restart if needed (dev only): `DROP DATABASE community_db;`

### Build Errors

```
Error: Module not found
```

**Solution:**
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version (18+ required)

### RSVP Not Working

**Solution:**
- Ensure users exist in database
- Check browser console for error messages
- Verify Server Actions are working: `npm run dev` shows no errors

### Images Not Loading

**Solution:**
- Verify image files are in `/public` directory
- Check image URLs in event data
- For local dev, images must be in `/public` or use absolute URLs

## Common Tasks

### Add a New Event via Database

1. Use Drizzle ORM to insert events
2. Or create an admin interface for event management
3. Events appear on `/events` page

## Performance Optimization

### Database Indexing

For high-traffic apps, add indexes to frequently queried fields:

```sql
CREATE INDEX idx_rsvp_user ON rsvps(user_id);
CREATE INDEX idx_rsvp_event ON rsvps(event_id);
CREATE INDEX idx_events_date ON events(start_date);
```

### Caching

Server Components automatically cache on `revalidateTag`:

```typescript
revalidateTag('events-list', 'max'); // Cache for 1 day
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={event.imageUrl}
  alt={event.title}
  width={400}
  height={300}
  priority={false}
/>
```

## Next Steps

1. ✅ Complete setup steps 1-5 above
2. ✅ Test by visiting `/events` and Payload admin
3. ✅ Create some events and test RSVP
4. ✅ Customize branding and content
5. ✅ Deploy to production
6. 📖 Read `/ARCHITECTURE.md` for system design details
7. 🚀 Start building additional features!

## Support & Resources

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
