import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@modules/shared/layouts/DashboardLayout';
import { Card, CardContent } from '@modules/shared/components/Card';

const TenantDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tenant Portal</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Tenant module is ready for development. View lease, make payments, and submit maintenance requests here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const TenantModule: React.FC = () => (
  <Routes>
    <Route index element={<TenantDashboard />} />
    <Route path="*" element={<TenantDashboard />} />
  </Routes>
);
