/*
  # Create Maintenance Requests Table

  1. New Tables
    - `maintenance_requests`
      - `id` (uuid, primary key) - Unique request identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `property_id` (uuid, foreign key) - References properties
      - `tenant_id` (uuid, foreign key) - References tenants
      - `assigned_to` (uuid, foreign key, nullable) - References auth.users (staff)
      - `title` (text) - Request title
      - `description` (text) - Detailed description
      - `priority` (text) - low, medium, high, urgent
      - `status` (text) - pending, in_progress, completed, cancelled
      - `category` (text) - plumbing, electrical, hvac, etc.
      - `images` (jsonb) - Array of image URLs
      - `estimated_cost` (decimal, nullable) - Estimated repair cost
      - `actual_cost` (decimal, nullable) - Actual cost after completion
      - `scheduled_date` (timestamptz, nullable) - When work is scheduled
      - `completed_date` (timestamptz, nullable) - When work was completed
      - `notes` (text, nullable) - Internal notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on maintenance_requests table
    - Tenants can create and view their own requests
    - Landlords and staff can view and manage all workspace requests
    - Staff can update assigned requests
*/

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  category text NOT NULL CHECK (category IN ('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'pest_control', 'cleaning', 'landscaping', 'other')),
  images jsonb DEFAULT '[]'::jsonb,
  estimated_cost decimal(10, 2),
  actual_cost decimal(10, 2),
  scheduled_date timestamptz,
  completed_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_workspace_id ON maintenance_requests(workspace_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_property_id ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tenant_id ON maintenance_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_assigned_to ON maintenance_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);

-- Enable RLS
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Maintenance Requests RLS Policies
CREATE POLICY "Workspace members can view maintenance requests"
  ON maintenance_requests FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Tenants can create maintenance requests"
  ON maintenance_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
    OR (
      workspace_id IN (
        SELECT id FROM workspaces WHERE owner_id = auth.uid()
      )
      AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
    )
  );

CREATE POLICY "Landlords and staff can update maintenance requests"
  ON maintenance_requests FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR assigned_to = auth.uid()
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Landlords can delete maintenance requests"
  ON maintenance_requests FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );