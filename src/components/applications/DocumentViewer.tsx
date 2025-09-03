import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useSignedUrl } from '@/hooks/useSignedUrl';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [pdfError, setPdfError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const { signedUrl, loading: urlLoading, error: urlError } = useSignedUrl(document.fileUrl);

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
    if (!signedUrl && !document.fileUrl) {
      toast.error('Document URL not available');
      return;
    }

    setDownloading(true);
    try {
      const urlToUse = signedUrl || document.fileUrl;
      const response = await fetch(urlToUse);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.fileName;
      link.style.display = 'none';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download completed successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const renderDocumentContent = () => {
    if (urlLoading) {
      return (
        <div className="flex justify-center items-center h-[60vh] border rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      );
    }

    if (urlError && !signedUrl) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load document: {urlError}
          </AlertDescription>
        </Alert>
      );
    }

    const fileType = getFileType(document.fileName);
    const urlToUse = signedUrl || document.fileUrl;
    
    if (fileType === 'pdf') {
      return (
        <div className="w-full h-[60vh] border rounded-lg overflow-hidden">
          {!pdfError ? (
            <iframe
              src={`${urlToUse}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full"
              title={document.fileName}
              onError={() => setPdfError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <p className="text-lg font-medium mb-2">PDF preview unavailable</p>
              <p className="text-muted-foreground mb-4">Unable to display this PDF in the browser</p>
              <div className="flex gap-2">
                <Button onClick={handleDownload} disabled={downloading}>
                  {downloading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Download PDF
                </Button>
                <Button variant="outline" asChild>
                  <a href={urlToUse} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Externally
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (fileType === 'image') {
      return (
        <div className="flex justify-center items-center bg-muted/20 rounded-lg p-4">
          {!imageError ? (
            <img
              src={urlToUse}
              alt={document.fileName}
              className="max-w-full max-h-[60vh] object-contain rounded transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[40vh]">
              <AlertCircle className="h-8 w-8 text-destructive mb-4" />
              <p className="text-lg font-medium mb-2">Image preview unavailable</p>
              <p className="text-muted-foreground mb-4">Unable to display this image</p>
              <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Download Image
              </Button>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-muted rounded-lg">
        {getFileIcon(document.fileName)}
        <p className="text-lg font-medium mt-4 mb-2">{document.fileName}</p>
        <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
        <div className="flex gap-2">
          <Button onClick={handleDownload} disabled={downloading} className="flex items-center gap-2">
            {downloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download File
          </Button>
          <Button variant="outline" asChild>
            <a href={urlToUse} target="_blank" rel="noopener noreferrer">
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
              
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
                {downloading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <a href={signedUrl || document.fileUrl} target="_blank" rel="noopener noreferrer">
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