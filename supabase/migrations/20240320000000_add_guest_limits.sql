-- Add guest_limit column to yards table
ALTER TABLE yards ADD COLUMN IF NOT EXISTS guest_limit TEXT;

-- Create an enum type for guest limits
DO $$ BEGIN
    CREATE TYPE guest_limit_type AS ENUM (
        'Up to 10 guests',
        'Up to 15 guests',
        'Up to 20 guests',
        'Up to 25 guests'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add constraint to ensure guest_limit matches the enum
ALTER TABLE yards 
    ADD CONSTRAINT check_guest_limit 
    CHECK (guest_limit IN (
        'Up to 10 guests',
        'Up to 15 guests',
        'Up to 20 guests',
        'Up to 25 guests'
    ));

-- Update existing yards with a default guest limit
UPDATE yards 
SET guest_limit = 'Up to 15 guests'
WHERE guest_limit IS NULL;

-- Create a function to add the guest_limit column if it doesn't exist
CREATE OR REPLACE FUNCTION add_guest_limit_column()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'yards' 
        AND column_name = 'guest_limit'
    ) THEN
        ALTER TABLE yards ADD COLUMN guest_limit TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql; 