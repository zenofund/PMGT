# PropertyHub - Property Management SaaS Setup Guide

## Overview

PropertyHub is a modular, multi-tenant Property Management SaaS application built with:
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Payments**: Paystack Integration
- **State Management**: Zustand
- **Routing**: React Router 6

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── env.ts          # Environment variables
│   ├── supabaseClient.ts # Supabase initialization
│   └── paystack.ts     # Paystack integration
├── context/             # React Contexts
│   ├── AuthContext.tsx   # Authentication state
│   ├── RoleContext.tsx   # Role-based access control
│   └── ThemeContext.tsx  # Dark/Light mode
├── stores/              # Zustand state stores
│   ├── authStore.ts     # User authentication state
│   ├── workspaceStore.ts # Workspace/tenant context
│   └── settingsStore.ts # Workspace settings
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Auth operations
│   ├── useRole.ts       # Role access control
│   └── useWorkspace.ts  # Workspace operations
├── utils/               # Utility functions
│   ├── api.ts          # API helper functions
│   ├── constants.ts    # Application constants
│   └── helpers.ts      # General helpers
├── router/              # Routing configuration
│   ├── AppRouter.tsx    # Main router with lazy loading
│   └── ProtectedRoute.tsx # Auth & role guards
├── modules/             # Feature modules (lazy loaded)
│   ├── shared/         # Shared components & layouts
│   ├── superadmin/     # Super Admin module
│   ├── landlord/       # Property Manager module
│   ├── tenant/         # Tenant module
│   ├── staff/          # Staff module
│   ├── property/       # Property management
│   ├── payments/       # Payments & billing
│   ├── maintenance/    # Maintenance requests
│   ├── reports/        # Analytics & reports
│   ├── communication/  # Messaging system
│   ├── accounting/     # Financial management
│   └── tenant-portal/  # Tenant self-service
└── pages/               # Route pages
    ├── Landing.tsx     # Public landing page
    ├── Login.tsx       # Authentication
    ├── Register.tsx
    ├── ForgotPassword.tsx
    ├── Dashboard.tsx
    └── NotFound.tsx
```

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your credentials:

```bash
cp .env.example .env.local
```

#### Required Environment Variables:

```env
# Supabase Setup
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anonymous-key

# Paystack Setup
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key
VITE_PAYSTACK_SECRET_KEY=sk_test_your_key
```

### 3. Set Up Supabase

#### Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (handled by Supabase Auth)

-- Workspaces (Tenants)
CREATE TABLE workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  avatar_url text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Workspace Settings
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  region text,
  branding jsonb DEFAULT '{}',
  feature_toggles jsonb DEFAULT '{}',
  updated_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Subscription Plans
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal NOT NULL,
  billing_cycle text NOT NULL,
  features jsonb DEFAULT '[]',
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  plan_id uuid NOT NULL REFERENCES plans(id),
  status text DEFAULT 'active',
  billing_cycle text,
  renewal_date timestamp WITH TIME ZONE,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

#### Create RLS Policies

```sql
-- Workspaces: Users can see their own workspaces
CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can update own workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = owner_id);

-- Settings: Users can view/update workspace settings they own
CREATE POLICY "Users can view workspace settings"
  ON settings FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update workspace settings"
  ON settings FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));
```

### 4. Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:8080`

## Architecture Overview

### Multi-Tenant Structure

Each landlord/company (workspace) has its own data scope:
- Workspace owns properties, tenants, and settings
- Users belong to workspaces with specific roles
- All queries are scoped to the current workspace

### Role-Based Access Control (RBAC)

```
- Super Admin: Platform administrator, full access
- Landlord/Property Manager: Manages their properties and tenants
- Tenant: Access to their lease and portal
- Staff/Agent: Assigned maintenance and support tasks
```

### Module System

All modules are lazy-loaded for better performance:
- Routes: `/dashboard/{module}/*`
- Each module is a self-contained feature
- Modules can be toggled via `feature_toggles`

### Authentication Flow

1. User registers/logs in via Supabase Auth
2. User role and workspace_id stored in `user_metadata`
3. AuthContext monitors session and revalidates on:
   - User becomes active (mousemove, keydown)
   - Page visibility changes
   - After 30 minutes of inactivity (configurable)
4. Session timeout triggers automatic logout

### State Management

```
useAuthStore          - User session
useWorkspaceStore     - Current workspace/tenant context
useSettingsStore      - Workspace settings and feature toggles
```

## Development Workflow

### Creating a New Feature Module

1. Create folder: `src/modules/{feature-name}/`
2. Add `index.tsx` with module export:

```typescript
export const MyModule: React.FC = () => (
  <Routes>
    <Route index element={<MyDashboard />} />
    <Route path="*" element={<MyDashboard />} />
  </Routes>
);
```

3. Add route in `AppRouter.tsx`:

```typescript
<Route
  path="/dashboard/myfeature/*"
  element={
    <ProtectedRoute>
      <MyModule />
    </ProtectedRoute>
  }
/>
```

### Creating a New Shared Component

1. Add component to `src/modules/shared/components/`
2. Export from `src/modules/shared/index.ts`
3. Use across modules with confidence

### Adding a New API Hook

Create in `src/hooks/` following the pattern of existing hooks:
- Use Zustand stores for state
- Handle errors gracefully
- Return consistent API (success, error, isLoading)

## Paystack Integration

Placeholder functions for Paystack are in `src/config/paystack.ts`:
- `initializePaystackPayment()` - Initialize payment
- `verifyPaystackTransaction()` - Verify payment

Implement with your Paystack backend endpoint.

## Session Management

- Default timeout: 30 minutes
- Auto-resets on user activity
- Handles stale sessions gracefully
- Cleans up on page visibility change

Configure in `src/utils/constants.ts`:
```typescript
SESSION_TIMEOUT = 30 * 60 * 1000 // milliseconds
```

## Deployment

### Build

```bash
pnpm build
```

### Using Netlify

```bash
netlify deploy --prod
```

### Using Vercel

```bash
vercel --prod
```

## Next Steps

1. **Set up Supabase project** with tables and RLS policies
2. **Configure environment variables** for your Supabase and Paystack
3. **Develop feature modules** one by one
4. **Implement Paystack integration** with your backend
5. **Deploy to production** using Netlify or Vercel

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review Paystack integration: https://paystack.com/docs
- React Router documentation: https://reactrouter.com

## License

Proprietary - PropertyHub
