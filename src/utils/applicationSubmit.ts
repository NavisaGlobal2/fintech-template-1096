import { supabase } from '@/integrations/supabase/client';

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  loanAmount: string;
  loanPurpose: string;
  immigrationStatus: string;
  employmentStatus: string;
  employerName?: string;
  socialProfiles?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  guarantorName: string;
  guarantorEmail: string;
  guarantorPhone: string;
  guarantorEmployment: string;
  consentData: boolean;
  consentGuarantor: boolean;
}

export type PartialApplicationFormData = Partial<ApplicationFormData> & {
  fullName: string;
  email: string;
  phone: string;
  loanAmount: string;
  loanPurpose: string;
  immigrationStatus: string;
  employmentStatus: string;
  guarantorName: string;
  guarantorEmail: string;
  guarantorPhone: string;
  guarantorEmployment: string;
  consentData: boolean;
  consentGuarantor: boolean;
};

export interface DocumentUpload {
  type: string;
  url: string;
  name: string;
  size: number;
}

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

const determineLoanType = (loanAmount: number): string => {
  if (loanAmount <= 1000) return 'career-microloan';
  if (loanAmount <= 2500) return 'career-development';
  return 'study-abroad';
};

export const submitLoanApplication = async (
  formData: ApplicationFormData | PartialApplicationFormData,
  userId: string,
  documents: DocumentUpload[]
) => {
  try {
    const { firstName, lastName } = splitFullName(formData.fullName);
    const loanAmountNumber = parseFloat(formData.loanAmount);

    // Prepare JSONB data structures
    const personalInfo = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
    };

    const financialInfo = {
      loanAmount: loanAmountNumber,
      loanPurpose: formData.loanPurpose,
      employmentStatus: formData.employmentStatus,
      employerName: formData.employerName || null,
    };

    const kycDocuments = {
      immigrationStatus: formData.immigrationStatus,
      documents: documents.map(doc => ({
        type: doc.type,
        url: doc.url,
        name: doc.name,
        uploaded: true,
        verified: false,
      })),
    };

    const declarations = {
      consentData: formData.consentData,
      consentGuarantor: formData.consentGuarantor,
      signatureDate: new Date().toISOString(),
    };

    // Prepare application_data with social profiles
    const applicationData = {
      socialProfiles: formData.socialProfiles || {},
    };

    // Insert loan application
    const { data: application, error: applicationError } = await supabase
      .from('loan_applications')
      .insert({
        user_id: userId,
        personal_info: personalInfo,
        financial_info: financialInfo,
        kyc_documents: kycDocuments,
        declarations,
        application_data: applicationData,
        loan_type_requested: determineLoanType(loanAmountNumber),
        lender_name: 'Pending Match',
        loan_option_id: 'pending-' + Date.now(),
        is_draft: false,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (applicationError) throw applicationError;

    // Insert document records
    if (documents.length > 0) {
      const documentRecords = documents.map(doc => ({
        application_id: application.id,
        user_id: userId,
        document_type: doc.type,
        file_url: doc.url,
        file_name: doc.name,
        file_size: doc.size,
        verification_status: 'pending',
      }));

      const { error: documentsError } = await supabase
        .from('application_documents')
        .insert(documentRecords);

      if (documentsError) throw documentsError;
    }

    // Create notification
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Application Submitted',
      message: `Your loan application for £${loanAmountNumber} has been submitted successfully. Reference: ${application.id.slice(0, 8)}`,
      type: 'application',
      data: { applicationId: application.id },
    });

    // Store guarantor info for later use
    const guarantorData = {
      name: formData.guarantorName,
      email: formData.guarantorEmail,
      phone: formData.guarantorPhone,
      employmentStatus: formData.guarantorEmployment,
    };

    return {
      success: true,
      applicationId: application.id,
      guarantorData,
    };
  } catch (error) {
    console.error('Application submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit application',
    };
  }
};
