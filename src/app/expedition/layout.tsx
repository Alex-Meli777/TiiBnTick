/**
 * @file app/expedition/layout.tsx
 * @description Nested layout. Do NOT use <html> or <body> here.
 */
import React from 'react';
import NavbarHome from '@/components/NavbarHome';

export default function ExpeditionLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="expedition-workflow-wrapper">
      {/* If you want the Navbar only on expedition pages, put it here */}
      <NavbarHome /> 
      <div className="container mx-auto">
        {children}
      </div>
    </section>
  );
}