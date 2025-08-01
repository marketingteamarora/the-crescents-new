-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.save_landing_page_content_api CASCADE;

-- Create a new function with a different name and structure
CREATE OR REPLACE FUNCTION public.save_landing_page_content_api(
  content_data jsonb,
  user_uuid uuid
) 
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  new_content_id uuid;
  result_data jsonb;
BEGIN
  -- First, deactivate all other active content for this user
  UPDATE public.landing_page_content 
  SET is_active = false, 
      updated_at = NOW()
  WHERE user_id = user_uuid 
    AND is_active = true;

  -- Then insert the new content
  INSERT INTO public.landing_page_content (
    content, 
    user_id, 
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    content_data, 
    user_uuid, 
    true,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_content_id;

  -- Return success response
  result_data := jsonb_build_object(
    'success', true,
    'message', 'Content saved successfully via API',
    'content_id', new_content_id,
    'saved_at', NOW()
  );
  
  RETURN result_data;
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Error in save_landing_page_content_api: ' || SQLERRM,
    'error_code', SQLSTATE
  );
END;
$function$;

-- Set function permissions
GRANT EXECUTE ON FUNCTION public.save_landing_page_content_api(jsonb, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.save_landing_page_content_api(jsonb, uuid) FROM anon;

-- Force refresh the API schema
NOTIFY pgrst, 'reload schema';

-- Verify the function was created
SELECT 
  n.nspname as schema,
  p.proname as function_name,
  pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments,
  CASE 
    WHEN has_function_privilege('authenticated', p.oid, 'EXECUTE') THEN 'authenticated'
    WHEN has_function_privilege('anon', p.oid, 'EXECUTE') THEN 'anon'
    ELSE 'restricted'
  END as access_level,
  p.proowner::regrole as function_owner,
  p.prosecdef as security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname LIKE 'save_landing_page%'
AND n.nspname = 'public'
ORDER BY p.proname;
