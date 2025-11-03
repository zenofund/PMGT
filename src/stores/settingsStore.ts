import { create } from "zustand";

export interface WorkspaceSettings {
  workspace_id: string;
  currency?: string;
  timezone?: string;
  region?: string;
  branding?: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
    name?: string;
  };
  feature_toggles?: {
    [key: string]: boolean;
  };
}

export interface SettingsState {
  settings: WorkspaceSettings | null;
  isLoading: boolean;
  isSaving: boolean;

  setSettings: (settings: WorkspaceSettings | null) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  updateSetting: (key: string, value: any) => void;
  toggleFeature: (featureName: string, enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  isSaving: false,

  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),

  updateSetting: (key, value) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, [key]: value } : null,
    })),

  toggleFeature: (featureName, enabled) =>
    set((state) => ({
      settings: state.settings
        ? {
            ...state.settings,
            feature_toggles: {
              ...state.settings.feature_toggles,
              [featureName]: enabled,
            },
          }
        : null,
    })),
}));
