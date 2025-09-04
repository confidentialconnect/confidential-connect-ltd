-- Fix the infinite recursion in profiles RLS policy
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile and admins can view all" ON public.profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id 
  OR 
  (auth.jwt() ->> 'is_admin')::boolean = true
);