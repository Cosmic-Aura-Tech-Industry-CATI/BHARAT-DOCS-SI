'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">
      {/* Fixed Full-Height Left Sidebar */}
      <Sidebar />

      {/* Main Column: Header + Content alongside the Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-64 transition-all duration-300">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
