export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  STAFF: 'staff',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  EXPIRED: 'expired',
} as const;

export const FEATURE_TOGGLES = {
  MAINTENANCE_MODULE: 'maintenance_module',
  ACCOUNTING_MODULE: 'accounting_module',
  COMMUNICATION_MODULE: 'communication_module',
  REPORTS_MODULE: 'reports_module',
  STAFF_MODULE: 'staff_module',
  TENANT_PORTAL: 'tenant_portal',
} as const;

export const BILLING_CYCLE = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  SEMI_ANNUAL: 'semi_annual',
  ANNUAL: 'annual',
} as const;

export const SESSION_TIMEOUT = 30 * 60 * 1000;

export const MODULE_PATHS = {
  SUPER_ADMIN: '/dashboard/superadmin',
  LANDLORD: '/dashboard/landlord',
  TENANT: '/dashboard/tenant',
  STAFF: '/dashboard/staff',
  PROPERTY: '/dashboard/property',
  PAYMENTS: '/dashboard/payments',
  MAINTENANCE: '/dashboard/maintenance',
  REPORTS: '/dashboard/reports',
  COMMUNICATION: '/dashboard/communication',
  ACCOUNTING: '/dashboard/accounting',
  TENANT_PORTAL: '/tenant-portal',
} as const;
