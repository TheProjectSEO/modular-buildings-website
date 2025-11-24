-- Migration: Create Audit Logs Table
-- Description: Track all content changes in the CMS admin panel
-- Schema: Modular-buildings.co

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Modular-buildings.co".audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL, -- 'page', 'faq', 'structured_data', 'content_section', 'media', 'redirect', etc.
  entity_id UUID,
  entity_title TEXT,
  changes JSONB, -- Store what changed (old values, new values)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON "Modular-buildings.co".audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON "Modular-buildings.co".audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON "Modular-buildings.co".audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON "Modular-buildings.co".audit_logs(action);

-- Enable Row Level Security
ALTER TABLE "Modular-buildings.co".audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can view audit logs" ON "Modular-buildings.co".audit_logs;
DROP POLICY IF EXISTS "Authenticated users can create audit logs" ON "Modular-buildings.co".audit_logs;

-- Policy for admins to view all audit logs
CREATE POLICY "Admins can view audit logs" ON "Modular-buildings.co".audit_logs
  FOR SELECT USING (true);

-- Policy for authenticated users to insert audit logs
CREATE POLICY "Authenticated users can create audit logs" ON "Modular-buildings.co".audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add comment to the table
COMMENT ON TABLE "Modular-buildings.co".audit_logs IS 'Tracks all content changes made through the CMS admin panel';
COMMENT ON COLUMN "Modular-buildings.co".audit_logs.action IS 'The type of action: create, update, or delete';
COMMENT ON COLUMN "Modular-buildings.co".audit_logs.entity_type IS 'The type of entity: page, faq, structured_data, content_section, media, redirect, etc.';
COMMENT ON COLUMN "Modular-buildings.co".audit_logs.changes IS 'JSON object containing old and new values for the changed fields';
