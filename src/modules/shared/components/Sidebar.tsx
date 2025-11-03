import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '@hooks/useRole';
import { ROLES, MODULE_PATHS } from '@utils/constants';

interface SidebarItem {
  label: string;
  icon: string;
  path: string;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', icon: '📊', path: '/dashboard', roles: [ROLES.SUPER_ADMIN, ROLES.LANDLORD, ROLES.TENANT, ROLES.STAFF] },
  { label: 'Super Admin', icon: '👑', path: MODULE_PATHS.SUPER_ADMIN, roles: [ROLES.SUPER_ADMIN] },
  { label: 'Properties', icon: '🏠', path: MODULE_PATHS.PROPERTY, roles: [ROLES.LANDLORD, ROLES.SUPER_ADMIN] },
  { label: 'Tenants', icon: '👥', path: '/dashboard/tenants', roles: [ROLES.LANDLORD, ROLES.SUPER_ADMIN] },
  { label: 'Payments', icon: '💳', path: MODULE_PATHS.PAYMENTS, roles: [ROLES.LANDLORD, ROLES.TENANT, ROLES.SUPER_ADMIN] },
  { label: 'Maintenance', icon: '🔧', path: MODULE_PATHS.MAINTENANCE, roles: [ROLES.LANDLORD, ROLES.TENANT, ROLES.STAFF, ROLES.SUPER_ADMIN] },
  { label: 'Accounting', icon: '📈', path: MODULE_PATHS.ACCOUNTING, roles: [ROLES.LANDLORD, ROLES.SUPER_ADMIN] },
  { label: 'Reports', icon: '📄', path: MODULE_PATHS.REPORTS, roles: [ROLES.LANDLORD, ROLES.SUPER_ADMIN] },
  { label: 'Communication', icon: '💬', path: MODULE_PATHS.COMMUNICATION, roles: [ROLES.LANDLORD, ROLES.TENANT, ROLES.SUPER_ADMIN] },
  { label: 'Settings', icon: '⚙️', path: '/dashboard/settings', roles: [ROLES.SUPER_ADMIN, ROLES.LANDLORD] },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userRole } = useRole();

  const visibleItems = sidebarItems.filter((item) =>
    userRole && item.roles.includes(userRole)
  );

  return (
    <aside
      className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } min-h-screen fixed left-0 top-16`}
    >
      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex justify-end p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="space-y-2 px-2">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            title={isCollapsed ? item.label : undefined}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
