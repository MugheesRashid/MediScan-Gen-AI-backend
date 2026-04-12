# 🏥 MediScan Backend

AI-powered medical report reader. Uploads medical documents, extracts data using OCR, and analyzes with AI.

---

## 🔄 Workflow

```
User Uploads Medical Document (PDF/Image)
            ↓
    Validate & Secure File
            ↓
    Extract Text (pdf-parser)
            ↓
    Send to AI Model for Analysis
            ↓
    Parse & Structure Response
            ↓
    Return JSON Data
            ↓
    Store Securely
```

## 🤖 AI Model: Google Gemini

**Model:** Google Gemini Pro / Gemini Pro Vision

**What it does:**
- Reads medical document text (from OCR)
- Extracts structured clinical data
- Identifies lab values, diagnoses, medications
- Generates summaries and recommendations
- Provides confidence scores

**Configuration:**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
```

**Usage:**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: "gemini-pro" });

const response = await model.generateContent({
  contents: [{
    role: "user",
    parts: [{
      text: `Extract medical data from this text:\n${ocrText}`
    }]
  }]
});
```

---

## 📋 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **OCR:** Tesseract.js (text extraction from PDFs/images)
- **AI:** Google Gemini API
- **Storage:** File system / AWS S3
- **Encryption:** AES-256
- **Database:** MongoDB (optional)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm run dev

# Server runs on http://localhost:3000
```

---

## 📝 Example Request

**Upload Document:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer token" \
  -F "file=@lab_report.pdf" \
  -F "patientId=pat-123"
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "labResults": [
      { "testName": "HbA1c", "value": 7.2, "unit": "%", "flag": "high" }
    ],
    "diagnoses": ["Type 2 Diabetes"],
    "medications": [
      { "name": "Metformin", "dosage": "1000mg", "frequency": "twice daily" }
    ],
    "summary": "Patient shows elevated HbA1c..."
  }
}
```

---

## 📁 Directory Structure

```
backend/
├── app.js                 # Express app
├── server.js              # Server startup
├── package.json           # Dependencies
├── .env.example           # Environment template
├── routes/
│   ├── upload.route.js    # Document upload endpoint
│   └── prompt.js          # Analysis endpoint
├── services/
│   ├── ocr.service.js     # OCR processing
│   ├── ai.service.js      # Gemini API calls
│   └── storage.service.js # File storage
├── middleware/
│   ├── auth.js            # Authentication
│   └── errorHandler.js    # Error handling
└── uploads/               # Uploaded files
```

---

## 🔐 Security

- ✅ JWT Authentication
- ✅ AES-256 Encryption
- ✅ Secure file upload validation
- ✅ PHI redaction support
- ✅ Audit logging
- ✅ TLS for all connections

---

## ⚠️ Important

**This is NOT a medical diagnosis tool. Always consult healthcare professionals for medical decisions.**

---

## License

MIT
