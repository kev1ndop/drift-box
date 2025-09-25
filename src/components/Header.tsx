import React from 'react';
import { Search, Grid3X3, List, Settings, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  fileCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  fileCount
}) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* Center: File count */}
        <div className="hidden md:block text-sm text-muted-foreground">
          {fileCount} archivo{fileCount !== 1 ? 's' : ''}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "h-8 w-8 p-0",
                viewMode === 'grid' 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/50"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={cn(
                "h-8 w-8 p-0",
                viewMode === 'list' 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/50"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="w-4 h-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="gap-2">
                <User className="w-4 h-4" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};