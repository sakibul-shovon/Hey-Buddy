import React from 'react';
import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export const DropdownMenu = ({ children, ...props }) => (
  <div className="relative inline-block text-left" {...props}>
    {children}
  </div>
);

export const DropdownMenuTrigger = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("inline-flex justify-center", className)}
    {...props}
  />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      className
    )}
    {...props}
  />
));
DropdownMenuContent.displayName = "DropdownMenuContent";