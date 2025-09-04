import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type AppRole = 'admin' | 'underwriter' | 'user';

export interface UserRole {
  id: string;
  role: AppRole;
  assigned_at: string;
  assigned_by?: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.some(userRole => userRole.role === role);
  };

  const isAuthorizedForUnderwriting = (): boolean => {
    return hasRole('admin') || hasRole('underwriter');
  };

  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  return {
    roles,
    loading,
    hasRole,
    isAuthorizedForUnderwriting
  };
};