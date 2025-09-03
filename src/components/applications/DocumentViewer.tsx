import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  FileIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentViewerProps {
  document: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number;
    uploadedAt: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
  trigger?: React.ReactNode;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const getFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['doc', 'docx'].includes(ext || '')) return 'document';
    return 'file';
  };

  const getFileIcon = (fileName: string) => {
    const type = getFileType(fileName);
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <FileIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderDocumentContent = () => {
    const fileType = getFileType(document.fileName);
    
    if (fileType === 'pdf') {
      return (
        <div className="w-full h-[60vh] border rounded-lg overflow-hidden">
          <iframe
            src={`${document.fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full"
            title={document.fileName}
          />
        </div>
      );
    }
    
    if (fileType === 'image') {
      return (
        <div className="flex justify-center items-center bg-muted/20 rounded-lg p-4">
          <img
            src={document.fileUrl}
            alt={document.fileName}
            className="max-w-full max-h-[60vh] object-contain rounded transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-muted rounded-lg">
        {getFileIcon(document.fileName)}
        <p className="text-lg font-medium mt-4 mb-2">{document.fileName}</p>
        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
        <div className="flex gap-2">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download File
          </Button>
          <Button variant="outline" asChild>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Externally
            </a>
          </Button>
        </div>
      </div>
    );
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(document.fileName)}
              <div>
                <DialogTitle className="text-left">{document.fileName}</DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>Uploaded {formatDate(document.uploadedAt)}</span>
                  {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
                  <Badge 
                    variant={
                      document.verificationStatus === 'verified' ? 'default' : 
                      document.verificationStatus === 'rejected' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {document.verificationStatus}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getFileType(document.fileName) === 'image' && (
                <>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {renderDocumentContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;