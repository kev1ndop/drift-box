import React from 'react';
import { FileCard } from './FileCard';
import { FileList } from './FileList';
import { FileItem } from '@/pages/Index';

interface FileGridProps {
  files: FileItem[];
  viewMode: 'grid' | 'list';
  onFileDelete: (fileId: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, viewMode, onFileDelete }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-medium text-foreground mb-2">
          No tienes archivos aún
        </h3>
        <p className="text-muted-foreground">
          Sube tu primer archivo usando el área de arriba
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return <FileList files={files} onFileDelete={onFileDelete} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onDelete={onFileDelete}
        />
      ))}
    </div>
  );
};