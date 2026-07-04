import React from "react";
import { UserPlus, PlusCircle, BrainCircuit, Users, Pill, Calendar, AlertCircle } from "lucide-react";
import Hero from "./Hero";
import StatsCards from "./StatsCards";
import { Patient, Medicine } from "../types";

interface LandingDashboardProps {
  patients: Patient[];
  medicines: Medicine[];
  onNavigateToPortal: (subSection?: "queue-form" | "medicine-form" | "ai-card") => void;
}

export default function LandingDashboard({ patients, medicines, onNavigateToPortal }: LandingDashboardProps) {
  // Sort and filter active queues
  const activeQueue = patients.filter((p) => p.status !== "COMPLETED");
  const servingPatient = patients.find((p) => p.status === "SERVING");
  
  // Expiry alert status helper
  const getAlertColor = (m: Medicine) => {
    const today = new Date();
    const exp = new Date(m.expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (exp <= today || m.stock <= 5) return "red";
    if (diffDays <= 30 || m.stock <= 20) return "yellow";
    return "green";
  };

  return (
    <div id="dashboard-view" className="space-y-8 animate-fadeIn">
      {/* 1. Government Community Hero Banner */}
      <Hero onNavigateToPortal={() => onNavigateToPortal("queue-form")} />

      {/* 2. Interactive KPI Stats Row */}
      <StatsCards patients={patients} medicines={medicines} />

      {/* 3. Quick Action Hub */}
      <div id="quick-actions-hub" className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Clinic Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            id="quick-action-register"
            onClick={() => onNavigateToPortal("queue-form")}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/60 bg-white/50 hover:bg-white/95 text-blue-700 font-medium transition-all text-left shadow-2xs group"
          >
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800">Register Patient</span>
              <span className="text-xs text-slate-500 font-normal">Generate queue token instantly</span>
            </div>
          </button>

          <button
            id="quick-action-stock"
            onClick={() => onNavigateToPortal("medicine-form")}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/60 bg-white/50 hover:bg-white/95 text-cyan-800 font-medium transition-all text-left shadow-2xs group"
          >
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/25">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800">Add Medicine Entry</span>
              <span className="text-xs text-slate-500 font-normal">Track batch logs and expiry alerts</span>
            </div>
          </button>

          <button
            id="quick-action-consult"
            onClick={() => onNavigateToPortal("ai-card")}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/60 bg-white/50 hover:bg-white/95 text-indigo-700 font-medium transition-all text-left shadow-2xs group"
          >
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-500 text-white shadow-md shadow-indigo-500/25">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-800">Ask SwasthyaSetu AI</span>
              <span className="text-xs text-slate-500 font-normal">Gemini medicine advisory notes</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Summaries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Queue Snapshot */}
        <div id="queue-snapshot-card" className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Clinic Queue Snapshot</h2>
            </div>
            <button
              id="view-portal-queue"
              onClick={() => onNavigateToPortal("queue-form")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Full List &rarr;
            </button>
          </div>

          {activeQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center flex-grow">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">No active patients in queue</p>
              <p className="text-xs text-slate-400 mt-1">All clinics are currently cleared.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto flex-grow pr-1">
              {activeQueue.map((patient) => (
                <div
                  key={patient.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    patient.status === "SERVING"
                      ? "bg-cyan-50/40 border-cyan-200 ring-1 ring-cyan-100/50 shadow-2xs"
                      : "bg-white/50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold ${
                      patient.status === "SERVING"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 border border-slate-200/60"
                    }`}>
                      {patient.token}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{patient.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Age {patient.age} • Village {patient.village}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold leading-none ${
                      patient.status === "SERVING"
                        ? "bg-cyan-100/80 text-cyan-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        patient.status === "SERVING" ? "bg-cyan-500 animate-pulse" : "bg-slate-400"
                      }`} />
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medicine Stock Status Snapshot */}
        <div id="medicine-snapshot-card" className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-cyan-600" />
              <h2 className="text-lg font-bold text-slate-800">Critical Medicine Status</h2>
            </div>
            <button
              id="view-portal-medicine"
              onClick={() => onNavigateToPortal("medicine-form")}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-800"
            >
              Manage Inventory &rarr;
            </button>
          </div>

          {medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center flex-grow">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                <Pill className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">No medicines in inventory</p>
              <p className="text-xs text-slate-400 mt-1">Please register medicine stocks in Patient Portal.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto flex-grow pr-1">
              {medicines.slice(0, 5).map((med) => {
                const color = getAlertColor(med);
                return (
                  <div
                    key={med.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      color === "red"
                        ? "bg-red-50/30 border-red-200"
                        : color === "yellow"
                        ? "bg-amber-50/30 border-amber-200"
                        : "bg-white/50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        color === "red"
                          ? "bg-red-100/80 text-red-600"
                          : color === "yellow"
                          ? "bg-amber-100/80 text-amber-600"
                          : "bg-emerald-100/80 text-emerald-600"
                      }`}>
                        <Pill className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{med.medicineName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>Expires: {med.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-extrabold text-slate-700">
                        {med.stock} units
                      </span>
                      <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-2xs font-semibold ${
                        color === "red"
                          ? "bg-red-100 text-red-700"
                          : color === "yellow"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {color === "red" ? "Critical Alert" : color === "yellow" ? "Warning" : "Secure"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
