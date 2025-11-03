import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@modules/shared/layouts/DashboardLayout';
import { Card, CardContent } from '@modules/shared/components/Card';

const AccountingDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounting & Finance</h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Accounting module is ready for development. Track income, expenses, and financial reports here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const AccountingModule: React.FC = () => (
  <Routes>
    <Route index element={<AccountingDashboard />} />
    <Route path="*" element={<AccountingDashboard />} />
  </Routes>
);
