import React from "react";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@hooks/useAuth";
import { useAuthStore } from "@stores/authStore";
import { Button } from "./Button";

export const Navbar: React.FC = () => {
  const { theme, isDark, setTheme } = useTheme();
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/auth/login";
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              PM
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              PropertyHub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
