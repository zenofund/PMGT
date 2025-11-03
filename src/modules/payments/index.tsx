import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@modules/shared/layouts/DashboardLayout";
import { Card, CardContent } from "@modules/shared/components/Card";

const PaymentsDashboard: React.FC = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Payments & Billing
      </h1>
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Payments module is ready for development. Integrate Paystack for
            rent collection and subscriptions here.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export const PaymentsModule: React.FC = () => (
  <Routes>
    <Route index element={<PaymentsDashboard />} />
    <Route path="*" element={<PaymentsDashboard />} />
  </Routes>
);
