const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompt = require("./prompt");
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
// ANALYZE TEXT ROUTE (PDF extracted text)
// -------------------------
router.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for analysis" });
    }

    const payload = prompt + text;
    const geminiText = await generateWithFallback(payload);

    res.json({
      success: true,
      geminiResponse: geminiText,
    });
  } catch (error) {
    console.error("Text analysis Error:", error);
    res.status(500).json({
      error: "Processing failed",
      details: error.message,
    });
  }
});

// -------------------------
// ANALYZE IMAGE ROUTE (Base64 image)
// -------------------------
router.post("/analyze-image", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image data provided for analysis" });
    }

    // Extract raw base64 data and mime type from data URL if provided
    let base64Data = image;
    let detectedMimeType = mimeType || "image/jpeg";

    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMimeType = match[1];
        base64Data = match[2];
      }
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: detectedMimeType,
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

    res.json({
      success: true,
      message: "Image processed successfully",
      geminiResponse: geminiText,
    });
  } catch (error) {
    console.error("Image analysis Error:", error);
    res.status(500).json({
      error: "Image processing failed",
      details: error.message,
    });
  }
});

module.exports = router;
