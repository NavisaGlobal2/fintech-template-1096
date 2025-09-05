import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Clock,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ManualContractUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (uploadData: {
    fileUrl: string;
    fileName: string;
    notes: string;
    uploadedAt: string;
  }) => void;
  contractId: string;
  contractType: string;
}

interface UploadedFile {
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
}

const ManualContractUpload: React.FC<ManualContractUploadProps> = ({
  isOpen,
  onClose,
  onComplete,
  contractId,
  contractType
}) => {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'application/pdf',
    'image/jpeg', 
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, Word document, or image files only.');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile({
      file,
      url,
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, Word document, or image files only.');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error('File size too large. Maximum size is 10MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedFile({
      file,
      url,
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (type.startsWith('image/')) return <File className="h-8 w-8 text-blue-500" />;
    if (type.includes('word')) return <FileText className="h-8 w-8 text-blue-600" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const uploadFileToSupabase = async (): Promise<string> => {
    if (!uploadedFile || !user) throw new Error('No file or user');

    const fileName = `contracts/${contractId}/manual-upload-${Date.now()}-${uploadedFile.file.name}`;
    
    const { data, error } = await supabase.storage
      .from('application-documents')
      .upload(fileName, uploadedFile.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('application-documents')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!notes.trim()) {
      toast.error('Please provide notes about this manually signed contract');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file to Supabase Storage
      const fileUrl = await uploadFileToSupabase();
      
      setUploadProgress(100);
      clearInterval(progressInterval);

      // Update contract with manual upload information
      const { error: contractError } = await supabase
        .from('loan_contracts')
        .update({
          status: 'manually_signed',
          contract_pdf_url: fileUrl,
          signed_at: new Date().toISOString(),
          contract_data: {
            ...{}, // Existing contract data
            manualUpload: {
              uploadedBy: user?.id,
              uploadedAt: new Date().toISOString(),
              fileName: uploadedFile.name,
              fileSize: uploadedFile.size,
              notes: notes.trim(),
              originalFileType: uploadedFile.type
            }
          }
        })
        .eq('id', contractId);

      if (contractError) throw contractError;

      // Create audit record
      const { error: auditError } = await supabase
        .from('contract_signatures')
        .insert({
          contract_id: contractId,
          signer_id: user.id,
          signer_type: 'borrower',
          signer_name: user.email || 'Unknown',
          signer_email: user.email || '',
          status: 'manually_signed',
          signed_at: new Date().toISOString(),
          signature_data: `manual_upload:${fileUrl}`,
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent
        });

      if (auditError) {
        console.warn('Failed to create audit record:', auditError);
        // Don't fail the entire operation for audit record
      }

      const uploadData = {
        fileUrl,
        fileName: uploadedFile.name,
        notes: notes.trim(),
        uploadedAt: new Date().toISOString()
      };

      onComplete(uploadData);
      toast.success('Contract uploaded successfully!');
      
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Signed Contract
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Information Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Manual Contract Upload</p>
                <p>
                  Use this option if you have signed the contract outside the application. 
                  Upload the signed document and provide details about the signing process.
                </p>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract Type:</span>
                <Badge variant="outline">{contractType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contract ID:</span>
                <span className="font-mono text-sm">{contractId.slice(0, 8)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Upload Date:</span>
                <span className="text-sm">{new Date().toLocaleDateString('en-GB')}</span>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Signed Document</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop your file here, or click to browse</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supported formats: PDF, Word documents, Images (JPG, PNG)
                  </p>
                  <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(uploadedFile.type)}
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {uploading && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Notes */}
          {uploadedFile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Provide details about the signing process *
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Contract was printed, signed by borrower and guarantor in person on [date], witnessed by [name], then scanned and uploaded."
                    rows={4}
                    disabled={uploading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include details about when, where, and how the contract was signed, 
                    and any witnesses present.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            
            <Button 
              onClick={handleUpload} 
              disabled={!uploadedFile || !notes.trim() || uploading}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualContractUpload;