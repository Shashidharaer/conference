-- Enhanced Security for Conference Registration System
-- Run these commands in your Supabase SQL Editor

-- 1. Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Allow registration inserts" ON registrations;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON registrations;
DROP POLICY IF EXISTS "Restrict registration reads" ON registrations;

-- Allow anonymous users to insert registrations (for public form)
CREATE POLICY "Enable registration submissions" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Restrict reads to authenticated users only (admin dashboard)
CREATE POLICY "Admin read access only" ON registrations
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

-- 2. Create admin access logging table
CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  action TEXT,
  success BOOLEAN DEFAULT false,
  details JSONB
);

-- Enable RLS on admin logs
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert logs
CREATE POLICY "Enable admin log inserts" ON admin_access_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read logs
CREATE POLICY "Enable admin log reads" ON admin_access_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Create function to log admin access attempts
CREATE OR REPLACE FUNCTION log_admin_access(
  action_type TEXT,
  success_flag BOOLEAN DEFAULT true,
  additional_details JSONB DEFAULT '{}'::jsonb
) RETURNS void AS $$
BEGIN
  INSERT INTO admin_access_logs (action, success, details)
  VALUES (action_type, success_flag, additional_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_organization ON registrations(organization_name);
CREATE INDEX IF NOT EXISTS idx_registrations_relationship ON registrations(relationship_with_credentia);
CREATE INDEX IF NOT EXISTS idx_admin_logs_time ON admin_access_logs(access_time DESC);

-- 5. Add data retention policy (optional - keeps logs for 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_admin_logs() RETURNS void AS $$
BEGIN
  DELETE FROM admin_access_logs
  WHERE access_time < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 6. Create view for admin dashboard (hides sensitive internal data)
CREATE OR REPLACE VIEW admin_registrations_view AS
SELECT
  id,
  relationship_with_credentia,
  selected_package,
  organization_name,
  website,
  address,
  phone,
  alternate_phone,
  -- Sponsor/Vendor specific fields
  company_description,
  primary_contact,
  contact_email,
  -- Client specific fields
  dietary_restrictions,
  ada_requirements,
  travel_sponsorship,
  preferred_airport,
  consents_accepted,
  created_at
FROM registrations
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON admin_registrations_view TO authenticated;

-- 7. Verify security setup
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('registrations', 'admin_access_logs')
ORDER BY tablename, policyname;
