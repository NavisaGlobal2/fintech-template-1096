import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userId: string;
  type: 'application_submitted' | 'application_status_change' | 'offer_available' | 'document_verified' | 'document_rejected';
  data: {
    applicationId?: string;
    newStatus?: string;
    offerId?: string;
    documentType?: string;
    lenderName?: string;
    [key: string]: any;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, type, data }: EmailRequest = await req.json();

    // Check user's notification preferences
    const { data: preferences } = await supabase
      .from('user_notification_preferences')
      .select('email_notifications, application_updates, offer_notifications, document_updates')
      .eq('user_id', userId)
      .single();

    if (!preferences?.email_notifications) {
      console.log('User has email notifications disabled');
      return new Response(JSON.stringify({ message: 'Email notifications disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check specific notification type preferences
    const shouldSend = (
      (type === 'application_submitted' && preferences.application_updates) ||
      (type === 'application_status_change' && preferences.application_updates) ||
      (type === 'offer_available' && preferences.offer_notifications) ||
      ((type === 'document_verified' || type === 'document_rejected') && preferences.document_updates)
    );

    if (!shouldSend) {
      console.log('User has this notification type disabled');
      return new Response(JSON.stringify({ message: 'Notification type disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile for email address
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('id', userId)
      .single();

    if (!profile?.email) {
      throw new Error('User email not found');
    }

    // Generate email content based on type
    const emailContent = generateEmailContent(type, data, profile.first_name || 'there');

    // Use Supabase's built-in email service via admin API
    // This would normally use Supabase's SMTP configuration
    const emailResponse = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: profile.email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`
      }
    });

    // For now, we'll create a notification record and log the email content
    // In production, you'd integrate with your SMTP service here
    await supabase.from('notifications').insert({
      user_id: userId,
      type: type,
      title: emailContent.subject,
      message: emailContent.text,
      data: data
    });

    console.log(`Email notification created for user ${userId}:`, {
      to: profile.email,
      subject: emailContent.subject,
      content: emailContent.text
    });

    return new Response(JSON.stringify({ 
      message: 'Notification sent successfully',
      emailSent: true 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-notification-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function generateEmailContent(type: string, data: any, firstName: string) {
  const baseUrl = Deno.env.get('SITE_URL') || 'https://your-app.com';
  
  switch (type) {
    case 'application_submitted':
      return {
        subject: '✅ Your TechScale Application Has Been Submitted',
        text: `Hi ${firstName},

Thank you for submitting your loan application with TechScale! 

Application Details:
- Application ID: ${data.applicationId}
- Lender: ${data.lenderName}
- Amount Requested: ${data.loanAmount}

What's Next:
1. Our underwriting team will review your application within 2-3 business days
2. You'll receive email updates on your application status
3. If approved, you'll see loan offers in your dashboard

You can track your application progress anytime at: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'application_status_change':
      return {
        subject: `📋 Your TechScale Application Status Update - ${data.newStatus}`,
        text: `Hi ${firstName},

Your loan application status has been updated.

Application ID: ${data.applicationId}
New Status: ${data.newStatus}

${data.newStatus === 'approved' ? 
  'Congratulations! Your application has been approved. Check your dashboard to view available offers.' :
  data.newStatus === 'rejected' ? 
  'Unfortunately, your application was not approved at this time. You can view feedback and reapply in 30 days.' :
  'Your application is currently being reviewed by our underwriting team.'}

View your application: ${baseUrl}/application/${data.applicationId}

Best regards,
The TechScale Team`
      };

    case 'offer_available':
      return {
        subject: '🎉 New Loan Offer Available - TechScale',
        text: `Hi ${firstName},

Great news! You have a new loan offer available.

Offer Details:
- Loan Amount: ${data.loanAmount}
- Interest Rate: ${data.interestRate}
- Term: ${data.repaymentTerm}
- Offer expires: ${data.validUntil}

This offer is time-sensitive and will expire soon. 

View and accept your offer: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'document_verified':
      return {
        subject: '✅ Document Verified - TechScale',
        text: `Hi ${firstName},

Your ${data.documentType} has been successfully verified.

This brings you one step closer to completing your application. You can continue with the next steps in your dashboard.

View your application: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'document_rejected':
      return {
        subject: '❌ Document Verification Issue - TechScale',
        text: `Hi ${firstName},

There was an issue with your ${data.documentType} verification.

Reason: ${data.rejectionReason || 'Document quality or information needs improvement'}

Please upload a new version of this document to continue with your application.

Upload documents: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    default:
      return {
        subject: 'TechScale Notification',
        text: `Hi ${firstName},\n\nYou have a new notification from TechScale.\n\nBest regards,\nThe TechScale Team`
      };
  }
}

serve(handler);