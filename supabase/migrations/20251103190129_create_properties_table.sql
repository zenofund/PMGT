/*
  # Create Properties Table

  1. New Tables
    - `properties`
      - `id` (uuid, primary key) - Unique property identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `name` (text) - Property name/title
      - `description` (text, nullable) - Property description
      - `property_type` (text) - apartment, house, commercial, etc.
      - `address` (text) - Full address
      - `city` (text) - City
      - `state` (text) - State/Province
      - `country` (text) - Country
      - `postal_code` (text, nullable) - ZIP/Postal code
      - `bedrooms` (integer, nullable) - Number of bedrooms
      - `bathrooms` (integer, nullable) - Number of bathrooms
      - `square_feet` (integer, nullable) - Property size
      - `rent_amount` (decimal) - Monthly rent amount
      - `currency` (text) - Currency code
      - `status` (text) - available, occupied, maintenance, unlisted
      - `images` (jsonb) - Array of image URLs
      - `amenities` (jsonb) - Array of amenities
      - `created_by` (uuid) - User who created the property
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on properties table
    - Landlords can manage their workspace properties
    - Tenants can view properties in their workspace
    - Staff can view and update properties
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  property_type text NOT NULL CHECK (property_type IN ('apartment', 'house', 'condo', 'townhouse', 'commercial', 'other')),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL DEFAULT 'Nigeria',
  postal_code text,
  bedrooms integer,
  bathrooms integer,
  square_feet integer,
  rent_amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'NGN',
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'unlisted')),
  images jsonb DEFAULT '[]'::jsonb,
  amenities jsonb DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_workspace_id ON properties(workspace_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Properties RLS Policies
CREATE POLICY "Workspace members can view properties"
  ON properties FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );

CREATE POLICY "Landlords can update properties"
  ON properties FOR UPDATE
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

CREATE POLICY "Landlords can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    AND (auth.jwt()->>'user_metadata')::jsonb->>'role' IN ('landlord', 'super_admin')
  );