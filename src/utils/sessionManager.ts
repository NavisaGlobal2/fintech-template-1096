// Session management utilities for anonymous document uploads

export interface TempDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface SessionDocuments {
  sessionId: string;
  documents: TempDocument[];
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'loan_app_session';
const DOCUMENTS_STORAGE_KEY = 'loan_app_documents';

// Generate or retrieve session ID for anonymous users
export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  
  return sessionId;
};

// Get all documents for current session
export const getSessionDocuments = (): TempDocument[] => {
  const sessionId = getOrCreateSessionId();
  const stored = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  
  if (!stored) return [];
  
  try {
    const sessionDocs: SessionDocuments = JSON.parse(stored);
    return sessionDocs.sessionId === sessionId ? sessionDocs.documents : [];
  } catch {
    return [];
  }
};

// Add document to session storage
export const addSessionDocument = (document: Omit<TempDocument, 'id' | 'uploadedAt'>): void => {
  const sessionId = getOrCreateSessionId();
  const existingDocs = getSessionDocuments();
  
  const newDocument: TempDocument = {
    ...document,
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    uploadedAt: new Date().toISOString()
  };
  
  const updatedDocs = existingDocs.filter(doc => doc.documentType !== document.documentType);
  updatedDocs.push(newDocument);
  
  const sessionDocs: SessionDocuments = {
    sessionId,
    documents: updatedDocs,
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(sessionDocs));
};

// Get document by type for current session
export const getSessionDocumentByType = (documentType: string): TempDocument | null => {
  const documents = getSessionDocuments();
  return documents.find(doc => doc.documentType === documentType) || null;
};

// Clear session data (called after account creation)
export const clearSessionData = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(DOCUMENTS_STORAGE_KEY);
};

// Transfer documents from session to user account
export const transferSessionDocumentsToUser = async (userId: string): Promise<void> => {
  const sessionId = getOrCreateSessionId();
  const documents = getSessionDocuments();
  
  console.log('Transferring documents to user:', { userId, sessionId, documentCount: documents.length });
  
  if (documents.length === 0) return;
  
  // Import supabase client
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    // Move each document from temp to user folder
    for (const doc of documents) {
      console.log('Processing document:', doc);
      
      // Download file from temp location using the correct filename
      const tempPath = `temp/${sessionId}/${doc.fileName}`;
      console.log('Downloading from temp path:', tempPath);
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('application-documents')
        .download(tempPath);
        
      if (downloadError) {
        console.error('Failed to download temp file:', { tempPath, error: downloadError });
        continue;
      }
      
      // Upload to user folder with same filename structure
      const newPath = `${userId}/${doc.fileName}`;
      console.log('Uploading to user path:', newPath);
      
      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(newPath, fileData, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Failed to upload to user folder:', { newPath, error: uploadError });
        continue;
      }
      
      // Get new public URL
      const { data: urlData } = supabase.storage
        .from('application-documents')
        .getPublicUrl(newPath);
      
      console.log('Updating database record for document:', doc.documentType);
      
      // Update database record
      const { error: updateError } = await supabase
        .from('application_documents')
        .update({
          user_id: userId,
          file_url: urlData.publicUrl,
          session_id: null
        })
        .eq('session_id', sessionId)
        .eq('document_type', doc.documentType);
        
      if (updateError) {
        console.error('Failed to update database record:', updateError);
        continue;
      }
      
      // Delete temp file
      const { error: deleteError } = await supabase.storage
        .from('application-documents')
        .remove([tempPath]);
        
      if (deleteError) {
        console.error('Failed to delete temp file:', deleteError);
        // Don't continue on delete error as it's not critical
      }
      
      console.log('Successfully transferred document:', doc.documentType);
    }
    
    // Clear session data after successful transfer
    console.log('Clearing session data');
    clearSessionData();
    
  } catch (error) {
    console.error('Error transferring documents:', error);
    throw error;
  }
};