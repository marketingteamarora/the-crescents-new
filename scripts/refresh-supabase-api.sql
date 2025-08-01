-- Drop the function if it exists to ensure clean recreation
DROP FUNCTION IF EXISTS public.save_landing_page_content;

-- Recreate the function with explicit schema qualification
CREATE OR REPLACE FUNCTION public.save_landing_page_content(
  p_content jsonb,
  p_user_id uuid
) 
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_content_id uuid;
  v_result jsonb;
BEGIN
  -- Deactivate all other active content for this user
  UPDATE public.landing_page_content 
  SET is_active = false, 
      updated_at = NOW()
  WHERE user_id = p_user_id 
    AND is_active = true;

  -- Insert the new content as active
  INSERT INTO public.landing_page_content (
    content, 
    user_id, 
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    p_content, 
    p_user_id, 
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_content_id;

  -- Return success response
  v_result := jsonb_build_object(
    'success', true,
    'message', 'Content saved successfully',
    'content_id', v_content_id
  );
  
  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Error saving content: ' || SQLERRM
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.save_landing_page_content(jsonb, uuid) TO authenticated;

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';

-- Verify the function is accessible
SELECT 
  p.proname as function_name,
  pg_catalog.pg_get_function_arguments(p.oid) as arguments,
  pg_catalog.pg_get_function_result(p.oid) as return_type,
  CASE 
    WHEN p.prosecdef THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END as security_type
FROM pg_catalog.pg_proc p
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE p.proname = 'save_landing_page_content'
  AND n.nspname = 'public';
