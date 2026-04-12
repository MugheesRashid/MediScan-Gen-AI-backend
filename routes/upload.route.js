const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompt = require("./prompt");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------------------------
// MODEL FALLBACK SYSTEM
// -------------------------
async function getBestAvailableModel(genAI) {
  const MODEL_PRIORITY = [
    "gemini-2.5-flash", // 🔥 prioritize working model
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.5-pro", // ❌ keep last (likely to fail)
  ];

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("ping");
      console.log(`✅ Using Gemini model: ${modelName}`);
      return model;
    } catch (err) {
      console.log(`❌ Model failed: ${modelName}`);
    }
  }

  throw new Error("No Gemini models available");
}

// -------------------------
// LAZY MODEL LOADER (FIXED)
// -------------------------
let modelPromise = null;

async function getModel() {
  if (!modelPromise) {
    console.log("⚡ Initializing Gemini model...");
    modelPromise = getBestAvailableModel(genAI);
  }
  return modelPromise;
}

// -------------------------
// RETRY + FALLBACK HANDLER
// -------------------------
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeGenerateContent(payload, maxRetries = 3) {
  let attempt = 0;
  let model = await getModel();

  while (attempt < maxRetries) {
    try {
      return await model.generateContent(payload);
    } catch (err) {
      const retryable = [429, 500, 503];
      console.log(`⚠️ Gemini Error (Attempt ${attempt + 1}):`, err.status);

      if (retryable.includes(err.status)) {
        attempt++;
        await wait(1000 * attempt);
        continue;
      }

      throw err;
    }
  }

  // 🔄 Switch model after retries fail
  console.log("🔄 Switching Gemini model...");

  modelPromise = getBestAvailableModel(genAI);
  const newModel = await modelPromise;

  return await newModel.generateContent(payload);
}

// -------------------------
// MULTER CONFIG
// -------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

// -------------------------
// PDF ROUTE
// -------------------------
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const pdf = new PDFParse({
      url: `${process.env.BACKEND_URL}/uploads/${req.file.filename}`,
    });

    const extractedText = await pdf.getText();
    const payload = prompt + extractedText.text;

    const response = await safeGenerateContent(payload);
    const geminiText = response.response.text();

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      extractedText,
      geminiResponse: geminiText,
    });
  } catch (error) {
    console.error("PDF Error:", error);

    if (req.file?.path) fs.unlinkSync(req.file.path);

    res.status(500).json({
      error: "Processing failed",
      details: error.message,
    });
  }
});

// -------------------------
// IMAGE ROUTE
// -------------------------
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString("base64");

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: req.file.mimetype,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await safeGenerateContent(payload);
    const geminiText = response.response.text();

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Image processed successfully",
      geminiResponse: geminiText,
    });
  } catch (error) {
    console.error("Image Error:", error);

    if (req.file?.path) fs.unlinkSync(req.file.path);

    res.status(500).json({
      error: "Image processing failed",
      details: error.message,
    });
  }
});

module.exports = router;