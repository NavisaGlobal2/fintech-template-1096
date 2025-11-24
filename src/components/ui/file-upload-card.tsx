import React, { useState } from 'react';
import { Upload, X, CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadCardProps {
  id: string;
  label: string;
  hint?: string;
  file?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
  required?: boolean;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  id,
  label,
  hint,
  file,
  onChange,
  error,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onChange(droppedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onChange(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border",
          file ? "bg-secondary/30 border-solid border-sage" : "bg-card hover:bg-muted/30",
          error && "border-destructive",
          "group"
        )}
      >
        <label
          htmlFor={id}
          className="flex items-center justify-center min-h-[140px] cursor-pointer p-6"
        >
          {!file ? (
            <div className="text-center space-y-3">
              <div className={cn(
                "mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center transition-all duration-300",
                "group-hover:bg-sage group-hover:scale-110"
              )}>
                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG, WEBP • Max 5MB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-sage animate-in zoom-in duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-foreground flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(undefined);
                }}
                className="flex-shrink-0 p-2 hover:bg-destructive/10 rounded-full transition-colors group/delete"
              >
                <X className="h-5 w-5 text-muted-foreground group-hover/delete:text-destructive transition-colors" />
              </button>
            </div>
          )}
        </label>
        
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-300">
          {error}
        </p>
      )}
    </div>
  );
};
