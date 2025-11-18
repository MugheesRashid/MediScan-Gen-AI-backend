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

// Gemini model fallback system
async function getBestAvailableModel(genAI) {
   const MODEL_PRIORITY = [
   "gemini-2.5-pro",
   "gemini-2.5-flash",
   "gemini-2.5-flash-preview",
   "gemini-2.5-flash-lite",
   "gemini-2.5-flash-lite-preview",
   "gemini-2.0-flash",
   "gemini-2.5-flash-lite",

   ];

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent("ping"); // test call
      console.log(`✅ Using Gemini model: ${modelName}`);
      return model;
    } catch (err) {
      console.log(`❌ Model failed: ${modelName} — ${err.message}`);
    }
  }

  throw new Error("No Gemini models available");
}

let model;
(async () => {
  model = await getBestAvailableModel(genAI);
})();

// Multer storage config
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

const upload = multer({ storage });

// PDF Route
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Always ensure a working model
    if (!model) model = await getBestAvailableModel(genAI);

    const pdf = new PDFParse({
      url: `http://localhost:3000/uploads/${req.file.filename}`,
    });

    const extractedText = await pdf.getText();

    const response = await model.generateContent(prompt + extractedText.text);
    const geminiText = response.response.text();

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      extractedText,
      geminiResponse: geminiText,
    });

  } catch (error) {
    console.error("PDF Error:", error);
    res.status(500).json({ error: "Processing failed", details: error.message });
  }
});

// Image upload
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    success: true,
    message: "Image uploaded successfully",
    file: req.file,
  });
});

module.exports = router;
