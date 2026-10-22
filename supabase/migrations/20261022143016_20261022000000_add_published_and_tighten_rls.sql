/*
# Add published column and tighten RLS for teacher/student roles

1. Changes to existing tables
- `custom_problems`: add `published` (boolean, default false) — marks a question as published/visible to students.
  - `author_id` (uuid, nullable, defaults to auth.uid()) — tracks which teacher created the question.

2. Security changes
- Drop the old fully-open anon CRUD policies (they allowed anyone to write/delete).
- SELECT policy: anon + authenticated can read rows WHERE `published = true`.
  Authenticated teachers can additionally read their own authored (unpublished) rows.
- INSERT/UPDATE/DELETE policies: ONLY authenticated users (teachers) may write,
  scoped to their own `author_id`.
- GRANT SELECT to anon (read published) and authenticated (read + write).
- Revoke INSERT/UPDATE/DELETE from anon so unauthenticated visitors cannot write.

3. Important notes
- This is a multi-user model requiring sign-in for teacher actions.
- Students (not signed in) run as `anon` and see only published questions.
- Teachers sign in with email/password; their writes are scoped to author_id = auth.uid().
- The service_role key is never used in the browser.
*/

ALTER TABLE custom_problems
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS author_id uuid DEFAULT auth.uid();

-- Revoke write privileges from anon: students must not insert/update/delete.
REVOKE INSERT, UPDATE, DELETE ON custom_problems FROM anon;
-- Keep SELECT on anon so students can read published rows.
GRANT SELECT ON custom_problems TO anon;
-- Authenticated (teachers) keep full CRUD.
GRANT SELECT, INSERT, UPDATE, DELETE ON custom_problems TO authenticated;

-- Drop old open policies
DROP POLICY IF EXISTS "anon_select_custom_problems" ON custom_problems;
DROP POLICY IF EXISTS "anon_insert_custom_problems" ON custom_problems;
DROP POLICY IF EXISTS "anon_update_custom_problems" ON custom_problems;
DROP POLICY IF EXISTS "anon_delete_custom_problems" ON custom_problems;

-- SELECT: anon sees only published; authenticated teachers see published + their own
CREATE POLICY "read_published_or_own_custom_problems"
ON custom_problems FOR SELECT
TO anon, authenticated
USING (
  published = true
  OR (auth.uid() IS NOT NULL AND auth.uid() = author_id)
);

-- INSERT: only authenticated teachers, author must be themselves
CREATE POLICY "teachers_insert_custom_problems"
ON custom_problems FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- UPDATE: only the owning teacher
CREATE POLICY "teachers_update_custom_problems"
ON custom_problems FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- DELETE: only the owning teacher
CREATE POLICY "teachers_delete_custom_problems"
ON custom_problems FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Backfill author_id for existing rows if any (none expected since table is empty)
UPDATE custom_problems SET author_id = auth.uid() WHERE author_id IS NULL;
