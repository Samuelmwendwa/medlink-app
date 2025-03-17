# MediLink Setup Guide

This document provides detailed instructions for setting up the MediLink application for development and production environments.

## Development Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Git
- Supabase account

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/medilink.git
cd medilink
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

### Step 4: Database Setup

1. Navigate to the SQL Editor in your Supabase dashboard
2. Run the migration files in the `supabase/migrations` directory in sequential order
3. Alternatively, use the Supabase CLI to run migrations:
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

### Step 5: Create Demo Users

1. Run the create-demo-users edge function to set up initial users:
   ```bash
   curl -X POST "https://your-project-ref.supabase.co/functions/v1/create-demo-users" \
   -H "Authorization: Bearer your_supabase_anon_key"
   ```

### Step 6: Start Development Server

```bash
npm start
# or
yarn start
```

## Production Deployment

### Web Deployment

1. Build the web version:
   ```bash
   npm run build:web
   # or
   yarn build:web
   ```

2. Deploy the `web-build` directory to your hosting provider of choice (Vercel, Netlify, etc.)

### Mobile App Deployment

1. Configure EAS Build:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. Build for iOS:
   ```bash
   eas build --platform ios
   ```

3. Build for Android:
   ```bash
   eas build --platform android
   ```

4. Submit to app stores:
   ```bash
   eas submit -p ios
   eas submit -p android
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| EXPO_PUBLIC_SUPABASE_URL | Your Supabase project URL | Yes |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anonymous key | Yes |
| SUPABASE_SERVICE_KEY | Your Supabase service role key (for migrations) | Yes |

## Troubleshooting

### Common Issues

1. **Database Migration Errors**
   - Ensure you're running migrations in the correct order
   - Check that your Supabase service key has the necessary permissions

2. **Authentication Issues**
   - Verify your Supabase URL and anon key are correct
   - Check that the auth schema is properly set up

3. **Build Errors**
   - Clear the cache: `expo start -c`
   - Ensure all dependencies are installed: `npm install`

### Getting Help

If you encounter issues not covered in this guide, please contact the repository owner for assistance.

---

© 2025 MediLink. All rights reserved.
