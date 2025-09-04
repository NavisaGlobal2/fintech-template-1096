import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  id?: string;
  email_notifications: boolean;
  in_app_notifications: boolean;
  application_updates: boolean;
  offer_notifications: boolean;
  document_updates: boolean;
  marketing_emails: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification preferences
  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const defaultPrefs: NotificationPreferences = {
          email_notifications: true,
          in_app_notifications: true,
          application_updates: true,
          offer_notifications: true,
          document_updates: true,
          marketing_emails: false
        };
        
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_notification_preferences')
          .insert({ user_id: user.id, ...defaultPrefs })
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  // Update notification preferences
  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .update(newPreferences)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  // Send notification (for internal use)
  const sendNotification = async (type: string, title: string, message: string, data: any = {}) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          userId: user.id,
          type,
          data: { ...data, title, message }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast for new notifications if preferences allow
          if (preferences?.in_app_notifications) {
            toast.info(newNotification.title, {
              description: newNotification.message
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, preferences]);

  // Initial data load
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
    } else {
      setNotifications([]);
      setPreferences(null);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user]);

  return {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    sendNotification,
    refreshNotifications: fetchNotifications
  };
};