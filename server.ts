import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/db.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
// GET /patients - Fetch all patients
app.get("/patients", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch patients", details: error.message });
  }
});

// POST /patients - Create a new patient token
app.post("/patients", async (req, res) => {
  try {
    const { name, age, village, symptoms } = req.body;
    if (!name || !age || !village || !symptoms) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique token (A001, A002, ...)
    const latestPatient = await prisma.patient.findFirst({
      where: { token: { startsWith: "A" } },
      orderBy: { token: "desc" },
    });

    let nextNum = 1;
    if (latestPatient) {
      const match = latestPatient.token.match(/A(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const token = `A${String(nextNum).padStart(3, "0")}`;

    const newPatient = await prisma.patient.create({
      data: {
        name,
        age: parseInt(age, 10),
        village,
        symptoms,
        token,
        status: "WAITING",
      },
    });

    res.status(201).json(newPatient);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create patient token", details: error.message });
  }
});

// PATCH /patients/next - Move queue correctly
app.patch("/patients/next", async (req, res) => {
  try {
    // 1. Find if there is any currently SERVING patient
    const currentServing = await prisma.patient.findFirst({
      where: { status: "SERVING" },
    });

    if (currentServing) {
      // Update them to COMPLETED
      await prisma.patient.update({
        where: { id: currentServing.id },
        data: { status: "COMPLETED" },
      });
    }

    // 2. Find the next WAITING patient (oldest by token)
    const nextWaiting = await prisma.patient.findFirst({
      where: { status: "WAITING" },
      orderBy: { token: "asc" },
    });

    let updatedPatient = null;
    if (nextWaiting) {
      updatedPatient = await prisma.patient.update({
        where: { id: nextWaiting.id },
        data: { status: "SERVING" },
      });
    }

    res.json({
      previousCompleted: currentServing,
      newServing: updatedPatient,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to move queue to next patient", details: error.message });
  }
});

// GET /medicine - Fetch all medicines
app.get("/medicine", async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(medicines);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch medicines", details: error.message });
  }
});

// POST /medicine - Create a new medicine entry
app.post("/medicine", async (req, res) => {
  try {
    const { medicineName, expiryDate, stock } = req.body;
    if (!medicineName || !expiryDate || stock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMedicine = await prisma.medicine.create({
      data: {
        medicineName,
        expiryDate,
        stock: parseInt(stock, 10),
      },
    });

    res.status(201).json(newMedicine);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to track medicine", details: error.message });
  }
});

// POST /ai - Ask Gemini about medicine precautions, dosage, storage, tips
app.post("/ai", async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ error: "Medicine name is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured.",
        instructions: "Please click on the Secrets icon in AI Studio settings to set your GEMINI_API_KEY.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `Provide precise clinical and safety guidance for taking "${medicineName}" in a professional government healthcare format:
1. **Medicine Precautions**: Key warnings, side effects, and who must avoid it.
2. **Dosage Reminder**: How and when to take it, and standard intervals.
3. **Storage Advice**: Optimal conditions (temperature, light, moisture) for rural households.
4. **Generic Healthcare Tips**: Lifestyle guidance and general wellness instructions.

Write in a highly clear, supportive, and clean format using Markdown headers and bullet points.
Include a comforting medical disclaimer at the bottom stating that this is an automatic AI advisory and they should consult their nearest Primary Health Center (PHC) doctor or healthcare worker for final prescription decisions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const advice = response.text || "No response received from SwasthyaSetu AI assistant.";
    res.json({ advice });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate AI advice", details: error.message });
  }
});

// Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SwasthyaSetu AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
