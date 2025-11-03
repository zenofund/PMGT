/*
  # Create Messages and Notifications Tables

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique message identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `sender_id` (uuid, foreign key) - References auth.users
      - `recipient_id` (uuid, foreign key) - References auth.users
      - `subject` (text, nullable) - Message subject
      - `body` (text) - Message content
      - `is_read` (boolean) - Whether message has been read
      - `read_at` (timestamptz, nullable) - When message was read
      - `parent_id` (uuid, nullable) - For threaded messages
      - `attachments` (jsonb) - Array of attachment URLs
      - `created_at` (timestamptz) - Creation timestamp
    
    - `notifications`
      - `id` (uuid, primary key) - Unique notification identifier
      - `workspace_id` (uuid, foreign key) - References workspaces
      - `user_id` (uuid, foreign key) - References auth.users
      - `title` (text) - Notification title
      - `message` (text) - Notification message
      - `type` (text) - payment, maintenance, lease, system, etc.
      - `is_read` (boolean) - Whether notification has been read
      - `read_at` (timestamptz, nullable) - When notification was read
      - `action_url` (text, nullable) - Link to related resource
      - `metadata` (jsonb) - Additional data
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Users can view their own messages and notifications
    - Users can send messages to workspace members
    - System can create notifications
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text,
  body text NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  parent_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('payment', 'maintenance', 'lease', 'message', 'system', 'alert')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_workspace_id ON messages(workspace_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_workspace_id ON notifications(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Messages RLS Policies
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages to workspace members"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "Users can delete their sent messages"
  ON messages FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid());

-- Notifications RLS Policies
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());