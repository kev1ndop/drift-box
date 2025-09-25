import React, { useState } from 'react';
import { MoreVertical, Download, Trash2, Eye, Share2, FileText, Image, Music, Video, Archive, File } from 'lucide-react';
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

interface FileCardProps {
  file: FileItem;
  onDelete: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      year: 'numeric'
    }).format(date);
  };

  const getFileIcon = (type: string) => {
    const iconClass = "w-12 h-12";
    
    if (type.startsWith('image/')) {
      return <Image className={cn(iconClass, "text-green-500")} />;
    }
    if (type.startsWith('video/')) {
      return <Video className={cn(iconClass, "text-red-500")} />;
    }
    if (type.startsWith('audio/')) {
      return <Music className={cn(iconClass, "text-purple-500")} />;
    }
    if (type.includes('pdf')) {
      return <FileText className={cn(iconClass, "text-red-600")} />;
    }
    if (type.includes('zip') || type.includes('rar') || type.includes('compressed')) {
      return <Archive className={cn(iconClass, "text-orange-500")} />;
    }
    if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileText className={cn(iconClass, "text-green-600")} />;
    }
    if (type.includes('presentation') || type.includes('powerpoint')) {
      return <FileText className={cn(iconClass, "text-orange-600")} />;
    }
    if (type.includes('document') || type.includes('word')) {
      return <FileText className={cn(iconClass, "text-blue-600")} />;
    }
    
    return <File className={cn(iconClass, "text-muted-foreground")} />;
  };

  const handleDownload = () => {
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

  const handleShare = () => {
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

  const handleDelete = () => {
    onDelete(file.id);
    toast.success('Archivo eliminado');
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-xl p-4 transition-all duration-200 cursor-pointer",
        "border border-border hover:border-primary/20",
        "hover:shadow-file hover:-translate-y-1",
        "bg-gradient-surface"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview/Icon */}
      <div className="flex flex-col items-center mb-3">
        {file.type.startsWith('image/') && file.url ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={file.url} 
              alt={file.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = getFileIcon(file.type).props.children;
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="text-center space-y-1">
        <h3 className="font-medium text-sm text-foreground truncate" title={file.name}>
          {file.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(file.uploadedAt)}
        </p>
      </div>

      {/* Actions Menu */}
      <div className={cn(
        "absolute top-2 right-2 opacity-0 transition-opacity duration-200",
        (isHovered || 'ontouchstart' in window) && "opacity-100"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-background/80 hover:bg-background border border-border"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Eye className="h-4 w-4" />
              Vista previa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};