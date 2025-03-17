-- This migration fixes the error with profiles already being a member of supabase_realtime
-- Instead of trying to add it again, we'll just make sure other tables are added

-- Add other tables to realtime that might not be there yet
alter publication supabase_realtime add table beds;
alter publication supabase_realtime add table patients;
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table users;
