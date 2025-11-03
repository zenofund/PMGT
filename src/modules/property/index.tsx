import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@modules/shared/layouts/DashboardLayout";
import { Card, CardContent } from "@modules/shared/components/Card";

const PropertyDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Property Management
      </h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Property module is ready for development. Create, edit, and manage
            property listings here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const PropertyModule: React.FC = () => (
  <Routes>
    <Route index element={<PropertyDashboard />} />
    <Route path="*" element={<PropertyDashboard />} />
  </Routes>
);
