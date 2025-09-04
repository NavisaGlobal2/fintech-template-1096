import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  userId: string;
  type: 'application_submitted' | 'application_status_change' | 'offer_available' | 'document_verified' | 'document_rejected';
  data: Record<string, any>;
}

export const sendNotification = async ({ userId, type, data }: NotificationData) => {
  try {
    const { error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        userId,
        type,
        data
      }
    });

    if (error) {
      console.error('Failed to send notification:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};

// Helper functions for common notification types
export const notifyApplicationSubmitted = (userId: string, applicationId: string, lenderName?: string, loanAmount?: string) => {
  return sendNotification({
    userId,
    type: 'application_submitted',
    data: {
      applicationId,
      lenderName: lenderName || 'TechScale Partner',
      loanAmount: loanAmount || 'N/A'
    }
  });
};

export const notifyApplicationStatusChange = (userId: string, applicationId: string, newStatus: string, notes?: string) => {
  return sendNotification({
    userId,
    type: 'application_status_change',
    data: {
      applicationId,
      newStatus,
      notes
    }
  });
};

export const notifyOfferAvailable = (userId: string, offerId: string, loanAmount: string, interestRate?: string, repaymentTerm?: string, validUntil?: string) => {
  return sendNotification({
    userId,
    type: 'offer_available',
    data: {
      offerId,
      loanAmount,
      interestRate,
      repaymentTerm,
      validUntil
    }
  });
};

export const notifyDocumentVerified = (userId: string, documentType: string, applicationId?: string) => {
  return sendNotification({
    userId,
    type: 'document_verified',
    data: {
      documentType,
      applicationId
    }
  });
};

export const notifyDocumentRejected = (userId: string, documentType: string, rejectionReason?: string, applicationId?: string) => {
  return sendNotification({
    userId,
    type: 'document_rejected',
    data: {
      documentType,
      rejectionReason,
      applicationId
    }
  });
};