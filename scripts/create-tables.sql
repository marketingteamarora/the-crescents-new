-- Enable RLS
ALTER TABLE IF EXISTS landing_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS landing_page_templates ENABLE ROW LEVEL SECURITY;

-- Create landing_page_content table
CREATE TABLE IF NOT EXISTS landing_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create landing_page_templates table
CREATE TABLE IF NOT EXISTS landing_page_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('landing-page-images', 'landing-page-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for landing_page_content
DROP POLICY IF EXISTS "Users can view active content" ON landing_page_content;
DROP POLICY IF EXISTS "Authenticated users can insert content" ON landing_page_content;
DROP POLICY IF EXISTS "Users can update their own content" ON landing_page_content;
DROP POLICY IF EXISTS "Users can delete their own content" ON landing_page_content;

-- Allow anyone to read active content (for public viewing)
CREATE POLICY "Anyone can view active content" ON landing_page_content
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert content
CREATE POLICY "Authenticated users can insert content" ON landing_page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update any content (for admin purposes)
CREATE POLICY "Authenticated users can update content" ON landing_page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow users to delete their own content
CREATE POLICY "Users can delete their own content" ON landing_page_content
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for landing_page_templates
DROP POLICY IF EXISTS "Users can view public templates and their own" ON landing_page_templates;
DROP POLICY IF EXISTS "Authenticated users can insert templates" ON landing_page_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON landing_page_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON landing_page_templates;

-- Allow users to view public templates and their own
CREATE POLICY "Users can view public templates and their own" ON landing_page_templates
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Allow authenticated users to insert templates
CREATE POLICY "Authenticated users can insert templates" ON landing_page_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own templates
CREATE POLICY "Users can update their own templates" ON landing_page_templates
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own templates
CREATE POLICY "Users can delete their own templates" ON landing_page_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Allow anyone to view images
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'landing-page-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'landing-page-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'landing-page-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (bucket_id = 'landing-page-images' AND auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_content_active ON landing_page_content(is_active, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_user ON landing_page_content(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_templates_public ON landing_page_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_landing_page_templates_user ON landing_page_templates(user_id);
