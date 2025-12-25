-- Add RLS policies to SSC GD Hindi Mock 1 table
ALTER TABLE "SSC GD Hindi Mock 1" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to SSC GD Hindi Mock 1"
ON "SSC GD Hindi Mock 1"
FOR SELECT
USING (true);

-- Add RLS policies to SSC GD English Mock 1 table
ALTER TABLE "SSC GD English Mock 1" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to SSC GD English Mock 1"
ON "SSC GD English Mock 1"
FOR SELECT
USING (true);