import React from "react";
import { ArrowRight, Users, Pill, BrainCircuit, Landmark } from "lucide-react";

interface HeroProps {
  onNavigateToPortal: () => void;
}

export default function Hero({ onNavigateToPortal }: HeroProps) {
  return (
    <div id="hero-section" className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-md border border-slate-200/80 p-8 sm:p-12 shadow-sm mb-8">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-200">
            <Landmark className="h-3.5 w-3.5" />
            National Digital Health Mission Initiative
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-none">
            Empowering Rural Healthcare with <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">SwasthyaSetu AI</span>
          </h1>
          
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
            Bridging the gap in rural clinics with automated queue tracking, real-time medicine inventory logs, and Gemini-powered clinical advisory support. Designed for speed, ease of use, and dependable patient care.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="hero-action-portal"
              onClick={onNavigateToPortal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-600 transition-all cursor-pointer group"
            >
              Access Patient Portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/60 backdrop-blur-sm border border-slate-200/80 px-4 py-3 rounded-xl shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Primary Health Centers Online: 4,120+
            </div>
          </div>

          {/* Core Feature Pillars */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-600">Smart Queues</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Pill className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-600">Stock Alerts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <BrainCircuit className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-slate-600">Gemini Advice</span>
            </div>
          </div>
        </div>

        {/* Beautiful SVG Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-xl shadow-slate-100/50">
            {/* Animated Glow Backing */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-300 to-blue-400 opacity-20 blur-xl -z-10" />
            
            <svg
              className="w-full h-full text-blue-600"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Decorative Rings */}
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-blue-100" />
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" className="text-cyan-50/70" />
              <circle cx="100" cy="100" r="55" fill="url(#paint0_linear_hero)" />

              {/* Heartbeat Wave */}
              <path
                d="M45 100H70L78 80L88 125L98 90L104 105L112 100H155"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              />

              {/* Cross symbol / Red Cross vibe inside cyan circles */}
              <g transform="translate(100, 100)">
                {/* Floating Stethoscope outline */}
                <path
                  d="M -30,-30 C -20,-50 20,-50 30,-30 C 40,-10 30,20 0,35 C -30,20 -40,-10 -30,-30 Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-blue-200/50"
                  fill="none"
                />
              </g>

              {/* Small floating particles */}
              <circle cx="45" cy="55" r="4" fill="#22d3ee" className="animate-pulse" />
              <circle cx="155" cy="65" r="6" fill="#3b82f6" />
              <circle cx="140" cy="140" r="5" fill="#06b6d4" />
              <circle cx="60" cy="145" r="3" fill="#60a5fa" className="animate-pulse" />

              {/* Central Medical Cross Shield */}
              <g transform="translate(85, 30)">
                <rect width="30" height="30" rx="8" fill="#ffffff" className="shadow-md" />
                <path d="M15 8V22M8 15H22" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="paint0_linear_hero" x1="45" y1="45" x2="155" y2="155" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
