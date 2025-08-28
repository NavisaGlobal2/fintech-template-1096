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

  const assignRole = async (targetUserId: string, role: AppRole): Promise<boolean> => {
    if (!hasRole('admin')) {
      toast.error('Only admins can assign roles');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role,
          assigned_by: user?.id
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('User already has this role');
        } else {
          throw error;
        }
        return false;
      }

      toast.success(`Role ${role} assigned successfully`);
      await fetchUserRoles(); // Refresh roles
      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
      return false;
    }
  };

  const removeRole = async (targetUserId: string, role: AppRole): Promise<boolean> => {
    if (!hasRole('admin')) {
      toast.error('Only admins can remove roles');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', role);

      if (error) throw error;

      toast.success(`Role ${role} removed successfully`);
      await fetchUserRoles(); // Refresh roles
      return true;
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Failed to remove role');
      return false;
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  return {
    roles,
    loading,
    hasRole,
    isAuthorizedForUnderwriting,
    assignRole,
    removeRole,
    refreshRoles: fetchUserRoles
  };
};