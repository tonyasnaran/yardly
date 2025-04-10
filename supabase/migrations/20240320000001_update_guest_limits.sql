-- Update guest limits for existing yards
UPDATE yards 
SET guest_limit = CASE
  WHEN id = 1 THEN 'Up to 10 guests'  -- Beachfront Garden Oasis
  WHEN id = 2 THEN 'Up to 15 guests'  -- Bohemian Backyard
  WHEN id = 3 THEN 'Up to 20 guests'  -- Los Angeles Downtown Rooftop
  WHEN id = 4 THEN 'Up to 10 guests'  -- Ocean View Patio
  WHEN id = 5 THEN 'Up to 15 guests'  -- Santa Monica Garden
  WHEN id = 6 THEN 'Up to 20 guests'  -- Urban Rooftop Garden
END
WHERE id IN (1, 2, 3, 4, 5, 6); 