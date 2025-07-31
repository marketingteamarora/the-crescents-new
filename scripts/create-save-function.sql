-- Create or replace the function to handle saving landing page content
CREATE OR REPLACE FUNCTION save_landing_page_content(
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
      'message', 'Failed to save content',
      'error', SQLERRM
    );
    RETURN result;
  END;
END;
$$;
