-- Create security definer function to check user roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop the problematic admin policy and recreate properly
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create proper policies using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin') 
  OR auth.uid() = user_id
);

CREATE POLICY "Drivers can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'driver') 
  OR auth.uid() = user_id
);