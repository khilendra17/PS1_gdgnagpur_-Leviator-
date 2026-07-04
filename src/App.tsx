import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import LandingDashboard from "./components/LandingDashboard";
import PatientPortal from "./components/PatientPortal";
import { Patient, Medicine } from "./types";
import { Activity, ShieldCheck, Heart } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"dashboard" | "portal">("dashboard");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [portalFocus, setPortalFocus] = useState<"queue-form" | "medicine-form" | "ai-card" | null>(null);

  // Initial Fetch on Load
  useEffect(() => {
    async function loadData() {
      try {
        const [patientsRes, medicinesRes] = await Promise.all([
          fetch("/patients"),
          fetch("/medicine")
        ]);
        
        if (patientsRes.ok && medicinesRes.ok) {
          const patientsData = await patientsRes.json();
          const medicinesData = await medicinesRes.json();
          setPatients(patientsData);
          setMedicines(medicinesData);
        } else {
          console.error("Failed to fetch initial database logs");
        }
      } catch (error) {
        console.error("Connection to SwasthyaSetu backend failed", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync state helpers
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  // Next Patient Queue Move
  const handleNextPatient = async () => {
    try {
      const res = await fetch("/patients/next", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Refetch complete list to maintain source of truth from SQLite
        const patientsRes = await fetch("/patients");
        if (patientsRes.ok) {
          const updatedPatients = await patientsRes.json();
          setPatients(updatedPatients);
        }
      } else {
        throw new Error("Failed to advance queue on backend");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Quick action shortcut dispatcher
  const handleQuickActionNavigation = (subSection?: "queue-form" | "medicine-form" | "ai-card") => {
    if (subSection) {
      setPortalFocus(subSection);
      // Clean after scroll trigger
      setTimeout(() => {
        const element = document.getElementById(subSection);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
    setCurrentTab("portal");
  };

  return (
    <div id="swasthya-setu-app" className="min-h-screen bg-slate-50/60 flex flex-col justify-between">
      {/* 1. Header with Government Health Brand & Navigation Tabs */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Body */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div id="global-loading" className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative flex items-center justify-center">
              <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-20" />
              <div className="relative h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                <Activity className="h-8 w-8 animate-pulse" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mt-6">Connecting to National Rural Health Portal...</h2>
            <p className="text-xs text-slate-400 mt-1">Initializing persistent SQLite storage & active consultation queues</p>
          </div>
        ) : currentTab === "dashboard" ? (
          /* View 1: Landing Dashboard */
          <LandingDashboard
            patients={patients}
            medicines={medicines}
            onNavigateToPortal={handleQuickActionNavigation}
          />
        ) : (
          /* View 2: Patient Portal (Full interactive screen) */
          <PatientPortal
            patients={patients}
            medicines={medicines}
            onAddPatient={handleAddPatient}
            onAddMedicine={handleAddMedicine}
            onNextPatient={handleNextPatient}
            initialFocus={portalFocus}
          />
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-white border-t border-blue-50 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider">SwasthyaSetu AI</span>
            <span>&bull;</span>
            <span>Digital India Initiative &copy; 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="font-semibold text-slate-500">Gemini Clinical Models</span>
            <span>&bull;</span>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Rural Clinics
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
