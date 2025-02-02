import React from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from './Input';

export function Search() {
  return (
    <div className="flex-1 max-w-xl">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects, people, or teams..." className="pl-8" />
      </div>
    </div>
  );
}