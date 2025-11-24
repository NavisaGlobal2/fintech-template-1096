import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCompletionChecklistProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  hasApplications: boolean;
  onEditProfile?: () => void;
  onCreateApplication?: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  isComplete: boolean;
  icon: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ProfileCompletionChecklist: React.FC<ProfileCompletionChecklistProps> = ({
  profile,
  hasApplications,
  onEditProfile,
  onCreateApplication,
}) => {
  const checklistItems: ChecklistItem[] = [
    {
      id: 'name',
      label: 'Add your full name',
      isComplete: !!(profile?.first_name && profile?.last_name),
      icon: User,
      action: onEditProfile ? { label: 'Add Name', onClick: onEditProfile } : undefined,
    },
    {
      id: 'email',
      label: 'Verify your email',
      isComplete: !!profile?.email,
      icon: Mail,
    },
    {
      id: 'phone',
      label: 'Add phone number',
      isComplete: !!profile?.phone,
      icon: Phone,
      action: onEditProfile ? { label: 'Add Phone', onClick: onEditProfile } : undefined,
    },
    {
      id: 'application',
      label: 'Submit your first application',
      isComplete: hasApplications,
      icon: FileText,
      action: onCreateApplication && !hasApplications
        ? { label: 'Apply Now', onClick: onCreateApplication }
        : undefined,
    },
  ];

  const completedItems = checklistItems.filter(item => item.isComplete).length;
  const totalItems = checklistItems.length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const isFullyComplete = completionPercentage === 100;

  return (
    <Card className={cn(
      "border-2 transition-all duration-300",
      isFullyComplete ? "border-green-500/50 bg-green-500/5" : "border-primary/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {isFullyComplete ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Profile Complete!
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Complete Your Profile
                </>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {isFullyComplete
                ? 'Your profile is fully set up'
                : `${completedItems} of ${totalItems} steps completed`}
            </CardDescription>
          </div>
          <Badge variant={isFullyComplete ? "default" : "secondary"} className="shrink-0">
            {completionPercentage}%
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Progress 
            value={completionPercentage} 
            className={cn(
              "h-2",
              isFullyComplete && "bg-green-500/20"
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {checklistItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                item.isComplete
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-muted/50 border border-border hover:bg-muted"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {item.isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={cn(
                    "h-4 w-4",
                    item.isComplete ? "text-green-500" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    item.isComplete ? "text-green-500 line-through" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>

                {!item.isComplete && item.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={item.action.onClick}
                    className="h-7 text-xs"
                  >
                    {item.action.label}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {isFullyComplete && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
              🎉 Great job! Your profile is complete and ready for loan applications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionChecklist;
