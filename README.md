# PropertyHub - Modular Property Management SaaS

A production-ready, modular Property Management SaaS application with multi-tenant architecture, role-based access control, and built-in payment processing.

## 🎯 Overview

PropertyHub is a complete SaaS skeleton that provides:

- ✅ **Multi-tenant architecture** - Each landlord/company has isolated data
- ✅ **Role-based access control** - Super Admin, Landlord, Tenant, Staff
- ✅ **Lazy-loaded modules** - 11+ pluggable feature modules
- ✅ **Supabase integration** - Auth, Database, Storage, Edge Functions
- ✅ **Paystack payments** - Rent collection and subscriptions
- ✅ **Modern UI/UX** - Beautiful landing page and dashboard
- ✅ **Dark/Light mode** - Built-in theme support
- ✅ **Session management** - Smart timeout handling and revalidation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Then update `.env.local` with your Supabase and Paystack credentials.

### 3. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:8080`

## 📁 Project Structure

```
src/
├── config/              # Configuration (Supabase, Paystack, env)
├── context/             # React contexts (Auth, Role, Theme)
├── stores/              # Zustand stores (auth, workspace, settings)
├── hooks/               # Custom hooks (useAuth, useRole, useWorkspace)
├── utils/               # API helpers, constants, utilities
├── router/              # Routing and route guards
├── modules/
│   ├── shared/         # Shared components and layouts
│   ├── superadmin/     # Super Admin dashboard
│   ├── landlord/       # Property Manager dashboard
│   ├── tenant/         # Tenant dashboard
│   ├── staff/          # Staff dashboard
│   ├── property/       # Property management
│   ├── payments/       # Payment collection
│   ├── maintenance/    # Maintenance requests
│   ├── reports/        # Analytics and reports
│   ├── communication/  # Messaging
│   ├── accounting/     # Financial management
│   └── tenant-portal/  # Tenant self-service
└── pages/               # Page components
```

## 🔐 Authentication & Authorization

### Roles

- **Super Admin**: Platform administrator with full access
- **Landlord**: Property manager with property and tenant management
- **Tenant**: Can view lease and submit maintenance requests
- **Staff**: Can handle maintenance and assigned tasks

### Session Management

- 30-minute inactivity timeout (configurable)
- Auto-resets on user activity (mouse, keyboard)
- Handles page visibility changes
- Graceful recovery from expired sessions

## 🏗️ Module System

All modules are lazy-loaded for optimal performance:

```typescript
// Module entry point structure
export const MyModule: React.FC = () => (
  <Routes>
    <Route index element={<MyDashboard />} />
    <Route path="*" element={<MyDashboard />} />
  </Routes>
);
```

Each module can be:

- ✅ Independently developed
- ✅ Toggle-able via feature toggles
- ✅ Extended with sub-routes
- ✅ Integrated seamlessly

## 💳 Paystack Integration

Payment functions are prepared in `src/config/paystack.ts`:

```typescript
// Initialize payment
const result = await initializePaystackPayment({
  email: "tenant@example.com",
  amount: 50000, // in kobo
  reference: "UNIQUE_REF",
});

// Verify payment
const verification = await verifyPaystackTransaction(reference);
```

## 🎨 UI Components

Pre-built shared components:

- `Button` - With multiple variants and states
- `Card` - With header, content, footer sections
- `Input` - Form input with validation
- `Loader` - Loading spinner
- `Navbar` - Top navigation with theme toggle
- `Sidebar` - Collapsible navigation menu
- `DashboardLayout` - Main app layout
- `AuthLayout` - Login/Register layout

## 🌐 Database Schema

### Core Tables

- `workspaces` - Tenant organization
- `settings` - Workspace configuration
- `plans` - Subscription plans
- `subscriptions` - Active subscriptions

### Additional Tables (to implement)

- `properties` - Property listings
- `tenants` - Tenant records
- `leases` - Lease agreements
- `payments` - Payment history
- `maintenance_requests` - Maintenance tickets
- `users` - User profiles

See `SETUP.md` for SQL schema.

## 🎯 Features

### Super Admin Module

- Manage platform users
- Configure subscription plans
- View platform analytics
- White-label settings

### Landlord Module

- Create and manage properties
- Manage tenant relationships
- Track rental income
- Monitor maintenance requests

### Tenant Module

- View lease details
- Make rent payments
- Submit maintenance requests
- Communicate with property manager

### Shared Features

- Payment collection via Paystack
- Maintenance request tracking
- Communication hub
- Financial reports
- Dark/light mode

## 🔄 State Management

### Zustand Stores

```typescript
useAuthStore; // User session
useWorkspaceStore; // Current workspace context
useSettingsStore; // Workspace settings & features
```

### React Contexts

```typescript
useAuthContext; // Auth initialization & session
useRoleContext; // Role-based access control
useTheme; // Dark/Light mode
```

## 🛣️ Routing

All routes with role protection:

```
/                          → Landing page
/auth/login               → Login page
/auth/register            → Registration page
/auth/forgot-password     → Password reset
/dashboard                → Main dashboard
/dashboard/superadmin/*   → Super Admin module (role protected)
/dashboard/landlord/*     → Landlord module (role protected)
/dashboard/tenant/*       → Tenant module (role protected)
/dashboard/staff/*        → Staff module (role protected)
/dashboard/property/*     → Property management
/dashboard/payments/*     → Payments & billing
/dashboard/maintenance/*  → Maintenance requests
/dashboard/reports/*      → Analytics & reports
/dashboard/communication/*→ Messaging
/dashboard/accounting/*   → Financial management
/tenant-portal/*          → Tenant self-service
```

## 🚀 Development Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Format code
pnpm format.fix
```

## 📋 Environment Variables

See `.env.example` for the complete list:

```env
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_KEY=          # Supabase anonymous key
VITE_PAYSTACK_PUBLIC_KEY=   # Paystack public key
VITE_PAYSTACK_SECRET_KEY=   # Paystack secret key
```

## 🔒 Security Features

- ✅ Supabase Row-Level Security (RLS)
- ✅ Protected routes with auth guards
- ✅ Role-based access control
- ✅ Session timeout protection
- ✅ Secure credential management
- ✅ CSRF protection via Supabase

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Sidebar collapse on mobile
- Touch-friendly components

## 🌙 Dark Mode

Built-in dark mode support:

- Toggle in navbar
- Persisted in localStorage
- System preference detection
- Smooth transitions

## 📚 Documentation

- `SETUP.md` - Detailed setup and Supabase configuration
- `AGENTS.md` - Architecture and development patterns
- This README - Quick reference

## 🤝 Contributing

When adding new features:

1. Create a new module in `src/modules/{feature}`
2. Export module component from `index.tsx`
3. Add route in `AppRouter.tsx`
4. Add shared components to `modules/shared`
5. Use existing hooks and stores for state

## 🚢 Deployment

### Netlify

```bash
netlify deploy --prod
```

### Vercel

```bash
vercel --prod
```

## 📄 License

Proprietary - PropertyHub

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Paystack Docs](https://paystack.com/docs)

## 🆘 Support

For questions or issues:

1. Check the documentation files
2. Review existing module implementations
3. Examine the shared components and hooks
4. Refer to service provider documentation

---

**Built with ❤️ for modern property management**
