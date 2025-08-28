-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'underwriter', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any admin/underwriter role
CREATE OR REPLACE FUNCTION public.is_authorized_for_underwriting(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'underwriter')
  )
$$;

-- Drop existing permissive policy
DROP POLICY IF EXISTS "Authenticated users can view underwriting rules" ON public.underwriting_rules;

-- Create restrictive policy for underwriting rules
CREATE POLICY "Only authorized staff can view underwriting rules"
ON public.underwriting_rules
FOR SELECT
TO authenticated
USING (public.is_authorized_for_underwriting(auth.uid()));

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create initial admin user (you'll need to update this with your actual user ID)
-- This is commented out - you'll need to run this manually with your user ID
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id-here', 'admin');