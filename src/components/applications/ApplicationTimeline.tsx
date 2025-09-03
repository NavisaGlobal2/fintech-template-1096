import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText,
  Send,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TimelineItem {
  id: string;
  applicationId: string;
  oldStatus: string | null;
  newStatus: string;
  notes: string | null;
  createdAt: string;
  changedBy: string | null;
}

interface ApplicationTimelineProps {
  applicationId: string;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ applicationId }) => {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchTimeline();
    }
  }, [applicationId]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const typedTimeline: TimelineItem[] = (data || []).map(item => ({
        id: item.id,
        applicationId: item.application_id || '',
        oldStatus: item.old_status,
        newStatus: item.new_status,
        notes: item.notes,
        createdAt: item.created_at || '',
        changedBy: item.changed_by
      }));

      setTimeline(typedTimeline);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      toast.error('Failed to load application timeline');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'pending':
      case 'submitted':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'under-review':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft Created';
      case 'pending':
        return 'Pending Review';
      case 'submitted':
        return 'Application Submitted';
      case 'under-review':
        return 'Under Review';
      case 'approved':
        return 'Application Approved';
      case 'rejected':
        return 'Application Rejected';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'pending':
      case 'submitted':
        return 'default';
      case 'under-review':
        return 'warning' as any;
      case 'approved':
        return 'success' as any;
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No timeline events recorded yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Application Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              {/* Timeline Icon */}
              <div className="relative">
                <div className="flex items-center justify-center w-8 h-8 bg-background border-2 border-border rounded-full">
                  {getStatusIcon(item.newStatus)}
                </div>
                {index < timeline.length - 1 && (
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-px h-6 bg-border"></div>
                )}
              </div>

              {/* Timeline Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium">{getStatusText(item.newStatus)}</h3>
                  <Badge variant={getStatusVariant(item.newStatus)} className="text-xs">
                    {item.newStatus}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDate(item.createdAt)}
                </p>

                {item.oldStatus && (
                  <p className="text-xs text-muted-foreground">
                    Changed from: {getStatusText(item.oldStatus)}
                  </p>
                )}

                {item.notes && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm">{item.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationTimeline;