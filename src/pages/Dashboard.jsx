import React from 'react';
import { StatsCards } from '../components/StatsCards';
import { UpcomingEvents } from '../components/UpcomingEvents';
// import { RecentAchievements } from '../components/RecentAchievements';


export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's what's happening in your Hey Buddy network
        </p>
      </div>
      <StatsCards />
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingEvents />
        <RecentAchievements />
      </div>
    </div>
  );
}