import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { Search } from '../components/Search';
//  import { UserNav } from '../components/UserNav';
import { UserNav } from '../components/UserNav';
import { ModeToggle } from '../components/ModeToggle';
import { Bell, MessageSquare } from 'lucide-react';
// import { Button } from '../components/ui/Button';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <Search />
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    </div>
  );
}