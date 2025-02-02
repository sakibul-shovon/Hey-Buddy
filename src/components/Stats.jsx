import React from 'react';
export function Stats() {
    return (
      <section id="community" className="container py-24">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
            <div className="text-4xl font-bold text-primary">50K+</div>
            <p className="mt-2 text-sm text-muted-foreground">Active Members</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
            <div className="text-4xl font-bold text-primary">1000+</div>
            <p className="mt-2 text-sm text-muted-foreground">Projects Created</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
            <div className="text-4xl font-bold text-primary">75%</div>
            <p className="mt-2 text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-background p-8">
            <div className="text-4xl font-bold text-primary">24/7</div>
            <p className="mt-2 text-sm text-muted-foreground">Community Support</p>
          </div>
        </div>
      </section>
    );
  }