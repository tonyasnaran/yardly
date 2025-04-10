-- Add created_by column to yards table
ALTER TABLE yards
ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Add created_by to existing yards (optional, set to NULL for existing records)
UPDATE yards
SET created_by = NULL
WHERE created_by IS NULL;

-- Make created_by required for new records
ALTER TABLE yards
ALTER COLUMN created_by SET NOT NULL; 