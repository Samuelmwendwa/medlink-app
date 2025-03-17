-- Add admin policies to allow administrators to view and manage all profiles
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
CREATE POLICY "Administrators can view all profiles"
ON profiles FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'Administrator'
  )
);

DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;
CREATE POLICY "Administrators can update all profiles"
ON profiles FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'Administrator'
  )
);

-- Create demo users if they don't exist
DO $$
BEGIN
  -- Only run if the users don't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@hospital.org') THEN
    -- This is just a placeholder as we can't directly insert into auth.users
    -- The actual user creation should be done through the API or edge function
    RAISE NOTICE 'Demo users need to be created through the API';
  END IF;
END
$$;
