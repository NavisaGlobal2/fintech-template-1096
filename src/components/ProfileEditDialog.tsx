import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' }),
  last_name: z
    .string()
    .trim()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' }),
  phone: z
    .string()
    .trim()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(20, { message: 'Phone number must be less than 20 characters' })
    .regex(/^[0-9+\s()-]+$/, { message: 'Phone number can only contain digits, spaces, +, -, (, and )' })
    .optional()
    .or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  userId: string;
  onProfileUpdated: () => void;
  focusField?: 'first_name' | 'last_name' | 'phone';
}

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  open,
  onOpenChange,
  profile,
  userId,
  onProfileUpdated,
  focusField,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone: profile?.phone || '',
    },
  });

  // Reset form when profile changes or dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
      });

      // Focus the specified field after a short delay
      if (focusField) {
        setTimeout(() => {
          setFocus(focusField);
        }, 100);
      }
    }
  }, [open, profile, reset, focusField, setFocus]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Profile updated successfully! 🎉');
      onProfileUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. All fields are required except phone number.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="first_name"
              {...register('first_name')}
              placeholder="John"
              className={errors.first_name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="last_name"
              {...register('last_name')}
              placeholder="Doe"
              className={errors.last_name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+44 7700 900000"
              className={errors.phone ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +44 for UK)
            </p>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support to update your email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
