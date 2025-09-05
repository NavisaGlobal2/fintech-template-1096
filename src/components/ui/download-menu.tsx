import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Image, FileText, Printer } from 'lucide-react';

interface DownloadMenuProps {
  onDownload: (format: 'png' | 'jpg' | 'pdf' | 'docx') => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({
  onDownload,
  disabled = false,
  loading = false
}) => {
  const getIcon = (format: string) => {
    switch (format) {
      case 'png':
      case 'jpg':
        return <Image className="h-4 w-4" />;
      case 'pdf':
        return <Printer className="h-4 w-4" />;
      case 'docx':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={disabled || loading}
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Download'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => onDownload('png')}
          className="cursor-pointer"
        >
          <Image className="h-4 w-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">PNG Image</div>
            <div className="text-xs text-muted-foreground">High-quality image (recommended)</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onDownload('jpg')}
          className="cursor-pointer"
        >
          <Image className="h-4 w-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">JPG Image</div>
            <div className="text-xs text-muted-foreground">Compressed image format</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDownload('pdf')}
          className="cursor-pointer"
        >
          <Printer className="h-4 w-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">Print to PDF</div>
            <div className="text-xs text-muted-foreground">Use browser's print function</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onDownload('docx')}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-3" />
          <div className="flex-1">
            <div className="font-medium">Word Document</div>
            <div className="text-xs text-muted-foreground">Editable document format</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};