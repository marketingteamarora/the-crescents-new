-- Enable RLS
ALTER TABLE IF EXISTS landing_page_content ENABLE ROW LEVEL SECURITY;

-- Add user_id column if it doesn't exist
ALTER TABLE IF EXISTS landing_page_content 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add updated_by column if it doesn't exist
ALTER TABLE IF EXISTS landing_page_content 
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Authenticated users can insert content" ON landing_page_content;
CREATE POLICY "Authenticated users can insert content" ON landing_page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Allow users to update their own content
DROP POLICY IF EXISTS "Users can update their own content" ON landing_page_content;
CREATE POLICY "Users can update their own content" ON landing_page_content
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_content_user_id ON landing_page_content(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_created_at ON landing_page_content(created_at);

-- Verify the table structure
COMMENT ON TABLE landing_page_content IS 'Stores the landing page content with user ownership';

-- Output success message
SELECT 'Schema updated successfully' as message;
