import React from 'react';
import { useAuthStore } from '@stores/authStore';
import { useRole } from '@hooks/useRole';
import { DashboardLayout } from '@modules/shared/layouts/DashboardLayout';
import { Card, CardContent, CardHeader } from '@modules/shared/components/Card';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { userRole, isSuperAdmin, isLandlord, isTenant, isStaff } = useRole();

  const getRoleLabel = () => {
    switch (userRole) {
      case 'super_admin':
        return 'Super Admin';
      case 'landlord':
        return 'Property Manager';
      case 'tenant':
        return 'Tenant';
      case 'staff':
        return 'Staff Member';
      default:
        return 'User';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You're logged in as a <span className="font-semibold">{getRoleLabel()}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">0</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Properties</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$0</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">0</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tenants</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">0</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Requests</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Start</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {isLandlord && (
                <>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Add your first property to get started
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Invite tenants and manage leases
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Set up payment collection via Paystack
                  </p>
                </>
              )}
              {isTenant && (
                <>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 View your lease details and payment history
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Submit maintenance requests
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Communicate with your property manager
                  </p>
                </>
              )}
              {isSuperAdmin && (
                <>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Manage platform users and workspaces
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Configure subscription plans
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 View platform analytics and reports
                  </p>
                </>
              )}
              {isStaff && (
                <>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 View assigned tasks and maintenance requests
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    👉 Update request status and communicate
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
