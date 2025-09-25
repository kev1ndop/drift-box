import React from 'react';
import { MoreVertical, Download, Trash2, Share2, Eye, FileText, Image, Music, Video, Archive, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileItem } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileListProps {
  files: FileItem[];
  onFileDelete: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileDelete }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    
    if (type.startsWith('image/')) return <Image className={cn(iconClass, "text-green-500")} />;
    if (type.startsWith('video/')) return <Video className={cn(iconClass, "text-red-500")} />;
    if (type.startsWith('audio/')) return <Music className={cn(iconClass, "text-purple-500")} />;
    if (type.includes('pdf')) return <FileText className={cn(iconClass, "text-red-600")} />;
    if (type.includes('zip') || type.includes('compressed')) return <Archive className={cn(iconClass, "text-orange-500")} />;
    if (type.includes('spreadsheet')) return <FileText className={cn(iconClass, "text-green-600")} />;
    if (type.includes('presentation')) return <FileText className={cn(iconClass, "text-orange-600")} />;
    if (type.includes('document')) return <FileText className={cn(iconClass, "text-blue-600")} />;
    
    return <File className={cn(iconClass, "text-muted-foreground")} />;
  };

  const handleDownload = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Descarga iniciada');
    } else {
      toast.error('Archivo no disponible para descarga');
    }
  };

  const handleShare = (file: FileItem) => {
    if (navigator.share) {
      navigator.share({
        title: file.name,
        url: file.url || '#'
      });
    } else {
      navigator.clipboard.writeText(file.url || '');
      toast.success('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-5">Nombre</div>
        <div className="col-span-2">Tamaño</div>
        <div className="col-span-3">Fecha</div>
        <div className="col-span-2">Acciones</div>
      </div>

      {/* File Rows */}
      <div className="divide-y divide-border">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors duration-150 group"
          >
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {file.type.split('/')[0]}
                </p>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
            </div>
            
            <div className="col-span-3 flex items-center">
              <span className="text-sm text-muted-foreground">
                {formatDate(file.uploadedAt)}
              </span>
            </div>
            
            <div className="col-span-2 flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleDownload(file)} className="gap-2">
                    <Download className="h-4 w-4" />
                    Descargar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare(file)} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Compartir
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Eye className="h-4 w-4" />
                    Vista previa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onFileDelete(file.id)} 
                    className="gap-2 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};