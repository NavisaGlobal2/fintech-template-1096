import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bell, Check, CheckCheck, Clock, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
      case 'application_status_change':
        return <FileText className="h-4 w-4" />;
      case 'offer_available':
        return <CreditCard className="h-4 w-4" />;
      case 'document_verified':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'document_rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'offer_available':
        return 'border-l-blue-500';
      case 'document_verified':
        return 'border-l-green-500';
      case 'document_rejected':
        return 'border-l-red-500';
      case 'application_status_change':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading notifications...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center gap-1"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-medium text-muted-foreground mb-2">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive updates about your applications and offers here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  getIcon={getNotificationIcon}
                  getColor={getNotificationColor}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  getIcon: (type: string) => React.ReactNode;
  getColor: (type: string) => string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  getIcon,
  getColor
}) => {
  return (
    <>
      <div 
        className={`p-4 rounded-lg border-l-4 ${getColor(notification.type)} ${
          !notification.read ? 'bg-muted/50' : 'bg-background'
        } cursor-pointer hover:bg-muted/30 transition-colors`}
        onClick={onMarkAsRead}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-1 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            {notification.data?.applicationId && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  App ID: {notification.data.applicationId}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
};