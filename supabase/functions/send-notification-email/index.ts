import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  userId: string;
  type: 'application_submitted' | 'application_status_change' | 'offer_available' | 'document_verified' | 'document_rejected' | 'sponsor_matched' | 'application_processing' | 'auto_assessed' | 'offer_generated';
  data: {
    applicationId?: string;
    newStatus?: string;
    offerId?: string;
    documentType?: string;
    lenderName?: string;
    sponsorName?: string;
    matchScore?: number;
    loanType?: string;
    expectedProcessingTime?: string;
    expectedReviewTime?: string;
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
      (type === 'application_processing' && preferences.application_updates) ||
      (type === 'sponsor_matched' && preferences.application_updates) ||
      (type === 'auto_assessed' && preferences.application_updates) ||
      (type === 'offer_available' && preferences.offer_notifications) ||
      (type === 'offer_generated' && preferences.offer_notifications) ||
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

    // Initialize Resend with API key
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'TechScale <noreply@techscale.com>',
      to: [profile.email],
      subject: emailContent.subject,
      html: emailContent.text.replace(/\n/g, '<br>'),
    });

    if (emailResponse.error) {
      console.error('Error sending email:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    // Create notification record for in-app notifications
    await supabase.from('notifications').insert({
      user_id: userId,
      type: type,
      title: emailContent.subject,
      message: emailContent.text,
      data: data
    });

    console.log(`Email sent successfully to ${profile.email}:`, {
      emailId: emailResponse.data?.id,
      subject: emailContent.subject
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

    case 'sponsor_matched':
      return {
        subject: '🤝 You\'ve Been Matched with a Sponsor - TechScale',
        text: `Hi ${firstName},

Excellent news! We've automatically matched you with a sponsor who aligns with your goals.

Sponsor Details:
- Sponsor: ${data.sponsorName}
- Match Score: ${data.matchScore}% compatibility
- Reason: ${data.reason}

What Happens Next:
1. Your sponsor will review your application within ${data.expectedReviewTime || '3-5 business days'}
2. You'll receive updates as they review your profile
3. If approved, you'll be contacted directly to discuss funding details

You can track your application status at: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'application_processing':
      return {
        subject: '⚡ Your Application is Being Processed - TechScale',
        text: `Hi ${firstName},

Your ${data.loanType === 'study-abroad' ? 'Study Abroad Loan' : 'Career Microloan'} application is now being processed automatically.

What's Happening:
- Our AI-powered underwriting system is assessing your application
- Expected processing time: ${data.expectedProcessingTime || '24-48 hours'}
- You'll be notified immediately when assessment is complete

Next Steps:
${data.nextSteps || 'Sit tight! We\'ll email you as soon as we have results.'}

Track your application: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'auto_assessed':
      return {
        subject: '✅ Your Application Has Been Assessed - TechScale',
        text: `Hi ${firstName},

Great news! Your application has been automatically assessed.

Assessment Results:
- Risk Score: ${data.riskScore || 'Calculated'}
- Decision: ${data.decision || 'Processed'}
- ${data.decision === 'approved' ? 'Congratulations! You\'re approved for financing.' : 'Your application needs manual review.'}

${data.decision === 'approved' ? 
  'A loan offer will be generated for you within the next few hours.' :
  'Our underwriting team will review your application manually and get back to you within 2-3 business days.'}

View details: ${baseUrl}/my-applications

Best regards,
The TechScale Team`
      };

    case 'offer_generated':
      return {
        subject: '🎉 Your Loan Offer is Ready - TechScale',
        text: `Hi ${firstName},

Fantastic news! Based on your application, we've generated a personalized loan offer for you.

Offer Summary:
- Loan Amount: ${data.loanAmount}
- Interest Rate: ${data.aprRate || data.interestRate}%
- Repayment Term: ${data.repaymentTerm}
- Monthly Payment: ${data.monthlyPayment || 'See dashboard'}

This offer is time-sensitive and expires on: ${data.validUntil}

⚠️ Don't wait - Review and accept your offer now!

View and accept offer: ${baseUrl}/my-applications

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