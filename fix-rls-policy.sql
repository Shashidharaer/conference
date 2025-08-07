-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Allow registration inserts" ON registrations;

-- Create a new policy that allows anonymous inserts for registration
CREATE POLICY "Enable insert for anonymous users" ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert (optional)
CREATE POLICY "Enable insert for authenticated users" ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
