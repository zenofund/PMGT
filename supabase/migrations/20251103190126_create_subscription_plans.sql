/*
  # Create Subscription Plans and Subscriptions Tables

  1. New Tables
    - `plans`
      - `id` (uuid, primary key) - Unique plan identifier
      - `name` (text) - Plan name (Starter, Professional, Enterprise)
      - `price` (decimal) - Monthly price in cents/kobo
      - `billing_cycle` (text) - monthly, quarterly, semi_annual, annual
      - `features` (jsonb) - Array of included features
      - `max_properties` (integer, nullable) - Maximum properties allowed
      - `max_tenants` (integer, nullable) - Maximum tenants allowed
      - `is_active` (boolean) - Whether plan is available for subscription
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `subscriptions`
      - `id` (uuid, primary key) - Unique subscription identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `plan_id` (uuid, foreign key) - References plans
      - `status` (text) - active, inactive, cancelled, pending, expired
      - `billing_cycle` (text) - monthly, quarterly, semi_annual, annual
      - `current_period_start` (timestamptz) - Start of current billing period
      - `current_period_end` (timestamptz) - End of current billing period
      - `renewal_date` (timestamptz) - Next renewal date
      - `cancelled_at` (timestamptz, nullable) - Cancellation timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - All authenticated users can view plans
    - Only workspace owners can manage subscriptions
    - Super admins can manage plans
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10, 2) NOT NULL,
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
  features jsonb DEFAULT '[]'::jsonb,
  max_properties integer,
  max_tenants integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'pending', 'expired')),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  renewal_date timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workspace_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id ON subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans RLS Policies (all authenticated users can view)
CREATE POLICY "All authenticated users can view plans"
  ON plans FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Super admins can manage plans"
  ON plans FOR ALL
  TO authenticated
  USING (
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'super_admin'
  )
  WITH CHECK (
    (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'super_admin'
  );

-- Subscriptions RLS Policies
CREATE POLICY "Workspace owners can view subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace owners can update subscriptions"
  ON subscriptions FOR UPDATE
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

-- Insert default plans
INSERT INTO plans (name, price, billing_cycle, features, max_properties, max_tenants) VALUES
  ('Starter', 2900, 'monthly', '["1 Property", "Up to 5 Tenants", "Basic Reports", "Email Support"]'::jsonb, 1, 5),
  ('Professional', 7900, 'monthly', '["Unlimited Properties", "Unlimited Tenants", "Advanced Reports", "Paystack Integration", "Priority Support"]'::jsonb, NULL, NULL),
  ('Enterprise', 0, 'monthly', '["Everything in Professional", "API Access", "Custom Branding", "White Label Options", "Dedicated Support"]'::jsonb, NULL, NULL)
ON CONFLICT DO NOTHING;