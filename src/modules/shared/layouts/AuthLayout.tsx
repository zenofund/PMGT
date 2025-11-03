import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
              PM
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
