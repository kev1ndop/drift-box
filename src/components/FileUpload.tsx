import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, Music, Video, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
      toast.success(`${acceptedFiles.length} archivo(s) subido(s) exitosamente`);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles.map(file => 
        file.errors.map(error => error.message).join(', ')
      );
      toast.error(`Error: ${errors.join('; ')}`);
      setIsDragActive(false);
    }
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-accent" />;
    if (type.startsWith('video/')) return <Video className="w-8 h-8 text-accent" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8 text-accent" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) {
      return <Archive className="w-8 h-8 text-accent" />;
    }
    return <FileText className="w-8 h-8 text-accent" />;
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group",
        "hover:border-primary hover:bg-gradient-surface",
        isDragActive 
          ? "border-primary bg-primary/5 shadow-upload scale-[1.02]" 
          : "border-border bg-gradient-surface"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "relative p-6 rounded-full transition-all duration-300",
          "bg-primary/10 group-hover:bg-primary/20",
          isDragActive && "bg-primary/20 scale-110"
        )}>
          <Upload className={cn(
            "w-12 h-12 transition-colors duration-300",
            isDragActive ? "text-primary animate-bounce" : "text-primary"
          )} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragActive ? '¡Suelta tus archivos aquí!' : 'Arrastra y suelta tus archivos'}
          </h3>
          <p className="text-muted-foreground">
            o haz clic para seleccionar archivos
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            {getFileIcon('image/')}
            <span>Imágenes</span>
          </div>
          <div className="flex items-center gap-2">
            {getFileIcon('application/pdf')}
            <span>Documentos</span>
          </div>
          <div className="flex items-center gap-2">
            {getFileIcon('video/')}
            <span>Videos</span>
          </div>
          <div className="flex items-center gap-2">
            {getFileIcon('audio/')}
            <span>Audio</span>
          </div>
        </div>
        
        <Button 
          type="button"
          variant="outline"
          className="mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          Seleccionar archivos
        </Button>
      </div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </div>
  );
};