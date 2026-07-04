# SwasthyaSetu AI 🏥✨
### Modern Government Digital Healthcare Platform

SwasthyaSetu AI is a fully functional, production-ready hackathon MVP designed for modern government primary health centers (PHC) and rural healthcare clinics. Built using the **Express.js + Vite** full-stack architecture, it resolves major rural clinic challenges such as long waiting lines, medicine stock expiry, and clinical advice accessibility in remote areas using **Google Gemini 3.5 Flash** models and **Prisma SQLite database storage**.

---

## 🚀 Key Features

### 1. 🕒 Smart Queue Management
* **Instant Token Generator**: Register patients with their Name, Age, Village, and symptoms.
* **Persistent Waitlists**: High-performance SQLite queue tracking assigning unique tokens (`A001`, `A002`, `A003`, etc.).
* **Live Dashboards**: Track Waiting Count, Estimated Wait Time (~10 mins per waiter), and the Token being served.
* **Admin Next Patient Advanced Trigger**: Instantly advances the queue, changing current patients to `COMPLETED` and oldest waiters to `SERVING` securely in database logs.

### 2. 💊 Medicine Tracker & Gemini AI Assistant
* **Database Tracking**: Enter Medicine Name, Stock counts, and Expiry Dates securely.
* **Alert Level Metrics**:
  * 🔴 **Red Alert**: Expired batch or critically low stock ($\le 5$ units).
  * 🟡 **Yellow Warning**: Expires within 30 days or low-medium stock ($\le 20$ units).
  * 🟢 **Green Safe**: Safe expiry and plentiful inventory.
* **Clinical Gemini AI integration**: Seamlessly consults Gemini on a selected medicine to output clinical warnings, recommended dosages, storage conditions for rural homes, and wellness tips.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React (v19) + Vite (v6) + TypeScript + Tailwind CSS + Lucide Icons + Framer Motion
* **Backend**: Express.js REST API + Node.js
* **Database**: Prisma ORM with SQLite file-based storage (`dev.db`)
* **AI Engine**: Official `@google/genai` SDK querying the Gemini 3.5 Flash model server-side

---

## 📦 Setup & Installation

Follow these quick commands to set up and start the application:

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Sync & Seeding
Prisma automatically provisions the local SQLite database file and generates type-safe TypeScript query bindings.
```bash
# Push database schema to local SQLite dev.db file
npx prisma db push

# Seed the database with sample clinic data and medicine inventories
npx tsx prisma/seed.ts
```

### 3. Environment Configuration
Verify that a `.env` file exists at the project root with the following variables:
```env
# Required for AI Consultation. Inject via Secrets panel in AI Studio settings.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# The host URL of the running application
APP_URL="http://localhost:3000"
```

### 4. Running the Project
Launch both the Express backend and Vite development compiler on port 3000:
```bash
npm run dev
```

Open `http://localhost:3000` to preview SwasthyaSetu AI!

---

## 📁 Folder Structure

```text
├── prisma/
│   ├── schema.prisma   # SQLite Database schema for Patient and Medicine
│   ├── seed.ts         # Database seeder file
│   └── dev.db          # Active SQLite Database file
├── src/
│   ├── components/     # UI Components (Hero, Header, Dashboard, Portal)
│   ├── App.tsx         # Main application controller & state syncer
│   ├── db.ts           # Shared PrismaClient initialization
│   ├── types.ts        # TypeScript interfaces
│   ├── index.css       # Global styling configuration
│   └── main.tsx        # React client entrypoint
├── server.ts           # Express.js REST API with Vite Middleware Integration
├── package.json        # Unified scripts and packages list
└── README.md           # Instructions and documentation
```

---

## 🩺 Clinical Advisory Disclaimer
*Any recommendations provided by the SwasthyaSetu AI assistant are informational and clinical advice summaries. Patients and healthcare workers are advised to verify instructions with their nearest qualified Medical Officer before taking clinical actions.*
