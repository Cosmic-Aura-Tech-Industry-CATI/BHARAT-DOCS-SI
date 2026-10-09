'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, Menu, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';

export function Header() {
  const router = useRouter();
  const { toggleSidebar } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/query?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E8E4DA] bg-[#F7F5F0]/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left / Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden text-slate-600 hover:text-slate-900"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, invoices, Form-16, bank statements..."
            className="w-full h-9 pl-9 pr-16 rounded-xl border border-[#E2DDD3] bg-white text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded pointer-events-none select-none">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </form>
      </div>

      {/* Right side: Notifications + User Profile */}
      <div className="flex items-center gap-4">
        {/* Bell Notification */}
        <button
          onClick={() =>
            toast.info('Compliance Notification', {
              description: 'GSTR-1 filing due in 2 days. 11 invoices require human review.',
            })
          }
          className="relative rounded-full p-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#F7F5F0]" />
        </button>

        {/* User Profile Card */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-200/40 transition cursor-pointer"
          >
            {/* Avatar Circle SD */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#523B33] text-xs font-bold text-white shadow-xs">
              SD
            </div>

            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900">Shikhar Dixit</div>
              <div className="text-[10px] text-slate-500">DIMISI Technologies</div>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-[#E8E4DA] bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <div className="text-xs font-bold text-slate-900">Shikhar Dixit</div>
                <div className="text-[11px] text-slate-500">shikhar@dimisi.in</div>
              </div>

              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Account & Organization</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
