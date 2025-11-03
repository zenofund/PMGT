import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@modules/shared/layouts/DashboardLayout";
import { Card, CardContent } from "@modules/shared/components/Card";

const ReportsDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Reports & Analytics
      </h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Reports module is ready for development. Generate insights and
            analytics here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const ReportsModule: React.FC = () => (
  <Routes>
    <Route index element={<ReportsDashboard />} />
    <Route path="*" element={<ReportsDashboard />} />
  </Routes>
);
