-- Add user_id column if it doesn't exist
ALTER TABLE IF EXISTS landing_page_content 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing rows with a default user (if any exist)
-- Note: You'll need to replace 'YOUR_DEFAULT_USER_ID' with a valid user ID from auth.users
-- Or handle this through your application logic
-- UPDATE landing_page_content SET user_id = 'YOUR_DEFAULT_USER_ID' WHERE user_id IS NULL;

-- Make user_id required for new inserts
ALTER TABLE landing_page_content ALTER COLUMN user_id SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_content_user_id ON landing_page_content(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_created_at ON landing_page_content(created_at);

-- Update RLS policies to include user_id checks
DROP POLICY IF EXISTS "Authenticated users can insert content" ON landing_page_content;
CREATE POLICY "Authenticated users can insert content" ON landing_page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Add updated_by column if needed
ALTER TABLE landing_page_content 
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
