import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@modules/shared/layouts/DashboardLayout';
import { Card, CardContent } from '@modules/shared/components/Card';

const SuperAdminDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Super Admin module is ready for development. Manage platform users, subscription plans, and system settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const SuperAdminModule: React.FC = () => (
  <Routes>
    <Route index element={<SuperAdminDashboard />} />
    <Route path="*" element={<SuperAdminDashboard />} />
  </Routes>
);
