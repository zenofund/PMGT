import React from 'react';
import { AuthProvider } from '@context/AuthContext';
import { RoleProvider } from '@context/RoleContext';
import { ThemeProvider } from '@context/ThemeContext';
import { AppRouter } from '@/router/AppRouter';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <AppRouter />
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
