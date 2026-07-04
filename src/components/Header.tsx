import React from "react";
import { Activity, ShieldCheck, Grid, Users } from "lucide-react";

interface HeaderProps {
  currentTab: "dashboard" | "portal";
  setCurrentTab: (tab: "dashboard" | "portal") => void;
}

export default function Header({ currentTab, setCurrentTab }: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Government Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">National Health Mission</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-3xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200 gap-0.5">
                <ShieldCheck className="h-3 w-3" />
                Gov Approved
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none mt-0.5">
              SwasthyaSetu <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">AI</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/60 backdrop-blur-sm p-1 rounded-xl border border-slate-200/50">
          <button
            id="nav-btn-dashboard"
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentTab === "dashboard"
                ? "bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm font-bold border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <Grid className="h-4 w-4" />
            Dashboard
          </button>
          <button
            id="nav-btn-portal"
            onClick={() => setCurrentTab("portal")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentTab === "portal"
                ? "bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm font-bold border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
            }`}
          >
            <Users className="h-4 w-4" />
            Patient Portal
          </button>
        </nav>
      </div>
    </header>
  );
}
