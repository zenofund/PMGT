import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  avatar_url?: string;
  created_at?: string;
  subscription_status?: string;
}

export interface WorkspaceState {
  workspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  currentWorkspaceId: string | null;

  setWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentWorkspaceId: (id: string | null) => void;
  switchWorkspace: (workspaceId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspace: null,
      workspaces: [],
      isLoading: false,
      currentWorkspaceId: null,

      setWorkspace: (workspace) => set({ workspace }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
      switchWorkspace: (workspaceId) => {
        set((state) => {
          const workspace = state.workspaces.find((w) => w.id === workspaceId);
          return {
            workspace: workspace || null,
            currentWorkspaceId: workspaceId,
          };
        });
      },
    }),
    {
      name: 'workspace-store',
      partialize: (state) => ({
        workspace: state.workspace,
        workspaces: state.workspaces,
        currentWorkspaceId: state.currentWorkspaceId,
      }),
    }
  )
);
