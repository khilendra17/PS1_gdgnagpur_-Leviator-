import React, { useState } from "react";
import { 
  Users, Pill, BrainCircuit, Sparkles, Send, Loader2, ArrowRight, CheckCircle2, AlertTriangle, PlayCircle, HelpCircle, UserPlus, FileSpreadsheet, PlusCircle 
} from "lucide-react";
import { Patient, Medicine, AIResponse } from "../types";

interface PatientPortalProps {
  patients: Patient[];
  medicines: Medicine[];
  onAddPatient: (patient: Patient) => void;
  onAddMedicine: (medicine: Medicine) => void;
  onNextPatient: () => Promise<void>;
  initialFocus?: "queue-form" | "medicine-form" | "ai-card" | null;
}

export default function PatientPortal({ 
  patients, 
  medicines, 
  onAddPatient, 
  onAddMedicine, 
  onNextPatient,
  initialFocus
}: PatientPortalProps) {
  // Queue Form State
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientVillage, setPatientVillage] = useState("");
  const [patientSymptoms, setPatientSymptoms] = useState("");
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);

  // Medicine Form State
  const [medName, setMedName] = useState("");
  const [medExpiry, setMedExpiry] = useState("");
  const [medStock, setMedStock] = useState("");
  const [isSubmittingMed, setIsSubmittingMed] = useState(false);

  // AI Assistant State
  const [selectedMedForAI, setSelectedMedForAI] = useState("");
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // General Notification Toasts/Banners
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Register Patient Submit
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientAge || !patientVillage || !patientSymptoms) {
      triggerNotification("Please fill in all patient registration fields", "error");
      return;
    }

    setIsSubmittingPatient(true);
    try {
      const res = await fetch("/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patientName,
          age: parseInt(patientAge, 10),
          village: patientVillage,
          symptoms: patientSymptoms,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAddPatient(data);
        triggerNotification(`Token ${data.token} generated successfully for ${data.name}!`);
        // Clear Form
        setPatientName("");
        setPatientAge("");
        setPatientVillage("");
        setPatientSymptoms("");
      } else {
        triggerNotification(data.error || "Failed to register patient", "error");
      }
    } catch (err: any) {
      triggerNotification("Server connection error. Please try again.", "error");
    } finally {
      setIsSubmittingPatient(false);
    }
  };

  // Track Medicine Submit
  const handleMedicineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medExpiry || !medStock) {
      triggerNotification("Please fill in all medicine log fields", "error");
      return;
    }

    setIsSubmittingMed(true);
    try {
      const res = await fetch("/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineName: medName,
          expiryDate: medExpiry,
          stock: parseInt(medStock, 10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAddMedicine(data);
        triggerNotification(`Medicine "${data.medicineName}" logged successfully!`);
        // Clear Form
        setMedName("");
        setMedExpiry("");
        setMedStock("");
      } else {
        triggerNotification(data.error || "Failed to log medicine", "error");
      }
    } catch (err: any) {
      triggerNotification("Server connection error. Please try again.", "error");
    } finally {
      setIsSubmittingMed(false);
    }
  };

  // Next Patient Admin Trigger
  const [isMovingQueue, setIsMovingQueue] = useState(false);
  const handleNextPatientClick = async () => {
    setIsMovingQueue(true);
    try {
      await onNextPatient();
      triggerNotification("Queue advanced successfully!");
    } catch (err) {
      triggerNotification("Failed to advance queue", "error");
    } finally {
      setIsMovingQueue(false);
    }
  };

  // Ask Gemini AI Trigger
  const handleAskAI = async (medNameParam?: string) => {
    const targetMed = medNameParam || selectedMedForAI;
    if (!targetMed) {
      triggerNotification("Please select or enter a medicine name first", "error");
      return;
    }

    setIsAiLoading(true);
    setAiAdvice(null);
    setAiError(null);
    try {
      const res = await fetch("/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineName: targetMed }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiAdvice(data.advice);
        if (!medNameParam) setSelectedMedForAI("");
      } else {
        setAiError(data.error || "Failed to query Gemini AI");
        if (data.instructions) {
          setAiError((prev) => `${prev}. ${data.instructions}`);
        }
      }
    } catch (err) {
      setAiError("Connection to AI gateway failed. Please confirm environment setup.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Expiry alert status helper
  const getAlertStyle = (m: Medicine) => {
    const today = new Date();
    const exp = new Date(m.expiryDate);
    const diffTime = exp.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (exp <= today || m.stock <= 5) {
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        badge: "bg-red-100 text-red-800",
        dot: "bg-red-500",
        label: "Red - Alert"
      };
    }
    if (diffDays <= 30 || m.stock <= 20) {
      return {
        bg: "bg-amber-50/50 text-amber-800 border-amber-200",
        badge: "bg-amber-100 text-amber-800",
        dot: "bg-amber-500",
        label: "Yellow - Warning"
      };
    }
    return {
      bg: "bg-emerald-50/50 text-emerald-800 border-emerald-200",
      badge: "bg-emerald-100 text-emerald-800",
      dot: "bg-emerald-500",
      label: "Green - Safe"
    };
  };

  // Render parsed markdown safely for display
  const formatMarkdownText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h4 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-2 first:mt-0">{trimmed.replace("###", "")}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={i} className="text-base font-extrabold text-blue-800 mt-5 mb-2 first:mt-0">{trimmed.replace("##", "")}</h3>;
      }
      if (trimmed.startsWith("**")) {
        return <p key={i} className="text-sm text-slate-700 font-medium mb-1">{trimmed.replace(/\*\*/g, "")}</p>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return <li key={i} className="text-sm text-slate-600 list-disc ml-5 mb-1">{trimmed.substring(1).trim()}</li>;
      }
      if (trimmed === "") {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-2">{trimmed}</p>;
    });
  };

  return (
    <div id="portal-view" className="space-y-8 animate-fadeIn">
      {/* Toast Notification Alert Banner */}
      {notification && (
        <div 
          id="toast-notification"
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl px-5 py-4 shadow-xl border animate-slideIn ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      {/* Forms Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Register Patient Queue Form */}
        <div id="queue-form" className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Queue Token Generator</h2>
              <p className="text-xs text-slate-500">Register patient at primary health clinic desk</p>
            </div>
          </div>

          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Patient Full Name
                </label>
                <input
                  id="patient-name-input"
                  type="text"
                  placeholder="e.g. Sita Devi"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Age (Years)
                </label>
                <input
                  id="patient-age-input"
                  type="number"
                  placeholder="Age"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Village / Hamlet
              </label>
              <input
                id="patient-village-input"
                type="text"
                placeholder="e.g. Ramgarh"
                value={patientVillage}
                onChange={(e) => setPatientVillage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Observed Symptoms / Reason for Visit
              </label>
              <textarea
                id="patient-symptoms-input"
                rows={3}
                placeholder="e.g. High fever, stomach infection, routine high blood pressure check"
                value={patientSymptoms}
                onChange={(e) => setPatientSymptoms(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <button
              id="patient-submit-btn"
              type="submit"
              disabled={isSubmittingPatient}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingPatient ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Token...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Generate Token (SQLite Log)
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. Medicine Logging Form */}
        <div id="medicine-form" className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Medicine Stock Logger</h2>
              <p className="text-xs text-slate-500">Add medicines to clinic warehouse records</p>
            </div>
          </div>

          <form onSubmit={handleMedicineSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Medicine Name
              </label>
              <input
                id="medicine-name-input"
                type="text"
                placeholder="e.g. Amoxicillin 250mg"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Batch Expiry Date
                </label>
                <input
                  id="medicine-expiry-input"
                  type="date"
                  value={medExpiry}
                  onChange={(e) => setMedExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Stock Left (Units)
                </label>
                <input
                  id="medicine-stock-input"
                  type="number"
                  placeholder="e.g. 150"
                  value={medStock}
                  onChange={(e) => setMedStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/60 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-100/60 border border-slate-200/50 rounded-xl flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
              <p className="text-2xs text-slate-600 leading-normal">
                Logging medicines here registers expiry dates and inventory numbers inside SQLite database.
                Low-stock (&lt;=5 units) or expired medicines automatically trigger critical warning levels.
              </p>
            </div>

            <button
              id="medicine-submit-btn"
              type="submit"
              disabled={isSubmittingMed}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-700 hover:to-teal-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingMed ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging Medicine...
                </>
              ) : (
                <>
                  <Pill className="h-4 w-4" />
                  Log Medicine Stock
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Tables & Queue Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Patient Queue Tracker (7 cols) */}
        <div id="patient-queue-table-card" className="lg:col-span-7 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Clinic Waitlist & Status</h2>
                  <p className="text-xs text-slate-500">Live tokens tracked inside local SQLite database</p>
                </div>
              </div>

              {/* Admin Controller: Next Patient */}
              <button
                id="next-patient-btn"
                onClick={handleNextPatientClick}
                disabled={isMovingQueue || patients.filter(p => p.status === "WAITING").length === 0}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-40"
              >
                {isMovingQueue ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <PlayCircle className="h-3.5 w-3.5" />
                )}
                Next Patient
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 rounded-l-xl">Token</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Village</th>
                    <th className="py-3 px-4">Symptoms / Illness</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                        No registered patients in queue logs yet
                      </td>
                    </tr>
                  ) : (
                    patients.map((p) => (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-slate-50/30 transition-colors ${
                          p.status === "SERVING" ? "bg-cyan-50/35" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center font-black h-8 w-8 rounded-lg text-xs ${
                            p.status === "SERVING" 
                              ? "bg-cyan-500 text-white shadow-sm" 
                              : p.status === "COMPLETED"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {p.token}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          <div>
                            {p.name}
                            <span className="block text-2xs font-normal text-slate-400">Age: {p.age}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{p.village}</td>
                        <td className="py-3 px-4 text-slate-600 truncate max-w-[150px]" title={p.symptoms}>
                          {p.symptoms}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
                            p.status === "SERVING"
                              ? "bg-cyan-100/80 text-cyan-800"
                              : p.status === "COMPLETED"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            <span className={`h-1 w-1 rounded-full ${
                              p.status === "SERVING" ? "bg-cyan-500 animate-pulse" : p.status === "COMPLETED" ? "bg-slate-400" : "bg-blue-500"
                            }`} />
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
            <span>Estimated Queue processing: ~10 mins per waiting token.</span>
            <span>Active Waiters: {patients.filter(p => p.status === "WAITING").length}</span>
          </div>
        </div>

        {/* Medicine Inventory list (5 cols) */}
        <div id="medicine-inventory-table-card" className="lg:col-span-5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-cyan-600" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Clinic Inventory</h2>
                  <p className="text-xs text-slate-500">Live color status and AI advice links</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3 rounded-l-xl">Medicine</th>
                    <th className="py-3 px-3">Stock / Expiry</th>
                    <th className="py-3 px-3 rounded-r-xl text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-slate-400 font-medium">
                        No registered medicine logs in SQLite yet
                      </td>
                    </tr>
                  ) : (
                    medicines.map((m) => {
                      const alert = getAlertStyle(m);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-800">
                            <div>
                              <span>{m.medicineName}</span>
                              <button
                                id={`ask-ai-link-${m.id}`}
                                onClick={() => handleAskAI(m.medicineName)}
                                className="block text-3xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline mt-0.5 text-left"
                              >
                                &bull; Ask Gemini Advice
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-700">{m.stock} units</div>
                            <div className="text-3xs text-slate-400 font-normal">Exp: {m.expiryDate}</div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-3xs font-extrabold ${alert.badge}`}>
                              <span className={`h-1 w-1 rounded-full ${alert.dot}`} />
                              {alert.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-2xs text-slate-400 flex items-center justify-between">
            <span>Red Alert = Expired OR Stock &lt;= 5</span>
            <span>Yellow Alert = Expires &lt; 30 days OR Stock &lt;= 20</span>
          </div>
        </div>

      </div>

      {/* 3. AI Assistant Panel (Unified Card inside Portal) */}
      <div id="ai-assistant-card" className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        {/* Floating background decorative item */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <BrainCircuit className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-800/40 pb-5 mb-6 gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50">
              <BrainCircuit className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Clinical AI Advisory</span>
                <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-1.5 py-0.5 text-2xs font-extrabold text-indigo-200 border border-white/5">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5 text-cyan-400" />
                  Gemini Flash
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">SwasthyaSetu AI Assistant</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 relative z-10">
            <select
              id="ai-medicine-selector"
              value={selectedMedForAI}
              onChange={(e) => setSelectedMedForAI(e.target.value)}
              className="px-4 py-2 bg-indigo-950/80 border border-indigo-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-100 rounded-xl"
            >
              <option value="">-- Choose Medicine from Inventory --</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.medicineName} className="bg-indigo-950 text-slate-100">
                  {m.medicineName}
                </option>
              ))}
            </select>

            <button
              id="ai-ask-btn"
              onClick={() => handleAskAI()}
              disabled={isAiLoading || !selectedMedForAI}
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isAiLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Consult
            </button>
          </div>
        </div>

        {/* AI Answer Screen */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-h-[160px] flex flex-col justify-center relative z-10">
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-sm font-bold text-cyan-300 animate-pulse">Consulting SwasthyaSetu AI Medical Directory...</p>
              <p className="text-xs text-indigo-200 mt-1">Fetching clinical alerts, household storage advice, and wellness metrics</p>
            </div>
          ) : aiError ? (
            <div className="p-4 bg-red-950/60 border border-red-500/30 rounded-xl text-red-200 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-red-100">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                AI Inquiry Incomplete
              </div>
              <p className="leading-relaxed">{aiError}</p>
            </div>
          ) : aiAdvice ? (
            <div id="ai-response-content" className="prose prose-invert max-w-none text-slate-100 space-y-3">
              {formatMarkdownText(aiAdvice)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-12 w-12 rounded-full bg-white/5 text-cyan-400 flex items-center justify-center mb-3 border border-white/10">
                <HelpCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-white">No Consultation Active</p>
              <p className="text-xs text-indigo-200 mt-1 max-w-md">
                Select a medicine from the dropdown above or click the "Ask Gemini Advice" link next to any medicine in the inventory table to see automated advisory summaries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
