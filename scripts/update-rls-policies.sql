-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active content" ON landing_page_content;
DROP POLICY IF EXISTS "Authenticated users can insert content" ON landing_page_content;
DROP POLICY IF EXISTS "Authenticated users can update content" ON landing_page_content;
DROP POLICY IF EXISTS "Users can update their own content" ON landing_page_content;
DROP POLICY IF EXISTS "Users can delete their own content" ON landing_page_content;

-- Allow anyone to view active content (for public viewing)
CREATE POLICY "Anyone can view active content" ON landing_page_content
  FOR SELECT USING (is_active = true);

-- Allow users to insert their own content
CREATE POLICY "Users can insert their own content" ON landing_page_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own content
CREATE POLICY "Users can update their own content" ON landing_page_content
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own content
CREATE POLICY "Users can delete their own content" ON landing_page_content
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_content_user_id ON landing_page_content(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_is_active ON landing_page_content(is_active);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_created_at ON landing_page_content(created_at);
