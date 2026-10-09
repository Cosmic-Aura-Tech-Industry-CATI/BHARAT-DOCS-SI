'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';
import {
  Home,
  Upload,
  FileText,
  CheckSquare,
  Search,
  LayoutGrid,
  BarChart2,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Upload Documents',
      href: '/documents/upload',
      icon: Upload,
    },
    {
      title: 'Document Library',
      href: '/documents',
      icon: FileText,
    },
    {
      title: 'Review & Verify',
      href: '/queue',
      icon: CheckSquare,
      badge: '12',
    },
    {
      title: 'Search & Query',
      href: '/query',
      icon: Search,
    },
    {
      title: 'Templates',
      href: '/templates',
      icon: LayoutGrid,
    },
    {
      title: 'Reports',
      href: '/exports',
      icon: BarChart2,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      title: 'Help & Support',
      href: '/audit-logs',
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Left Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#13191D] text-slate-300 w-64 select-none border-r border-[#1e2a33] transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1c252d]">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 group"
          >
            {/* Custom Folded-Sheet Glyph */}
            <div className="h-7 w-6 rounded-[2px] border-2 border-white flex flex-col justify-center items-center gap-[2.5px] p-[2px] relative overflow-hidden transition-transform group-hover:scale-105">
              <div className="w-full h-[1.5px] bg-white rounded-full" />
              <div className="w-full h-[1.5px] bg-white rounded-full" />
              <div className="w-2/3 self-start h-[1.5px] bg-white rounded-full" />
            </div>

            <div>
              <div className="text-base font-bold tracking-tight text-white font-serif leading-none">
                Bharat<span className="text-[#B85D36]">Doc</span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">
                AI DOCUMENT INTELLIGENCE
              </div>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C252D] transition cursor-pointer"
            title="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Options List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            let isActive = false;

            if (item.href === '/dashboard') {
              isActive = pathname === '/dashboard' || pathname === '/';
            } else if (item.href === '/documents') {
              isActive = pathname === '/documents' && !pathname.includes('/upload') && !pathname.includes('/review');
            } else if (item.href === '/queue') {
              isActive = pathname === '/queue' || pathname.includes('/review');
            } else {
              isActive = pathname.startsWith(item.href);
            }

            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-[#281B15] border border-[#9C4B27]/40 text-white font-semibold shadow-inner'
                    : 'text-slate-300 hover:bg-[#1C252D] hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform group-hover:scale-105',
                    isActive ? 'text-[#D48666]' : 'text-slate-400'
                  )}
                />
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[#9C4B27] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Indic Monument Architectural Line-Art & Tagline (from Screenshot) */}
        <div className="p-5 border-t border-[#1c252d]/80 text-center">
          <div className="w-full flex justify-center mb-3 opacity-35 text-[#D48666]">
            <svg
              className="w-32 h-14"
              viewBox="0 0 120 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Pillars */}
              <line x1="20" y1="50" x2="20" y2="15" />
              <line x1="100" y1="50" x2="100" y2="15" />
              {/* Inner Arch Pillars */}
              <line x1="45" y1="50" x2="45" y2="25" />
              <line x1="75" y1="50" x2="75" y2="25" />
              {/* Center Arch */}
              <path d="M45 25 C45 15, 75 15, 75 25" />
              {/* Cornice Lines */}
              <line x1="10" y1="15" x2="110" y2="15" />
              <rect x="25" y="6" width="70" height="9" />
              <line x1="15" y1="6" x2="105" y2="6" />
              {/* Chhatri / Top Dome */}
              <path d="M50 6 C50 0, 70 0, 70 6" />
            </svg>
          </div>

          <p className="text-[11px] text-slate-400 leading-snug font-serif italic">
            Make Indian Documents
            <br />
            Work for You.
          </p>

          <div className="mt-2.5 mx-auto w-8 h-[2px] bg-[#9C4B27] rounded-full" />
        </div>
      </aside>
    </>
  );
}
