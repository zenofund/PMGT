import React, { createContext, useContext } from 'react';
import { useAuthStore } from '@stores/authStore';
import { ROLES } from '@utils/constants';

interface RoleContextType {
  userRole: string | null;
  isSuperAdmin: boolean;
  isLandlord: boolean;
  isTenant: boolean;
  isStaff: boolean;
  canAccessModule: (moduleRole: string) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export const useRoleContext = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within RoleProvider');
  }
  return context;
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || null;

  const isSuperAdmin = userRole === ROLES.SUPER_ADMIN;
  const isLandlord = userRole === ROLES.LANDLORD;
  const isTenant = userRole === ROLES.TENANT;
  const isStaff = userRole === ROLES.STAFF;

  const canAccessModule = (moduleRole: string): boolean => {
    if (!userRole) return false;
    
    if (isSuperAdmin) return true;
    return userRole === moduleRole;
  };

  const value: RoleContextType = {
    userRole,
    isSuperAdmin,
    isLandlord,
    isTenant,
    isStaff,
    canAccessModule,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
