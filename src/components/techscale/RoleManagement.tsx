import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUserRoles, AppRole } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, User, UserCog, Trash2 } from 'lucide-react';

interface UserWithRoles {
  id: string;
  email: string;
  roles: AppRole[];
}

const RoleManagement = () => {
  const { hasRole, assignRole, removeRole } = useUserRoles();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('user');

  const fetchUsersWithRoles = async () => {
    try {
      // First get all profiles (which contain user emails)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => {
        const userRolesList = (userRoles || [])
          .filter(role => role.user_id === profile.id)
          .map(role => role.role as AppRole);
        
        return {
          id: profile.id,
          email: profile.email || 'No email',
          roles: userRolesList
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users and roles:', error);
      toast.error('Failed to load user roles');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, role: AppRole) => {
    const success = await assignRole(userId, role);
    if (success) {
      await fetchUsersWithRoles();
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    const success = await removeRole(userId, role);
    if (success) {
      await fetchUsersWithRoles();
    }
  };

  const findUserByEmail = (email: string) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const handleAssignRoleByEmail = async () => {
    if (!newUserEmail || !newUserRole) {
      toast.error('Please enter email and select role');
      return;
    }

    const user = findUserByEmail(newUserEmail);
    if (!user) {
      toast.error('User not found with that email');
      return;
    }

    const success = await assignRole(user.id, newUserRole);
    if (success) {
      setNewUserEmail('');
      setNewUserRole('user');
      await fetchUsersWithRoles();
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3" />;
      case 'underwriter':
        return <UserCog className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  useEffect(() => {
    if (hasRole('admin')) {
      fetchUsersWithRoles();
    } else {
      setLoading(false);
    }
  }, [hasRole]);

  if (!hasRole('admin')) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Access denied. Only administrators can manage user roles.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Loading user roles...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Role to User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUserRole} onValueChange={(value: AppRole) => setNewUserRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="underwriter">Underwriter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAssignRoleByEmail}>
                Assign Role
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Roles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-muted-foreground">No users found</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline">No roles assigned</Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge key={role} variant="outline" className="flex items-center gap-1">
                            {getRoleIcon(role)}
                            {role}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleRemoveRole(user.id, role)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(['user', 'underwriter', 'admin'] as AppRole[]).map((role) => (
                      !user.roles.includes(role) && (
                        <Button
                          key={role}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignRole(user.id, role)}
                          className="flex items-center gap-1"
                        >
                          {getRoleIcon(role)}
                          Add {role}
                        </Button>
                      )
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;