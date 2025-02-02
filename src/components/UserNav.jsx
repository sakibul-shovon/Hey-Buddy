import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './DropdownMenu';
import { Button } from './Button';
import { Avatar } from './Avatar';

export const UserNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar 
            src="/placeholder-user.jpg" 
            alt="@username"
            fallback="UN"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">username</p>
          <p className="text-xs text-gray-500">user@example.com</p>
        </div>
        <hr className="my-2" />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem>
        <hr className="my-2" />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
