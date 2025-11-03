/*
  # Create Workspaces and Settings Tables

  1. New Tables
    - `workspaces`
      - `id` (uuid, primary key) - Unique workspace identifier
      - `name` (text) - Workspace/company name
      - `owner_id` (uuid, foreign key) - References auth.users
      - `avatar_url` (text, nullable) - Workspace logo/avatar
      - `subscription_status` (text) - active, inactive, cancelled, pending, expired
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `settings`
      - `id` (uuid, primary key) - Unique settings identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `currency` (text) - Default currency (USD, NGN, etc.)
      - `timezone` (text) - Workspace timezone
      - `region` (text, nullable) - Geographic region
      - `branding` (jsonb) - Logo, colors, company name
      - `feature_toggles` (jsonb) - Enable/disable modules
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Workspace owners can manage their workspaces
    - Workspace members can view workspace data
    - Only workspace owners can modify settings
*/

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url text,
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'pending', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  region text,
  branding jsonb DEFAULT '{"logo": null, "colors": {"primary": "#3B82F6", "secondary": "#64748B"}, "name": null}'::jsonb,
  feature_toggles jsonb DEFAULT '{"maintenance_module": true, "accounting_module": true, "communication_module": true, "reports_module": true, "staff_module": true, "tenant_portal": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_settings_workspace_id ON settings(workspace_id);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Workspaces RLS Policies
CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Settings RLS Policies
CREATE POLICY "Workspace owners can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can create settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );