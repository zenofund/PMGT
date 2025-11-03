/*
  # Create Payments Table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key) - Unique payment identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `tenant_id` (uuid, foreign key) - References tenants
      - `lease_id` (uuid, foreign key) - References leases
      - `property_id` (uuid, foreign key) - References properties
      - `amount` (decimal) - Payment amount
      - `currency` (text) - Currency code
      - `payment_method` (text) - paystack, cash, bank_transfer, check
      - `payment_type` (text) - rent, deposit, late_fee, other
      - `status` (text) - pending, completed, failed, refunded
      - `transaction_reference` (text, nullable) - External payment reference
      - `payment_date` (timestamptz) - When payment was made
      - `due_date` (date, nullable) - When payment was due
      - `notes` (text, nullable) - Additional notes
      - `paystack_data` (jsonb, nullable) - Paystack response data
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on payments table
    - Landlords can view and manage all workspace payments
    - Tenants can view their own payments
    - Staff can process payments
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lease_id uuid REFERENCES leases(id) ON DELETE SET NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'NGN',
  payment_method text NOT NULL CHECK (payment_method IN ('paystack', 'cash', 'bank_transfer', 'check', 'other')),
  payment_type text NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'late_fee', 'maintenance', 'other')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_reference text,
  payment_date timestamptz DEFAULT now(),
  due_date date,
  notes text,
  paystack_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_workspace_id ON payments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_lease_id ON payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_reference ON payments(transaction_reference);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payments RLS Policies
CREATE POLICY "Workspace owners can view payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords and staff can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin', 'staff')
  );

CREATE POLICY "Landlords and staff can update payments"
  ON payments FOR UPDATE
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

CREATE POLICY "Landlords can delete payments"
  ON payments FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );