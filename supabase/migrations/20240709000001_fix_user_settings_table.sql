-- Check if user_settings table exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    -- Create user_settings table
    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      hospital_name TEXT DEFAULT 'City Hospital',
      notifications_enabled BOOLEAN DEFAULT TRUE,
      auto_logout BOOLEAN DEFAULT TRUE,
      dark_mode BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id)
    );

    -- Enable row level security
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Users can view their own settings"
      ON user_settings FOR SELECT
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can update their own settings"
      ON user_settings FOR UPDATE
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own settings"
      ON user_settings FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Check if table is already in realtime publication
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'user_settings'
    ) THEN
      -- Enable realtime
      ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;
    END IF;
  END IF;
END
$$;
