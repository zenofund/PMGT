import React from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 ml-64 lg:ml-64">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
