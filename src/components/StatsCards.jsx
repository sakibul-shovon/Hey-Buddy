import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { FolderKanban, Users, MessageSquare } from 'lucide-react';

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 projects this month</p>
        </CardContent>
      </Card>
      {/* Other stat cards... */}
    </div>
  );
}