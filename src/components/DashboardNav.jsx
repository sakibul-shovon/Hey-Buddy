import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  Calendar,
  Trophy,
  HelpCircle,
  Settings,
} from 'lucide-react';

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // ... rest of the items array
];

export function DashboardNav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col w-64 border-r bg-background">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-xl font-bold text-transparent">
            Hey Buddy
          </span>
        </Link>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              location.pathname === item.href ? "bg-accent" : "transparent",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
}