import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { LoanTypeRequest } from '@/types/loanApplication';
import { useDropzone } from 'react-dropzone';
import DocumentViewer from './DocumentViewer';

interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  fileSize?: number;
}

interface DocumentManagerProps {
  applicationId: string;
  loanType: LoanTypeRequest;
  canEdit: boolean;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ applicationId, loanType, canEdit }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const requiredDocuments = getRequiredDocuments(loanType);

  useEffect(() => {
    fetchDocuments();
  }, [applicationId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      const typedDocuments: Document[] = (data || []).map(doc => ({
        id: doc.id,
        documentType: doc.document_type,
        fileName: doc.file_name,
        fileUrl: doc.file_url,
        verificationStatus: doc.verification_status as any || 'pending',
        uploadedAt: doc.uploaded_at || '',
        fileSize: doc.file_size || undefined
      }));

      setDocuments(typedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[], documentType: string) => {
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('application-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error } = await supabase
        .from('application_documents')
        .insert({
          application_id: applicationId,
          user_id: user?.id,
          document_type: documentType,
          file_name: file.name,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Document uploaded successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('application_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.documentType === type);
  };

  const getVerificationStats = () => {
    const totalRequired = requiredDocuments.length;
    const uploaded = requiredDocuments.filter(type => 
      getDocumentsByType(type.key).length > 0
    ).length;
    const verified = requiredDocuments.filter(type => 
      getDocumentsByType(type.key).some(doc => doc.verificationStatus === 'verified')
    ).length;

    return { totalRequired, uploaded, verified };
  };

  const renderDocumentSection = (docType: { key: string; name: string; description: string; required: boolean }) => {
    const docs = getDocumentsByType(docType.key);
    const hasDoc = docs.length > 0;
    const latestDoc = hasDoc ? docs[0] : null;

    return (
      <Card key={docType.key} className="cosmic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {docType.name}
                {docType.required && <span className="text-red-500">*</span>}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{docType.description}</p>
            </div>
            
            {latestDoc && (
              <Badge 
                variant={
                  latestDoc.verificationStatus === 'verified' ? 'default' : 
                  latestDoc.verificationStatus === 'rejected' ? 'destructive' : 
                  'secondary'
                }
                className="flex items-center gap-1"
              >
                {latestDoc.verificationStatus === 'verified' && <CheckCircle className="h-3 w-3" />}
                {latestDoc.verificationStatus === 'rejected' && <X className="h-3 w-3" />}
                {latestDoc.verificationStatus === 'pending' && <AlertCircle className="h-3 w-3" />}
                {latestDoc.verificationStatus}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasDoc ? (
            <div className="space-y-3">
              {docs.map((doc, index) => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  isLatest={index === 0}
                  onDelete={canEdit ? () => deleteDocument(doc.id) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">No document uploaded</p>
            </div>
          )}

          {canEdit && (
            <DocumentDropzone
              onDrop={(files) => onDrop(files, docType.key)}
              uploading={uploading}
              hasExisting={hasDoc}
            />
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="cosmic-card">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getVerificationStats();

  return (
    <div className="space-y-6">
      {/* Document Overview */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle>Document Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.uploaded}/{stats.totalRequired}</div>
              <div className="text-sm text-muted-foreground">Documents Uploaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.verified}</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.uploaded - stats.verified}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Completion Progress</span>
              <span>{Math.round((stats.uploaded / stats.totalRequired) * 100)}%</span>
            </div>
            <Progress value={(stats.uploaded / stats.totalRequired) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Document Sections */}
      <div className="space-y-4">
        {requiredDocuments.map(renderDocumentSection)}
      </div>
    </div>
  );
};

const DocumentItem: React.FC<{
  document: Document;
  isLatest: boolean;
  onDelete?: () => void;
}> = ({ document, isLatest, onDelete }) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return <FileText className="h-5 w-5 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="h-5 w-5 text-blue-600" />;
    return <FileIcon className="h-5 w-5 text-muted-foreground" />;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(document.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isLatest ? 'border-primary/20 bg-primary/5' : 'border-border'}`}>
      {getFileIcon(document.fileName)}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium truncate">{document.fileName}</p>
          {isLatest && <Badge variant="secondary" className="text-xs">Latest</Badge>}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Uploaded {formatDate(document.uploadedAt)}</span>
          {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DocumentViewer document={document} />
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const DocumentDropzone: React.FC<{
  onDrop: (files: File[]) => void;
  uploading: boolean;
  hasExisting: boolean;
}> = ({ onDrop, uploading, hasExisting }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div
      {...getRootProps()}
      className={`
        mt-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-2">
        {uploading ? (
          <>
            <Upload className="h-8 w-8 animate-pulse text-primary mx-auto" />
            <p className="text-sm text-primary">Uploading...</p>
          </>
        ) : (
          <>
            {hasExisting ? (
              <Plus className="h-8 w-8 text-muted-foreground mx-auto" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
            )}
            <p className="text-sm text-muted-foreground">
              {hasExisting ? 'Upload new version' : 'Drop file here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, JPG, PNG, DOC, DOCX (max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

function getRequiredDocuments(loanType: LoanTypeRequest) {
  const base = [
    { key: 'passport', name: 'Passport/ID', description: 'Government-issued photo identification', required: true },
    { key: 'proofOfResidence', name: 'Proof of Residence', description: 'Utility bill or bank statement', required: true },
    { key: 'bankStatements', name: 'Bank Statements', description: 'Last 3 months of bank statements', required: true },
  ];

  if (loanType === 'study-abroad') {
    return [
      ...base,
      { key: 'transcripts', name: 'Academic Transcripts', description: 'Official academic records', required: true },
      { key: 'acceptanceLetter', name: 'Acceptance Letter', description: 'Letter from educational institution', required: true },
      { key: 'resume', name: 'Resume/CV', description: 'Current resume or curriculum vitae', required: false },
    ];
  }

  if (loanType === 'career-microloan') {
    return [
      ...base,
      { key: 'employmentLetter', name: 'Employment Letter', description: 'Letter from current employer', required: true },
      { key: 'paySlips', name: 'Pay Slips', description: 'Last 3 months of pay slips', required: true },
      { key: 'contractDocument', name: 'Employment Contract', description: 'Current employment contract', required: false },
    ];
  }

  return base;
}

export default DocumentManager;