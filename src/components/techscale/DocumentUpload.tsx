
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertTriangle, X, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DocumentUploadProps {
  documentType: string;
  acceptedTypes: string[];
  maxSize: number;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  uploadedFile?: {
    name: string;
    url: string;
    verified: boolean;
  } | null;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  acceptedTypes,
  maxSize,
  onUpload,
  isUploading = false,
  uploadedFile
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('Starting file upload:', { fileName: file.name, size: file.size, type: file.type });

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please upload: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setUploadProgress(10);

    try {
      // Import session manager
      const { getOrCreateSessionId, addSessionDocument } = await import('@/utils/sessionManager');
      
      // Get user (if authenticated) or use session ID
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.warn('Auth error, proceeding as anonymous:', authError);
      }
      
      const sessionId = user ? null : getOrCreateSessionId();
      console.log('Upload mode:', user ? 'authenticated' : 'anonymous', { userId: user?.id, sessionId });
      
      setUploadProgress(30);
      
      // Generate consistent filename for both storage and database
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const generatedFileName = `${documentType}_${timestamp}.${fileExt}`;
      const storagePath = user 
        ? `${user.id}/${generatedFileName}`
        : `temp/${sessionId}/${generatedFileName}`;

      console.log('Uploading to path:', storagePath);

      const { data, error } = await supabase.storage
        .from('application-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      setUploadProgress(60);
      console.log('Storage upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('application-documents')
        .getPublicUrl(storagePath);

      console.log('Generated public URL:', urlData.publicUrl);
      
      setUploadProgress(80);

      // Save document record to database
      const documentRecord = {
        user_id: user?.id || null,
        session_id: sessionId,
        document_type: documentType,
        file_name: generatedFileName, // Use consistent filename
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        verification_status: 'pending'
      };

      console.log('Inserting document record:', documentRecord);

      const { error: dbError } = await supabase
        .from('application_documents')
        .insert(documentRecord);

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      console.log('Database insert successful');
      
      setUploadProgress(90);

      // Store in session storage for anonymous users
      if (!user && sessionId) {
        console.log('Storing in session storage for anonymous user');
        addSessionDocument({
          documentType,
          fileName: generatedFileName, // Use consistent filename
          fileUrl: urlData.publicUrl,
          fileSize: file.size,
          mimeType: file.type
        });
      }

      setUploadProgress(100);
      onUpload(file);
      toast.success('Document uploaded successfully!');
      
      setTimeout(() => setUploadProgress(0), 1000);
      
    } catch (error: any) {
      console.error('Upload error details:', error);
      setUploadProgress(0);
      
      // More specific error messages
      if (error.message?.includes('Storage upload failed')) {
        toast.error('Failed to upload file to storage. Please check your connection and try again.');
      } else if (error.message?.includes('Database insert failed')) {
        toast.error('File uploaded but failed to save record. Please contact support.');
      } else if (error.message?.includes('Row Level Security')) {
        toast.error('Permission error. Please sign in or check your account status.');
      } else {
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  }, [documentType, acceptedTypes, maxSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
    disabled: isUploading || !!uploadedFile
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-900">{uploadedFile.name}</div>
                <div className="text-sm text-green-700 flex items-center gap-1">
                  {uploadedFile.verified ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Pending verification
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div>
                <div className="font-medium mb-2">Uploading document...</div>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium mb-1">
                  {isDragActive ? 'Drop the file here' : 'Click to upload or drag and drop'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {acceptedTypes.includes('application/pdf') ? 'PDF, ' : ''}
                  {acceptedTypes.includes('image/jpeg') ? 'JPG, ' : ''}
                  {acceptedTypes.includes('image/png') ? 'PNG' : ''}
                  {' '}(Max {formatFileSize(maxSize)})
                </div>
              </div>
              <Button variant="outline" type="button">
                Select File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
