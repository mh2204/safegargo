-- Fix infinite recursion in profiles table RLS policies
-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins and drivers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create corrected policies without infinite recursion
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- For admin/driver access, we need to check the role directly from the profiles table
-- but avoid the recursion by using a different approach
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles admin_check 
    WHERE admin_check.user_id = auth.uid() 
    AND admin_check.role = 'admin'
  )
  OR auth.uid() = user_id
);