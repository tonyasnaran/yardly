-- Create the yards table if it doesn't exist
CREATE TABLE IF NOT EXISTS yards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    amenities TEXT[] NOT NULL,
    city TEXT NOT NULL,
    rating DECIMAL(2,1),
    reviews INTEGER,
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    guest_limit TEXT CHECK (guest_limit IN (
        'Up to 10 guests',
        'Up to 15 guests',
        'Up to 20 guests',
        'Up to 25 guests'
    ))
);

-- Create an index on the created_at column for faster sorting
CREATE INDEX IF NOT EXISTS yards_created_at_idx ON yards(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_yards_updated_at
    BEFORE UPDATE ON yards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 