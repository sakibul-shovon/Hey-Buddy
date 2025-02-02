import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-sm leading-loose text-center text-muted-foreground md:text-left">
            Built with love for developers and designers.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="https://github.com" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Link>
          <Link to="https://twitter.com" target="_blank" rel="noreferrer">
            <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
      </div>
    </footer>
  );
}