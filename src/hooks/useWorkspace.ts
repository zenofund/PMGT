import { useState } from 'react';
import { supabase } from '@config/supabaseClient';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { useSettingsStore } from '@stores/settingsStore';

export const useWorkspace = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workspace = useWorkspaceStore((state) => state.workspace);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const setWorkspaces = useWorkspaceStore((state) => state.setWorkspaces);
  const switchWorkspace = useWorkspaceStore((state) => state.switchWorkspace);

  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);

  const fetchUserWorkspaces = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('owner_id', userId);

      if (fetchError) throw fetchError;

      setWorkspaces(data || []);
      if (data && data.length > 0) {
        setWorkspace(data[0]);
      }
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workspaces';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkspace = async (name: string, workspaceData?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: createError } = await supabase
        .from('workspaces')
        .insert([{ name, ...workspaceData }])
        .select()
        .single();

      if (createError) throw createError;

      setWorkspaces([...workspaces, data]);
      setWorkspace(data);

      await fetchWorkspaceSettings(data.id);

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workspace';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkspaceSettings = async (workspaceId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (data) {
        setSettings(data);
      }
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkspaceSettings = async (
    workspaceId: string,
    settingsData: Record<string, any>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('settings')
        .update(settingsData)
        .eq('workspace_id', workspaceId)
        .select()
        .single();

      if (updateError) throw updateError;

      setSettings(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workspace,
    workspaces,
    settings,
    isLoading,
    error,
    fetchUserWorkspaces,
    createWorkspace,
    fetchWorkspaceSettings,
    updateWorkspaceSettings,
    switchWorkspace,
  };
};
