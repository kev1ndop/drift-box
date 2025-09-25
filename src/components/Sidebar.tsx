import React from 'react';
import { 
  Cloud, 
  FolderOpen, 
  Star, 
  Trash2, 
  Clock, 
  Share2, 
  Tag,
  HardDrive 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { FileItem } from '@/pages/Index';

interface SidebarProps {
  files: FileItem[];
  totalSize: number;
  usedStorage: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ files, totalSize, usedStorage }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const menuItems = [
    { 
      icon: FolderOpen, 
      label: 'Todos los archivos', 
      count: files.length, 
      active: true 
    },
    { 
      icon: Star, 
      label: 'Favoritos', 
      count: 0 
    },
    { 
      icon: Clock, 
      label: 'Recientes', 
      count: files.filter(f => {
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return f.uploadedAt > dayAgo;
      }).length 
    },
    { 
      icon: Share2, 
      label: 'Compartidos', 
      count: 0 
    },
    { 
      icon: Trash2, 
      label: 'Papelera', 
      count: 0 
    }
  ];

  const fileTypes = [
    { 
      icon: '📷', 
      label: 'Imágenes', 
      count: files.filter(f => f.type.startsWith('image/')).length 
    },
    { 
      icon: '📄', 
      label: 'Documentos', 
      count: files.filter(f => 
        f.type.includes('pdf') || 
        f.type.includes('document') || 
        f.type.includes('text')
      ).length 
    },
    { 
      icon: '🎵', 
      label: 'Audio', 
      count: files.filter(f => f.type.startsWith('audio/')).length 
    },
    { 
      icon: '🎬', 
      label: 'Videos', 
      count: files.filter(f => f.type.startsWith('video/')).length 
    }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg text-foreground">
            Mi Drive
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  item.active && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count > 0 && (
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border mt-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
            TIPOS DE ARCHIVO
          </h3>
          <div className="space-y-1">
            {fileTypes.map((type) => (
              <Button
                key={type.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-9 text-sm"
              >
                <span className="text-base">{type.icon}</span>
                <span className="flex-1 text-left">{type.label}</span>
                {type.count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {type.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Storage Info */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Almacenamiento
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(totalSize)} usados</span>
              <span>5 GB</span>
            </div>
            <Progress 
              value={usedStorage} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              {(100 - usedStorage).toFixed(1)}% disponible
            </p>
          </div>

          <Button size="sm" className="w-full mt-2 bg-gradient-primary hover:opacity-90">
            Aumentar almacenamiento
          </Button>
        </div>
      </div>
    </aside>
  );
};