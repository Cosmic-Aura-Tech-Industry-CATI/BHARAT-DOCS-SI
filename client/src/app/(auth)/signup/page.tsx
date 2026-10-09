'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  FileText,
  Check,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const { setUserRole } = useAppStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserRole('CHARTERED_ACCOUNTANT');
      toast.success('Account created successfully!', {
        description: `Welcome to BharatDoc, ${fullName || 'Partner'}.`,
      });
      router.push('/dashboard');
    }, 800);
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserRole('CHARTERED_ACCOUNTANT');
      toast.success(`Account connected via ${provider}`, {
        description: 'Redirecting to your BharatDoc workspace...',
      });
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF7F2] text-slate-900 font-sans selection:bg-[#9C4B27]/20 selection:text-[#9C4B27]">
      {/* LEFT COLUMN: Clean Ivory / Cream Editorial Registration Form */}
      <div className="w-full lg:w-[54%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen">
        {/* Top Header: Logo + Sign In Link */}
        <div className="flex items-center justify-between w-full">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-8 w-7 rounded-sm border-2 border-slate-900 flex flex-col justify-center items-center gap-[3px] p-[3px]">
              <div className="w-full h-[1.5px] bg-slate-900 rounded-full" />
              <div className="w-full h-[1.5px] bg-slate-900 rounded-full" />
              <div className="w-2/3 self-start h-[1.5px] bg-slate-900 rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950 font-serif">
              Bharat<span className="text-[#9C4B27]">Doc</span>
            </span>
          </Link>

          <div className="text-xs text-slate-600">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="text-[#9C4B27] font-semibold underline underline-offset-2 hover:text-[#853D1C] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Center Form Section */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2 font-mono">
              AI DOCUMENT INTELLIGENCE
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-slate-950 leading-tight">
              Create your account
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get started with BharatDoc and unlock intelligent document processing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
                />
              </div>
            </div>

            {/* Organization / Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Your company name"
                  required
                  className="w-full h-10 pl-10 pr-3.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full h-10 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#9C4B27] focus:border-[#9C4B27] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 bg-[#9C4B27] hover:bg-[#853D1C] active:bg-[#743316] text-white font-medium text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-70"
            >
              <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
              {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-[#FAF7F2] px-3">
              OR CONTINUE WITH
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialAuth('Google')}
              className="h-10 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('Microsoft')}
              className="h-10 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>
        </div>

        {/* Footer Legal Terms */}
        <div className="text-center text-[11px] text-slate-500 pt-6">
          By creating an account, you agree to our{' '}
          <a href="#terms" className="text-slate-700 underline hover:text-slate-900">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" className="text-slate-700 underline hover:text-slate-900">
            Privacy Policy
          </a>
          .
        </div>
      </div>

      {/* RIGHT COLUMN: Luxury Dark Workspace with Form-16 & HDFC Bank Statement Paper Showcase */}
      <div className="w-full lg:w-[46%] bg-[#0f171c] relative min-h-[560px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden border-l border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f13] via-[#0f171c] to-[#17222a] opacity-90" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-950/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Decorative Desk Botanical Leaves */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-40 mix-blend-screen">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-emerald-900/40">
            <path d="M40 0 C60 40, 100 60, 160 50 C120 90, 100 130, 120 180 C80 140, 50 110, 0 100 C30 70, 30 30, 40 0 Z" />
          </svg>
        </div>

        {/* Layered Paper Documents: Form 16 + HDFC Bank Statement */}
        <div className="relative z-10 pt-4 flex justify-center items-center">
          <div className="relative w-[320px] sm:w-[350px]">
            {/* Back Document: FORM 16 */}
            <div
              style={{
                transform: 'rotate(-6deg) translateX(-15px) translateY(-5px)',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5)',
              }}
              className="absolute inset-0 bg-[#f8f8f5] rounded-md p-5 text-slate-800 border border-slate-300/60 select-none opacity-90"
            >
              <div className="border-b border-slate-200 pb-2">
                <span className="text-xs font-black uppercase tracking-wider font-serif">FORM 16</span>
                <span className="text-[10px] text-slate-500 block">PART A • Assessment Year 2026-27</span>
              </div>
              <div className="mt-3 space-y-1 text-[9px] font-mono text-slate-400">
                <div className="h-2 bg-slate-200 rounded w-3/4" />
                <div className="h-2 bg-slate-200 rounded w-1/2" />
                <div className="h-2 bg-slate-200 rounded w-5/6" />
              </div>
            </div>

            {/* Front Document: HDFC BANK Statement */}
            <div
              style={{
                transform: 'rotate(3deg) translateY(15px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              }}
              className="relative bg-[#fbfbf9] rounded-md p-6 text-slate-900 font-sans select-none border border-slate-200/70"
            >
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
                  <div className="h-3 w-3 bg-red-600 rounded-[2px]" />
                  <span>HDFC BANK</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-800 mt-1">
                  Account Statement
                </div>
              </div>

              {/* Transactions Table */}
              <div className="py-3">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 text-left">
                      <th className="pb-1.5 font-normal">Date</th>
                      <th className="pb-1.5 font-normal">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-1.5 text-slate-500">01 Oct 2026</td>
                      <td className="py-1.5 font-sans text-slate-800">UPI Payment</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-500">02 Oct 2026</td>
                      <td className="py-1.5 font-sans text-slate-800">NEFT Transfer</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-500">03 Oct 2026</td>
                      <td className="py-1.5 font-sans text-slate-800">Debit Card</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-slate-500">05 Oct 2026</td>
                      <td className="py-1.5 font-sans text-emerald-700 font-medium">Salary Credit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Dark Glassmorphism Feature Cards */}
        <div className="relative z-10 my-8 space-y-2.5 max-w-sm">
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-3 flex items-center gap-3 shadow-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Extract key data</div>
              <div className="text-[11px] text-slate-400">Invoices, Form-16, Bank Statements</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-3 flex items-center gap-3 shadow-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Validate with AI</div>
              <div className="text-[11px] text-slate-400">Rules, checks and insights</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md p-3 flex items-center gap-3 shadow-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Ready for your review</div>
              <div className="text-[11px] text-slate-400">Human-in-the-loop verification</div>
            </div>
          </div>
        </div>

        {/* Decorative Fountain Pen (Bottom Right) */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 pointer-events-none opacity-80 rotate-[-35deg]">
          <div className="w-4 h-56 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 rounded-t-full shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 rounded-t-full" />
            <div className="absolute bottom-4 left-0 right-0 h-10 bg-yellow-400" />
          </div>
        </div>

        {/* Bottom Right Brand Mark */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80">
          <div className="text-lg font-bold font-serif text-white tracking-tight">
            Bharat<span className="text-[#B85D36]">Doc</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Make Indian Documents Work for You
          </div>
        </div>
      </div>
    </div>
  );
}
