import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Send, 
  Edit, 
  Archive, 
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FullLoanApplication } from '@/types/loanApplication';

interface StatusManagerProps {
  application: FullLoanApplication;
  onStatusChange: (newStatus: string) => void;
  canEdit: boolean;
}

const StatusManager: React.FC<StatusManagerProps> = ({ application, onStatusChange, canEdit }) => {
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showResubmitDialog, setShowResubmitDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateApplicationStatus = async (newStatus: string, updateData?: any) => {
    try {
      setLoading(true);
      
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString(),
        ...updateData
      };

      const { error } = await supabase
        .from('loan_applications')
        .update(updates)
        .eq('id', application.id);

      if (error) throw error;

      // Create status history entry
      await supabase
        .from('application_status_history')
        .insert({
          application_id: application.id,
          user_id: application.userId,
          old_status: application.status,
          new_status: newStatus,
          notes: getStatusChangeNote(application.status, newStatus)
        });

      onStatusChange(newStatus);
      toast.success(`Application ${getStatusActionText(newStatus)} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(`Failed to ${getStatusActionText(newStatus).toLowerCase()} application`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    updateApplicationStatus('submitted', {
      submitted_at: new Date().toISOString(),
      is_draft: false
    });
  };

  const handleWithdraw = () => {
    updateApplicationStatus('withdrawn');
    setShowWithdrawDialog(false);
  };

  const handleResubmit = () => {
    updateApplicationStatus('submitted', {
      submitted_at: new Date().toISOString(),
      is_draft: false
    });
    setShowResubmitDialog(false);
  };

  const getAvailableActions = () => {
    const actions = [];

    if (application.status === 'draft') {
      actions.push({
        key: 'submit',
        label: 'Submit Application',
        icon: <Send className="h-4 w-4" />,
        action: handleSubmit,
        variant: 'default' as const
      });
    }

    if (application.status === 'submitted' || application.status === 'under-review') {
      actions.push({
        key: 'withdraw',
        label: 'Withdraw Application',
        icon: <Archive className="h-4 w-4" />,
        action: () => setShowWithdrawDialog(true),
        variant: 'destructive' as const
      });
    }

    if (application.status === 'rejected') {
      actions.push({
        key: 'resubmit',
        label: 'Resubmit Application',
        icon: <RotateCcw className="h-4 w-4" />,
        action: () => setShowResubmitDialog(true),
        variant: 'default' as const
      });
    }

    return actions;
  };

  const getStatusChangeNote = (oldStatus: string, newStatus: string) => {
    const notes = {
      'draft-submitted': 'Application submitted for review',
      'submitted-withdrawn': 'Application withdrawn by applicant',
      'rejected-submitted': 'Application resubmitted after rejection',
      'withdrawn-submitted': 'Application resubmitted after withdrawal'
    };
    
    return notes[`${oldStatus}-${newStatus}` as keyof typeof notes] || `Status changed from ${oldStatus} to ${newStatus}`;
  };

  const getStatusActionText = (status: string) => {
    const texts = {
      submitted: 'submitted',
      withdrawn: 'withdrawn',
      resubmitted: 'resubmitted'
    };
    
    return texts[status as keyof typeof texts] || 'updated';
  };

  const primaryActions = getAvailableActions().filter(action => 
    ['submit', 'resubmit'].includes(action.key)
  );
  
  const secondaryActions = getAvailableActions().filter(action => 
    !['submit', 'resubmit'].includes(action.key)
  );

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Primary Action Button */}
        {primaryActions.length > 0 && canEdit && (
          <Button
            variant={primaryActions[0].variant}
            onClick={primaryActions[0].action}
            disabled={loading}
          >
            {primaryActions[0].icon}
            <span className="ml-2">{primaryActions[0].label}</span>
          </Button>
        )}

        {/* Secondary Actions Dropdown */}
        {secondaryActions.length > 0 && canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {secondaryActions.map((action, index) => (
                <div key={action.key}>
                  <DropdownMenuItem
                    onClick={action.action}
                    className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </DropdownMenuItem>
                  {index < secondaryActions.length - 1 && <DropdownMenuSeparator />}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Status Indicator for Non-editable States */}
        {!canEdit && (
          <Badge variant="outline" className="flex items-center gap-2">
            {application.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {application.status === 'under-review' && <Clock className="h-4 w-4 text-yellow-500" />}
            {application.status}
          </Badge>
        )}
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this application? This action cannot be undone, 
              but you can resubmit the application later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Withdraw Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resubmit Confirmation Dialog */}
      <AlertDialog open={showResubmitDialog} onOpenChange={setShowResubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resubmit Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resubmit this application? It will be sent for review again 
              with the current information and documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResubmit}>
              Resubmit Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StatusManager;