-- Create registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  relationship_with_credentia TEXT NOT NULL,
  selected_package TEXT,
  organization_name TEXT NOT NULL,
  website TEXT,
  address JSONB NOT NULL,
  phone JSONB NOT NULL,
  alternate_phone JSONB,
  -- Sponsor/Vendor specific fields
  company_description TEXT,
  primary_contact TEXT,
  contact_email TEXT,
  -- Client specific fields
  dietary_restrictions TEXT[] DEFAULT '{}',
  ada_requirements TEXT[] DEFAULT '{}',
  travel_sponsorship TEXT[] DEFAULT '{}',
  preferred_airport TEXT,
  consents_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add row level security (optional but recommended)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for registration)
CREATE POLICY "Allow registration inserts" ON registrations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads for authenticated users (for admin)
CREATE POLICY "Allow read for authenticated users" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add indexes for better performance
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_organization ON registrations(organization_name);
CREATE INDEX idx_registrations_relationship ON registrations(relationship_with_credentia);
CREATE INDEX idx_registrations_package ON registrations(selected_package);
