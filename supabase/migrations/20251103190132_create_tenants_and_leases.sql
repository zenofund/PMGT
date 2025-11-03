/*
  # Create Tenants and Leases Tables

  1. New Tables
    - `tenants`
      - `id` (uuid, primary key) - Unique tenant identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `user_id` (uuid, foreign key, nullable) - References auth.users if tenant has account
      - `full_name` (text) - Tenant full name
      - `email` (text) - Tenant email
      - `phone` (text, nullable) - Tenant phone number
      - `date_of_birth` (date, nullable) - Date of birth
      - `emergency_contact_name` (text, nullable) - Emergency contact
      - `emergency_contact_phone` (text, nullable) - Emergency contact phone
      - `identification_type` (text, nullable) - ID type
      - `identification_number` (text, nullable) - ID number
      - `status` (text) - active, inactive, pending
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `leases`
      - `id` (uuid, primary key) - Unique lease identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `property_id` (uuid, foreign key) - References properties
      - `tenant_id` (uuid, foreign key) - References tenants
      - `lease_start` (date) - Lease start date
      - `lease_end` (date) - Lease end date
      - `rent_amount` (decimal) - Monthly rent amount
      - `security_deposit` (decimal) - Security deposit amount
      - `payment_due_day` (integer) - Day of month payment is due
      - `status` (text) - active, expired, terminated
      - `terms` (text, nullable) - Lease terms and conditions
      - `signed_at` (timestamptz, nullable) - When lease was signed
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Landlords and staff can manage tenants and leases
    - Tenants can view their own information
*/

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  emergency_contact_name text,
  emergency_contact_phone text,
  identification_type text,
  identification_number text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id, email)
);

-- Create leases table
CREATE TABLE IF NOT EXISTS leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lease_start date NOT NULL,
  lease_end date NOT NULL,
  rent_amount decimal(10, 2) NOT NULL,
  security_deposit decimal(10, 2) DEFAULT 0,
  payment_due_day integer DEFAULT 1 CHECK (payment_due_day >= 1 AND payment_due_day <= 31),
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  terms text,
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_workspace_id ON tenants(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_leases_workspace_id ON leases(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leases_property_id ON leases(property_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant_id ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leases_status ON leases(status);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

-- Tenants RLS Policies
CREATE POLICY "Workspace owners can view tenants"
  ON tenants FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Landlords can create tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  );

CREATE POLICY "Landlords can update tenants"
  ON tenants FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Landlords can delete tenants"
  ON tenants FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );

-- Leases RLS Policies
CREATE POLICY "Workspace members can view leases"
  ON leases FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can create leases"
  ON leases FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  );

CREATE POLICY "Landlords can update leases"
  ON leases FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can delete leases"
  ON leases FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );