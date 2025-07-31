-- Create the landing_page_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.landing_page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create or replace the function to handle saving landing page content
CREATE OR REPLACE FUNCTION public.save_landing_page_content(
  p_content jsonb,
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_content_id uuid;
  result jsonb;
BEGIN
  -- Begin transaction
  BEGIN
    -- First, deactivate all existing active content for this user
    UPDATE landing_page_content 
    SET is_active = false, 
        updated_at = NOW(),
        updated_by = p_user_id
    WHERE user_id = p_user_id 
    AND is_active = true;
    
    -- Insert new content
    INSERT INTO landing_page_content (
      content,
      is_active,
      user_id,
      created_at,
      updated_at,
      updated_by
    ) VALUES (
      p_content,
      true,
      p_user_id,
      NOW(),
      NOW(),
      p_user_id
    )
    RETURNING id INTO new_content_id;
    
    -- Return success with the new content ID
    result := jsonb_build_object(
      'success', true,
      'message', 'Content saved successfully',
      'content_id', new_content_id
    );
    
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'message', 'Error saving content: ' || SQLERRM
    );
    RETURN result;
  END;
END;
$$;

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

-- Allow users to select their own content
DROP POLICY IF EXISTS "Users can select their own content" ON landing_page_content;
CREATE POLICY "Users can select their own content" ON landing_page_content
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_page_content_user_id ON landing_page_content(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_page_content_created_at ON landing_page_content(created_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.save_landing_page_content TO authenticated, service_role;

-- Output success message
SELECT 'Database setup completed successfully' as message;
