-- Create initial admin user for the existing user
INSERT INTO public.user_roles (user_id, role, assigned_by) 
VALUES ('283adf4d-765a-4b6a-968b-0c5d9e7d344f', 'admin', '283adf4d-765a-4b6a-968b-0c5d9e7d344f')
ON CONFLICT (user_id, role) DO NOTHING;