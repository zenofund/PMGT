import { supabase } from '@config/supabaseClient';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const fetchUserProfile = async (userId: string) => {
  try {
    if (!supabase.from) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

export const fetchWorkspaceSettings = async (workspaceId: string) => {
  try {
    if (!supabase.from) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

export const updateWorkspaceSettings = async (
  workspaceId: string,
  updates: Record<string, any>
) => {
  try {
    if (!supabase.from) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('settings')
      .update(updates)
      .eq('workspace_id', workspaceId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

export const fetchSubscriptionPlans = async () => {
  try {
    if (!supabase.from) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.from('plans').select('*').order('price', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

export const fetchWorkspaceSubscription = async (workspaceId: string) => {
  try {
    if (!supabase.from) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};
