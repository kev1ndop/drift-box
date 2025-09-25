import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FileGrid } from '@/components/FileGrid';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url?: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Presentación Marketing.pdf',
      size: 2485760,
      type: 'application/pdf',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: '2', 
      name: 'Logo-Empresa.png',
      size: 156780,
      type: 'image/png',
      uploadedAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      name: 'Informe-Ventas-Q1.xlsx',
      size: 445230,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedAt: new Date('2024-01-12'),
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      url: URL.createObjectURL(file)
    }));
    
    setFiles(prev => [...fileItems, ...prev]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const usedStorage = ((totalSize / (5 * 1024 * 1024 * 1024)) * 100).toFixed(1); // 5GB limit

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        files={files} 
        totalSize={totalSize}
        usedStorage={Number(usedStorage)}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          fileCount={filteredFiles.length}
        />
        
        <main className="flex-1 p-6">
          <FileUpload onFileUpload={handleFileUpload} />
          
          <div className="mt-8">
            <FileGrid 
              files={filteredFiles}
              viewMode={viewMode}
              onFileDelete={handleFileDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;