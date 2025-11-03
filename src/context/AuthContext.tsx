import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@config/supabaseClient';
import { useAuthStore } from '@stores/authStore';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useSettingsStore } from '@stores/settingsStore';
import { SESSION_TIMEOUT } from '@utils/constants';

interface AuthContextType {
  isLoading: boolean;
  isSessionValid: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoading: true, isSessionValid: false });

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const setCurrentWorkspaceId = useWorkspaceStore((state) => state.setCurrentWorkspaceId);
  const setSettings = useSettingsStore((state) => state.setSettings);

  const resetSessionTimer = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    const timer = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_TIMEOUT);

    setSessionTimer(timer);
  };

  const handleSessionTimeout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthenticated(false);
    setIsSessionValid(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setAuthenticated(true);
          setIsSessionValid(true);

          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            role: session.user.user_metadata?.role || 'tenant',
            workspace_id: session.user.user_metadata?.workspace_id || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            full_name: session.user.user_metadata?.full_name,
          };

          setUser(userData);
          if (userData.workspace_id) {
            setCurrentWorkspaceId(userData.workspace_id);
          }

          resetSessionTimer();
        } else {
          setUser(null);
          setAuthenticated(false);
          setIsSessionValid(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setAuthenticated(false);
        setIsSessionValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'tenant',
          workspace_id: session.user.user_metadata?.workspace_id || '',
          avatar_url: session.user.user_metadata?.avatar_url,
          full_name: session.user.user_metadata?.full_name,
        });
        setAuthenticated(true);
        setIsSessionValid(true);
        resetSessionTimer();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAuthenticated(false);
        setIsSessionValid(false);
        setWorkspace(null);
        setSettings(null);
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setIsSessionValid(true);
        resetSessionTimer();
      }
    });

    const handleVisibilityChange = () => {
      if (!document.hidden && isSessionValid) {
        resetSessionTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keydown', resetSessionTimer);

    return () => {
      subscription?.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', resetSessionTimer);
      document.removeEventListener('keydown', resetSessionTimer);
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isSessionValid }}>
      {children}
    </AuthContext.Provider>
  );
};
