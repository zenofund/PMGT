import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@modules/shared/layouts/DashboardLayout";
import { Card, CardContent } from "@modules/shared/components/Card";

const LandlordDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Property Manager Dashboard
      </h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Landlord module is ready for development. Manage properties,
            tenants, and rental income here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const LandlordModule: React.FC = () => (
  <Routes>
    <Route index element={<LandlordDashboard />} />
    <Route path="*" element={<LandlordDashboard />} />
  </Routes>
);
