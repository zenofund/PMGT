import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@stores/authStore';
import { useAuthContext } from '@context/AuthContext';
import { Loader } from '@modules/shared/components/Loader';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '@utils/constants';

const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const SuperAdminModule = lazy(() =>
  import('@modules/superadmin').then((m) => ({
    default: m.SuperAdminModule,
  }))
);
const LandlordModule = lazy(() =>
  import('@modules/landlord').then((m) => ({
    default: m.LandlordModule,
  }))
);
const TenantModule = lazy(() =>
  import('@modules/tenant').then((m) => ({
    default: m.TenantModule,
  }))
);
const StaffModule = lazy(() =>
  import('@modules/staff').then((m) => ({
    default: m.StaffModule,
  }))
);

const PropertyModule = lazy(() =>
  import('@modules/property').then((m) => ({
    default: m.PropertyModule,
  }))
);
const PaymentsModule = lazy(() =>
  import('@modules/payments').then((m) => ({
    default: m.PaymentsModule,
  }))
);
const MaintenanceModule = lazy(() =>
  import('@modules/maintenance').then((m) => ({
    default: m.MaintenanceModule,
  }))
);
const ReportsModule = lazy(() =>
  import('@modules/reports').then((m) => ({
    default: m.ReportsModule,
  }))
);
const CommunicationModule = lazy(() =>
  import('@modules/communication').then((m) => ({
    default: m.CommunicationModule,
  }))
);
const AccountingModule = lazy(() =>
  import('@modules/accounting').then((m) => ({
    default: m.AccountingModule,
  }))
);
const TenantPortalModule = lazy(() =>
  import('@modules/tenant-portal').then((m) => ({
    default: m.TenantPortalModule,
  }))
);

const ModuleLoader = () => <Loader fullScreen />;

export const AppRouter: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { isLoading } = useAuthContext();

  return (
    <BrowserRouter>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Home */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Module */}
          <Route
            path="/dashboard/superadmin/*"
            element={
              <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
                <SuperAdminModule />
              </ProtectedRoute>
            }
          />

          {/* Landlord Module */}
          <Route
            path="/dashboard/landlord/*"
            element={
              <ProtectedRoute requiredRole={ROLES.LANDLORD}>
                <LandlordModule />
              </ProtectedRoute>
            }
          />

          {/* Tenant Module */}
          <Route
            path="/dashboard/tenant/*"
            element={
              <ProtectedRoute requiredRole={ROLES.TENANT}>
                <TenantModule />
              </ProtectedRoute>
            }
          />

          {/* Staff Module */}
          <Route
            path="/dashboard/staff/*"
            element={
              <ProtectedRoute requiredRole={ROLES.STAFF}>
                <StaffModule />
              </ProtectedRoute>
            }
          />

          {/* Feature Modules */}
          <Route
            path="/dashboard/property/*"
            element={
              <ProtectedRoute>
                <PropertyModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/payments/*"
            element={
              <ProtectedRoute>
                <PaymentsModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/maintenance/*"
            element={
              <ProtectedRoute>
                <MaintenanceModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/reports/*"
            element={
              <ProtectedRoute>
                <ReportsModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/communication/*"
            element={
              <ProtectedRoute>
                <CommunicationModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/accounting/*"
            element={
              <ProtectedRoute>
                <AccountingModule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant-portal/*"
            element={
              <ProtectedRoute>
                <TenantPortalModule />
              </ProtectedRoute>
            }
          />

          {/* Root Route */}
          <Route
            path="/"
            element={
              isLoading ? (
                <Loader fullScreen />
              ) : user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Landing />
              )
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
