'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { maskPAN, maskGSTIN } from '@/lib/formatters';
import { toast } from 'sonner';
import {
  Building2,
  User,
  Server,
  Save,
  ShieldCheck,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, organization } = useAppStore();
  const [apiBaseUrl, setApiBaseUrl] = useState(
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'
  );

  const handleSaveApi = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('API configuration updated', {
      description: `Backend base URL set to: ${apiBaseUrl}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <div className="text-[11px] font-semibold text-slate-500 font-sans">
          Firm Profile & Integrations
        </div>
        <h1 className="text-3xl font-bold font-serif tracking-tight text-slate-900 mt-0.5">
          Settings
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage firm credentials, API integration endpoints, and compliance retention settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Organization Information */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F0EB]">
            <div className="p-2 rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Accounting Firm Profile</h3>
              <p className="text-[11px] text-slate-500">Primary legal entity registered for BharatDoc intelligence</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Firm Legal Name</label>
              <input
                value={organization.name}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">GSTIN (Masked)</label>
              <input
                value={maskGSTIN(organization.gstin)}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Subscription Tier</label>
              <input
                value={`${organization.plan} (Avinya 2K26 Edition)`}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs text-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Monthly Ingestion Limit</label>
              <input
                value={`${organization.tier_limits.used_docs} / ${organization.tier_limits.monthly_docs} Documents`}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F0EB]">
            <div className="p-2 rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Operator & CA Identity</h3>
              <p className="text-[11px] text-slate-500">Current authenticated session details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Full Name</label>
              <input
                value={user.name}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Official Email</label>
              <input
                value={user.email}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Current Role</label>
              <input
                value={user.role.replace(/_/g, ' ')}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs font-semibold text-[#9C4B27]"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">PAN Identifier (Masked)</label>
              <input
                value={maskPAN(user.pan_masked)}
                readOnly
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-[#FAF8F5] text-xs font-mono text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* API Base URL Configuration */}
        <div className="bg-white border border-[#E8E4DA] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F0EB]">
            <div className="p-2 rounded-xl bg-[#FDF3EC] text-[#9C4B27]">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-sans">Backend Integration & Endpoint</h3>
              <p className="text-[11px] text-slate-500">Connect to your FastAPI or Python BharatDoc microservice</p>
            </div>
          </div>

          <form onSubmit={handleSaveApi} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                Backend API Base URL
              </label>
              <input
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-[#E2DDD3] bg-white text-xs font-mono text-slate-800 shadow-2xs focus:border-[#9C4B27] focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Default: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">http://localhost:8000/api/v1</code>
              </p>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="h-9 px-5 bg-[#9C4B27] hover:bg-[#853D1C] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Endpoint Configuration</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
