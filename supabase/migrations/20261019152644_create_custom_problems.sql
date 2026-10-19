/*
# Create custom_problems table (single-tenant, no auth)

1. New Tables
- `custom_problems`: stores user-created math problems as full JSONB ProblemModel objects.
  - `id` (text, primary key) — the problem ID from the frontend.
  - `problem_data` (jsonb, not null) — the complete ProblemModel object.
  - `title` (text) — denormalized for quick listing/filtering.
  - `category` (text) — denormalized for filtering.
  - `created_at` (timestamptz) — when the problem was saved.

2. Security
- Enable RLS on `custom_problems`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in).
*/

CREATE TABLE IF NOT EXISTS custom_problems (
  id text PRIMARY KEY,
  problem_data jsonb NOT NULL,
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_custom_problems" ON custom_problems;
CREATE POLICY "anon_select_custom_problems"
ON custom_problems FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_custom_problems" ON custom_problems;
CREATE POLICY "anon_insert_custom_problems"
ON custom_problems FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_custom_problems" ON custom_problems;
CREATE POLICY "anon_update_custom_problems"
ON custom_problems FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_custom_problems" ON custom_problems;
CREATE POLICY "anon_delete_custom_problems"
ON custom_problems FOR DELETE
TO anon, authenticated USING (true);
