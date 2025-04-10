-- Add guest_limit column if it doesn't exist
ALTER TABLE yards ADD COLUMN IF NOT EXISTS guest_limit text;

-- Enable Row Level Security
ALTER TABLE yards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all access for authenticated users" ON yards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow read-only access for anonymous users
CREATE POLICY "Enable read-only access for anonymous users" ON yards
  FOR SELECT
  TO anon
  USING (true); 