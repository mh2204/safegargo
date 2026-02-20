-- Create a function to help admins create driver accounts
CREATE OR REPLACE FUNCTION public.create_driver_profile(
  _email text,
  _password text,
  _full_name text,
  _phone text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- This function is for admin use only - we'll check this in the frontend
  -- Create the auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    _email,
    crypt(_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    json_build_object(
      'full_name', _full_name,
      'phone', _phone
    ),
    '{}'
  )
  RETURNING id INTO new_user_id;

  -- Create the profile with driver role
  INSERT INTO public.profiles (user_id, full_name, phone, role)
  VALUES (new_user_id, _full_name, _phone, 'driver');

  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'Driver account created successfully'
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;