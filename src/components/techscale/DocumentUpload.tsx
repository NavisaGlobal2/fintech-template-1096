
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

    try {
      // Get user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast.error('Please log in to upload documents');
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('application-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('application-documents')
        .getPublicUrl(fileName);

      // Save document record to database
      const { error: dbError } = await supabase
        .from('application_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'pending'
        });

      if (dbError) throw dbError;

      onUpload(file);
      toast.success('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document. Please try again.');
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
