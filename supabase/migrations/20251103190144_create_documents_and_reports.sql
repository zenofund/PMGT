/*
  # Create Documents and Reports Tables

  1. New Tables
    - `documents`
      - `id` (uuid, primary key) - Unique document identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `property_id` (uuid, foreign key, nullable) - References properties
      - `tenant_id` (uuid, foreign key, nullable) - References tenants
      - `lease_id` (uuid, foreign key, nullable) - References leases
      - `name` (text) - Document name
      - `description` (text, nullable) - Document description
      - `file_url` (text) - Document storage URL
      - `file_type` (text) - pdf, doc, image, etc.
      - `file_size` (integer) - File size in bytes
      - `category` (text) - lease, inspection, insurance, etc.
      - `uploaded_by` (uuid) - User who uploaded document
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `expense_records`
      - `id` (uuid, primary key) - Unique expense identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `property_id` (uuid, foreign key, nullable) - References properties
      - `category` (text) - maintenance, utilities, taxes, etc.
      - `description` (text) - Expense description
      - `amount` (decimal) - Expense amount
      - `currency` (text) - Currency code
      - `expense_date` (date) - Date of expense
      - `vendor_name` (text, nullable) - Vendor/supplier name
      - `receipt_url` (text, nullable) - Receipt document URL
      - `notes` (text, nullable) - Additional notes
      - `created_by` (uuid) - User who created record
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Landlords can manage documents and expenses
    - Tenants can view documents related to them
    - Staff can view and add expenses
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  lease_id uuid REFERENCES leases(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  category text NOT NULL CHECK (category IN ('lease', 'inspection', 'insurance', 'tax', 'receipt', 'contract', 'other')),
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expense_records table
CREATE TABLE IF NOT EXISTS expense_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('maintenance', 'utilities', 'taxes', 'insurance', 'mortgage', 'management_fees', 'supplies', 'advertising', 'legal', 'other')),
  description text NOT NULL,
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'NGN',
  expense_date date NOT NULL,
  vendor_name text,
  receipt_url text,
  notes text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON documents(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_expenses_workspace_id ON expense_records(workspace_id);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expense_records(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expense_records(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expense_records(expense_date);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;

-- Documents RLS Policies
CREATE POLICY "Workspace members can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords and staff can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  );

CREATE POLICY "Landlords can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );

-- Expense Records RLS Policies
CREATE POLICY "Workspace owners can view expenses"
  ON expense_records FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Landlords and staff can create expenses"
  ON expense_records FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  );

CREATE POLICY "Landlords can update expenses"
  ON expense_records FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can delete expenses"
  ON expense_records FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );