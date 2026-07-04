import React from "react";
import { Users, Timer, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { Patient, Medicine } from "../types";

interface StatsCardsProps {
  patients: Patient[];
  medicines: Medicine[];
}

export default function StatsCards({ patients, medicines }: StatsCardsProps) {
  // Queue stats
  const waitingPatients = patients.filter((p) => p.status === "WAITING");
  const servingPatient = patients.find((p) => p.status === "SERVING");
  const estimatedWaitTime = waitingPatients.length * 10; // 10 minutes per waiting patient

  // Medicine stats
  const currentDate = new Date();
  const lowStockCount = medicines.filter((m) => m.stock <= 5).length;
  const expiredCount = medicines.filter((m) => {
    const expDate = new Date(m.expiryDate);
    return expDate <= currentDate;
  }).length;

  return (
    <div id="statistics-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Current Serving Token */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between group transition-all hover:shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Doctor Serving Token</span>
          <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-cyan-500 ring-4 ring-cyan-50 animate-pulse" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-cyan-600 tracking-wider">
            {servingPatient ? servingPatient.token : "None"}
          </span>
          {servingPatient && (
            <span className="text-xs font-semibold text-slate-500 truncate max-w-[120px]">
              ({servingPatient.name})
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-cyan-500" />
          Active consultation in progress
        </p>
      </div>

      {/* 2. Waiting Queue Count */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between group transition-all hover:shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/40 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Waiting Count</span>
          <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600">
            <Users className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600">
            {waitingPatients.length}
          </span>
          <span className="text-xs font-medium text-slate-500">patients</span>
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
          Queue is active and moving
        </p>
      </div>

      {/* 3. Estimated Wait Time */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between group transition-all hover:shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/40 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Est. Wait Time</span>
          <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
            <Timer className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-800">
            {estimatedWaitTime}m
          </span>
          <span className="text-xs font-medium text-slate-500">total</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          ~10 minutes average per patient
        </p>
      </div>

      {/* 4. Medicine Inventory Alert */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm flex flex-col justify-between group transition-all hover:shadow-md ${
        lowStockCount > 0 || expiredCount > 0
          ? "border-red-200 bg-red-50/40 backdrop-blur-md text-red-950"
          : "border-slate-200/80 bg-white/75 backdrop-blur-md"
      }`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/30 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Inventory Alerts</span>
          <div className={`rounded-lg p-1.5 ${
            lowStockCount > 0 || expiredCount > 0
              ? "bg-red-100 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}>
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{lowStockCount}</span>
            <span className="text-xs text-slate-500 font-medium">low stock items</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-red-600">{expiredCount}</span>
            <span className="text-xs text-slate-500 font-medium">expired units</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Check medicine logs in Patient Portal
        </p>
      </div>
    </div>
  );
}
