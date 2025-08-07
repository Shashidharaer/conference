-- Migration script to add new fields to existing registrations table
-- Run this in your Supabase SQL editor if you have an existing database

-- Add new fields to existing table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS selected_package TEXT,
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS primary_contact TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS preferred_airport TEXT;

-- Update website field to be nullable (was NOT NULL before)
ALTER TABLE registrations ALTER COLUMN website DROP NOT NULL;

-- Add new indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_relationship ON registrations(relationship_with_credentia);
CREATE INDEX IF NOT EXISTS idx_registrations_package ON registrations(selected_package);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;
