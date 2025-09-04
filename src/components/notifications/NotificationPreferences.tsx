import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Smartphone, FileText, CreditCard, Shield, Settings } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationPreferences: React.FC = () => {
  const { preferences, updatePreferences, loading } = useNotifications();

  if (loading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading preferences...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to receive notifications about your applications and offers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            General Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.email_notifications}
                onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="in-app-notifications" className="font-medium">
                    In-App Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications while using the platform
                  </p>
                </div>
              </div>
              <Switch
                id="in-app-notifications"
                checked={preferences.in_app_notifications}
                onCheckedChange={(checked) => handleToggle('in_app_notifications', checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Specific Notifications */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Notification Types</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="application-updates" className="font-medium">
                    Application Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Status changes, approvals, and rejections
                  </p>
                </div>
              </div>
              <Switch
                id="application-updates"
                checked={preferences.application_updates}
                onCheckedChange={(checked) => handleToggle('application_updates', checked)}
                disabled={!preferences.email_notifications && !preferences.in_app_notifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="offer-notifications" className="font-medium">
                    Loan Offers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    New loan offers and offer updates
                  </p>
                </div>
              </div>
              <Switch
                id="offer-notifications"
                checked={preferences.offer_notifications}
                onCheckedChange={(checked) => handleToggle('offer_notifications', checked)}
                disabled={!preferences.email_notifications && !preferences.in_app_notifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label htmlFor="document-updates" className="font-medium">
                    Document Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Document verification status and requirements
                  </p>
                </div>
              </div>
              <Switch
                id="document-updates"
                checked={preferences.document_updates}
                onCheckedChange={(checked) => handleToggle('document_updates', checked)}
                disabled={!preferences.email_notifications && !preferences.in_app_notifications}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Marketing */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Marketing & Updates</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="marketing-emails" className="font-medium">
                  Marketing Emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Product updates, tips, and promotional content
                </p>
              </div>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => handleToggle('marketing_emails', checked)}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Critical security and account notifications cannot be disabled 
            and will always be sent via email for your account safety.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};