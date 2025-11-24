import { supabase } from '@/integrations/supabase/client';

export interface UploadedDocument {
  type: string;
  url: string;
  name: string;
  size: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PDF and image files (JPG, PNG, WEBP) are allowed',
    };
  }

  return { valid: true };
};

export const uploadDocument = async (
  file: File,
  userId: string,
  documentType: string
): Promise<{ success: boolean; data?: UploadedDocument; error?: string }> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${documentType}_${timestamp}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('application-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('application-documents')
      .getPublicUrl(fileName);

    return {
      success: true,
      data: {
        type: documentType,
        url: publicUrl,
        name: file.name,
        size: file.size,
      },
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload document',
    };
  }
};

export const uploadMultipleDocuments = async (
  files: { file: File; type: string }[],
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; documents?: UploadedDocument[]; error?: string }> => {
  try {
    const uploadedDocuments: UploadedDocument[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const { file, type } = files[i];
      const result = await uploadDocument(file, userId, type);

      if (!result.success) {
        throw new Error(result.error || `Failed to upload ${file.name}`);
      }

      if (result.data) {
        uploadedDocuments.push(result.data);
      }

      // Update progress
      if (onProgress) {
        onProgress(((i + 1) / totalFiles) * 100);
      }
    }

    return {
      success: true,
      documents: uploadedDocuments,
    };
  } catch (error) {
    console.error('Multiple documents upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload documents',
    };
  }
};
