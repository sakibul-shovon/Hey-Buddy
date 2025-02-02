import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function UpcomingEvents() {
  const events = [
    {
      title: "Web Dev Hackathon",
      time: "This Saturday at 10:00 AM",
    },
    {
      title: "UI/UX Workshop",
      time: "Next Tuesday at 2:00 PM",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <Button key={event.title} variant="ghost" className="w-full justify-start gap-4">
            <Calendar className="h-4 w-4" />
            <div className="flex-1 text-left">
              <p className="font-medium leading-none">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.time}</p>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}