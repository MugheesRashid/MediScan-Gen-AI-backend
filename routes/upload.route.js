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
const MODEL_FALLBACK_LIST = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite-preview",
  "gemini-2.0-flash-lite",
];

/**
 * Reusable helper to generate content with fallback logic
 */
async function generateWithFallback(payload) {
  let lastError = null;

  for (const modelName of MODEL_FALLBACK_LIST) {
    try {
      console.log(`Attempting generation with: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(payload);

      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Empty response from model");

      console.log(`✅ Successfully generated with: ${modelName}`);
      return text;
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message}`);
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

    const geminiText = await generateWithFallback(payload);

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

    const geminiText = await generateWithFallback(payload);

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