# 🏥 MediScan Backend — AI-Powered Medical Report Reader

> An intelligent Node.js backend that reads, extracts, and analyzes medical reports using AI and OCR technology. Automatically processes clinical documents (PDFs, images, lab reports) and provides structured health data insights.

**Status:** In Development | **Node.js:** v14+ | **License:** MIT

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Setup & Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Document Processing](#document-processing)
- [AI Integration](#ai-integration)
- [Data Extraction](#data-extraction)
- [Security & Privacy](#security--privacy)
- [Testing](#testing)
- [Deployment](#deployment)
- [Examples](#examples)
- [Limitations & Safety](#limitations--safety)
- [Roadmap](#roadmap)

---

## Overview

### What MediScan Does

MediScan Backend is an **intelligent medical report reader** that:

1. **Receives Medical Documents** — Accepts uploaded medical reports, lab results, prescriptions, and clinical documents in PDF, image, or text format
2. **Extracts Information** — Uses OCR (Optical Character Recognition) and AI to read and understand the medical documents
3. **Structures Data** — Converts unstructured medical text into standardized, machine-readable JSON format
4. **Analyzes Content** — Uses AI language models to interpret clinical findings and extract key health metrics
5. **Provides Insights** — Delivers actionable summaries, flagged abnormal results, and clinical recommendations

### Key Value Propositions

- ⚡ **Fast Document Processing** — Process medical reports in seconds instead of manual review
- 🎯 **Accurate Data Extraction** — AI-powered extraction of clinical findings, lab values, and recommendations
- 🔒 **HIPAA-Compliant** — Built with security and privacy as core requirements
- 🤖 **Intelligent Analysis** — Contextual understanding of medical terminology and clinical significance
- 📊 **Structured Output** — Clean JSON API responses ready for downstream processing

### Target Users

- Healthcare providers and clinics
- Patients managing their own health records
- Health insurance companies
- Clinical research platforms
- EHR (Electronic Health Record) integration partners

---

## ✨ Features

- 📄 **Multi-Format Document Support** — PDFs, images (JPG, PNG), scanned documents, text files
- 🔍 **Optical Character Recognition (OCR)** — Extracts text from images and scanned documents
- 🤖 **AI-Powered Interpretation** — Uses OpenAI/Anthropic to understand and contextualize medical content
- 📋 **Structured Data Extraction** — Automatically identifies and extracts:
  - Patient demographics
  - Lab values and results
  - Vital signs
  - Diagnoses and clinical findings
  - Medications and prescriptions
  - Dates and timestamps
- 🚩 **Automatic Flagging** — Highlights abnormal results and critical values
- 💾 **Secure Storage** — Encrypted document storage with access controls
- 🔗 **API Ready** — RESTful endpoints for easy integration
- 📊 **Structured JSON Output** — Clean, machine-readable format
- 🔐 **HIPAA Compliance** — Privacy-by-design architecture
- 📈 **Trend Tracking** — Historical comparison when multiple reports uploaded
- ⚡ **Batch Processing** — Handle multiple document uploads simultaneously

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js v14+ | Server-side JavaScript execution |
| **Framework** | Express.js | HTTP API server |
| **OCR** | Tesseract.js / AWS Textract | Extract text from images/PDFs |
| **PDF Processing** | pdf-lib, pdfjs-dist | Parse and process PDF documents |
| **AI/LLM** | OpenAI GPT-4 / Anthropic Claude | Medical document analysis |
| **File Storage** | Local filesystem / AWS S3 | Secure document storage |
| **Database** | MongoDB / PostgreSQL (optional) | Document metadata & history |
| **Authentication** | JWT / API Keys | Secure API access |
| **Encryption** | AES-256, TLS 1.2+ | Data security at rest & in transit |
| **Validation** | Joi / Zod | Input validation |
| **Logging** | Winston / Pino | Audit trails and monitoring |

---

## 📁 Repository Structure

```
backend/
├── app.js                         # Express app initialization
├── server.js                      # Server startup
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── ReadMe.md                      # This file
│
├── routes/
│   ├── upload.route.js            # POST /api/documents/upload - Document upload
│   └── prompt.js                  # POST /api/documents/analyze - AI analysis
│
├── models/
│   ├── user.model.js              # User schema
│   └── document.model.js           # Document storage schema (optional)
│
├── services/
│   ├── ocr.service.js             # OCR text extraction
│   ├── ai.service.js              # AI document analysis
│   ├── parser.service.js          # Parse clinical data
│   └── storage.service.js         # File storage management
│
├── utils/
│   ├── validators.js              # Input validation
│   ├── formatters.js              # Response formatting
│   ├── logger.js                  # Logging service
│   └── encryption.js              # Data encryption
│
├── config/
│   ├── ocr.config.js              # OCR settings
│   ├── ai.config.js               # AI provider config
│   └── reference.data.js           # Clinical reference ranges
│
├── middleware/
│   ├── auth.js                    # Authentication
│   ├── errorHandler.js            # Error handling
│   └── validation.js              # Request validation
│
├── uploads/                       # 📂 Document storage
├── logs/                          # 📂 Application logs
└── tests/                         # 📂 Unit & integration tests
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js:** v14 or higher
- **npm** or **yarn**
- **Optional:** MongoDB, PostgreSQL, or Redis for production
- **Optional:** OpenAI, Anthropic, or Hugging Face API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mediscan.git
   cd mediscan/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Create uploads directory** (if not exists)
   ```bash
   mkdir -p uploads
   chmod 700 uploads
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

6. **Verify the server is running**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# AI Provider (Choose one)
AI_PROVIDER=openai                    # 'openai' or 'anthropic'
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
ANTHROPIC_API_KEY=claude-...

# OCR Configuration
OCR_ENGINE=tesseract                 # 'tesseract' or 'aws-textract'
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1

# File Upload Settings
MAX_FILE_SIZE=50485760               # 50MB
ALLOWED_DOCUMENT_TYPES=pdf,jpg,png,jpeg,tiff
UPLOAD_DIR=./uploads
SECURE_UPLOAD=true

# Database (Optional)
MONGODB_URI=mongodb://localhost:27017/mediscan
POSTGRES_URL=postgresql://user:pass@localhost:5432/mediscan

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key-32-chars
ENCRYPTION_ALGORITHM=aes-256-cbc

# HIPAA & Compliance
HIPAA_MODE=true
AUDIT_LOG_PATH=./logs/audit.log
PHI_RETENTION_DAYS=365
DATA_ANONYMIZATION=true

# API Rate Limiting
RATE_LIMIT_WINDOW=15               # minutes
RATE_LIMIT_MAX_REQUESTS=100        # requests per window
```

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server listen port | `3000` |
| `AI_PROVIDER` | Which AI service to use | `openai` or `anthropic` |
| `OCR_ENGINE` | Text extraction tool | `tesseract` or `aws-textract` |
| `MAX_FILE_SIZE` | Max document size in bytes | `50485760` (50MB) |
| `HIPAA_MODE` | Enable compliance features | `true` or `false` |

---

## 🔌 API Endpoints

### 1. **POST /api/documents/upload** — Upload Medical Document

Upload a medical report (PDF, image, etc.) for AI analysis.

**Request:**
```
Content-Type: multipart/form-data

Form Fields:
- file: <binary file> (required)
- patientId: string (optional)
- documentType: "lab_report" | "prescription" | "medical_record" | "imaging" | "other"
- metadata: { dateOfService, provider, etc. } (optional)
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer your-token" \
  -F "file=@/path/to/lab_report.pdf" \
  -F "patientId=pat-12345" \
  -F "documentType=lab_report"
```

**Response:**
```json
{
  "success": true,
  "documentId": "doc-abc123xyz",
  "fileName": "lab_report_2025-01.pdf",
  "uploadedAt": "2025-01-11T10:30:22Z",
  "processingStatus": "processing",
  "fileSize": 2048576,
  "pages": 3,
  "estimatedProcessingTime": "30 seconds"
}
```

---

### 2. **POST /api/documents/analyze** — Analyze Uploaded Document

Get AI-powered analysis and extracted data from an uploaded document.

**Request:**
```json
{
  "documentId": "doc-abc123xyz",
  "analysisLevel": "detailed",
  "includeRawText": false,
  "focusAreas": ["lab_values", "diagnoses", "medications"]
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "doc-abc123xyz",
  "analysis": {
    "documentType": "lab_report",
    "processingTime": "2.3s",
    "confidence": 0.94,
    "extractedData": {
      "patientInfo": {
        "name": "[REDACTED]",
        "dob": "[REDACTED]",
        "mrn": "[REDACTED]"
      },
      "labResults": [
        {
          "testName": "Hemoglobin A1c",
          "value": 7.2,
          "unit": "%",
          "referenceRange": "4.0-5.6%",
          "flag": "high",
          "severity": "moderate"
        },
        {
          "testName": "Glucose (Fasting)",
          "value": 145,
          "unit": "mg/dL",
          "referenceRange": "70-100 mg/dL",
          "flag": "high",
          "severity": "moderate"
        }
      ],
      "vitals": {
        "bloodPressure": "145/92",
        "heartRate": 78,
        "temperature": "98.6F"
      },
      "diagnoses": [
        "Type 2 Diabetes Mellitus",
        "Hypertension",
        "Hyperlipidemia"
      ],
      "medications": [
        {
          "name": "Metformin",
          "dosage": "1000mg",
          "frequency": "twice daily"
        },
        {
          "name": "Lisinopril",
          "dosage": "10mg",
          "frequency": "once daily"
        }
      ]
    },
    "summary": "Patient presents with elevated glucose levels (145 mg/dL) and HbA1c at 7.2%, indicating suboptimal diabetes control. Blood pressure elevated at 145/92. Current medications appear appropriate but may require dosage adjustment.",
    "flaggedAbnormalities": [
      "Elevated HbA1c (7.2%)",
      "Elevated Fasting Glucose (145 mg/dL)",
      "Elevated Blood Pressure (145/92)"
    ],
    "recommendations": [
      "Increase metformin dosage or add second-line agent",
      "Consider lifestyle modifications (diet, exercise)",
      "Monitor BP and consider adjustment to lisinopril",
      "Follow-up labs in 3 months"
    ],
    "clinicalNotes": "Results consistent with Type 2 Diabetes. Continue monitoring and optimize glycemic control.",
    "riskAssessment": {
      "cardiovascular": 0.68,
      "kidney_disease": 0.32,
      "diabetic_complications": 0.45
    }
  },
  "timestamp": "2025-01-11T10:32:45Z",
  "disclaimer": "⚠️ This analysis is AI-generated and for informational purposes only. Not a substitute for professional medical advice."
}
```

---

### 3. **GET /api/documents/:id** — Get Document Details

Retrieve processed document and analysis results.

**Response:**
```json
{
  "documentId": "doc-abc123xyz",
  "patientId": "pat-12345",
  "fileName": "lab_report_2025-01.pdf",
  "documentType": "lab_report",
  "uploadedAt": "2025-01-11T10:30:22Z",
  "processedAt": "2025-01-11T10:32:45Z",
  "status": "completed",
  "analysis": { /* same as analyze response */ }
}
```

---

### 4. **GET /api/documents** — List Patient Documents

Get all documents for a patient.

**Query Parameters:**
- `patientId` (required)
- `limit` (default: 10)
- `skip` (default: 0)
- `documentType` (optional filter)

**Response:**
```json
{
  "success": true,
  "patientId": "pat-12345",
  "totalDocuments": 5,
  "documents": [
    {
      "documentId": "doc-abc123xyz",
      "fileName": "lab_report_2025-01.pdf",
      "documentType": "lab_report",
      "uploadedAt": "2025-01-11T10:30:22Z",
      "processedAt": "2025-01-11T10:32:45Z"
    }
  ]
}
```

---

### 5. **POST /api/documents/batch** — Batch Upload & Process

Upload and process multiple documents at once.

**Request:**
```
Content-Type: multipart/form-data

Form Fields:
- files: [file1, file2, file3] (multiple files)
- patientId: string
```

**Response:**
```json
{
  "success": true,
  "patientId": "pat-12345",
  "uploadedCount": 3,
  "documents": [
    { "documentId": "doc-1", "status": "processing" },
    { "documentId": "doc-2", "status": "processing" },
    { "documentId": "doc-3", "status": "processing" }
  ]
}
```

---

## 📊 How It Works

### Document Processing Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER UPLOADS MEDICAL DOCUMENT (PDF, Image, etc.)          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. FILE VALIDATION & SECURITY SCAN                           │
│  - Check file type & size                                    │
│  - Scan for malware                                          │
│  - Validate MIME type                                        │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. OCR PROCESSING (Extract Text)                             │
│  - PDF → Text extraction                                     │
│  - Images → Tesseract/AWS Textract                           │
│  - Handle multi-page documents                               │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. AI ANALYSIS & INTERPRETATION                              │
│  - Send text to GPT-4 / Claude                               │
│  - Extract structured clinical data                          │
│  - Identify lab values, diagnoses, medications               │
│  - Generate clinical summary                                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. DATA STRUCTURING & PARSING                                │
│  - Normalize lab values & units                              │
│  - Flag abnormal results                                     │
│  - Match against reference ranges                            │
│  - Extract key metrics                                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. SECURITY & COMPLIANCE                                     │
│  - Remove/redact PHI if needed                               │
│  - Encrypt sensitive data                                    │
│  - Log access for audit trail                                │
│  - Secure storage                                            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. RETURN STRUCTURED JSON RESPONSE                           │
│  - Extracted clinical data                                   │
│  - AI analysis & recommendations                             │
│  - Flagged abnormalities                                     │
│  - Risk assessments                                          │
└──────────────────────────────────────────────────────────────┘
```

### Example: What Happens When You Upload a Lab Report PDF

**Input:** Scanned/PDF lab report from hospital

**MediScan Does:**
1. Reads PDF file and extracts text using OCR
2. Sends extracted text to GPT-4 with a specialized prompt
3. GPT-4 identifies all lab values, reference ranges, and clinical findings
4. Backend parses response and structures data
5. Compares lab values against reference ranges
6. Flags abnormal results (high/low)
7. Returns clean JSON with all extracted information

**Output:** Structured JSON with patient labs, vital signs, diagnoses, medications, and AI-generated summary

---

## 📄 Document Processing

### Supported Document Types

| Document Type | Format | Details |
|---------------|--------|---------|
| **Lab Reports** | PDF, Image | Blood work, urinalysis, pathology |
| **Prescriptions** | PDF, Image | Medication details, dosages |
| **Clinical Notes** | PDF, Text | Doctor's notes, observations |
| **Discharge Summaries** | PDF | Hospital discharge info |
| **Imaging Reports** | PDF, Image | X-ray, CT, MRI findings |
| **Vital Signs Sheets** | PDF, Image | Blood pressure, temperature logs |
| **Medical Records** | PDF | Historical medical data |

### File Size & Format Limits

```env
MAX_FILE_SIZE=50485760                    # 50MB
ALLOWED_FORMATS=pdf,jpg,png,jpeg,tiff,txt
MAX_PAGES_PER_PDF=50
OCR_TIMEOUT=120000                        # 2 minutes
```

### What Gets Extracted

The AI automatically identifies and extracts:

```json
{
  "patientDemographics": {
    "name": "...",           // [REDACTED in HIPAA mode]
    "dateOfBirth": "...",
    "mrn": "...",
    "age": "..."
  },
  "labResults": {
    "testName": "...",
    "value": "...",
    "unit": "...",
    "referenceRange": "...",
    "flag": "high|normal|low",
    "abnormal": true|false
  },
  "vitals": {
    "bloodPressure": "...",
    "heartRate": "...",
    "temperature": "...",
    "respiratoryRate": "..."
  },
  "diagnoses": ["...", "..."],
  "medications": [
    {
      "name": "...",
      "dosage": "...",
      "frequency": "...",
      "route": "..."
    }
  ],
  "procedures": ["...", "..."],
  "testDate": "2025-01-11",
  "resultDate": "2025-01-11"
}
```

---

## 🤖 AI Integration

### How AI Analyzes Documents

1. **Prompt Engineering** — Specialized prompts guide AI to extract medical data
2. **Structured Output** — AI returns JSON-formatted clinical data
3. **Context Awareness** — Model understands medical terminology and significance
4. **Confidence Scores** — Each extraction includes confidence level
5. **Error Handling** — Gracefully handles ambiguous or unclear sections

### Supported AI Providers

```javascript
// Switch providers easily via .env
if (process.env.AI_PROVIDER === 'openai') {
  // Use GPT-4 for analysis
} else if (process.env.AI_PROVIDER === 'anthropic') {
  // Use Claude for analysis
}
```

| Provider | Model | Cost | Speed | Best For |
|----------|-------|------|-------|----------|
| **OpenAI** | GPT-4 / GPT-4o | $$$ | Fast | Complex medical documents |
| **Anthropic** | Claude 3.5 | $$$ | Fast | Detailed analysis |
| **Google** | Gemini Pro | $$ | Medium | Multi-modal input |
| **Local** | Llama 2 | Free | Slow | On-premises deployment |

### AI Prompt Example

```javascript
const prompt = `
You are an expert medical document analyzer. Your task is to:

1. Extract all lab values with units and reference ranges
2. Identify all diagnoses mentioned
3. List all medications with dosages
4. Extract vital signs
5. Note any abnormal findings

Return the data STRICTLY as valid JSON (no markdown, no code blocks).
Use this structure:
{
  "labResults": [],
  "diagnoses": [],
  "medications": [],
  "vitals": {},
  "abnormalFindings": [],
  "clinicalSummary": ""
}

Text to analyze:
[${documentText}]
`;
```

---

## 📋 Data Extraction

### What Gets Automatically Extracted

When MediScan processes a medical document, it extracts:

#### Lab Results
- Test name (e.g., "Hemoglobin A1c")
- Value (e.g., 7.2)
- Unit (e.g., %)
- Reference range (e.g., 4.0-5.6%)
- Flag status (high/normal/low)
- Abnormality severity

#### Vital Signs
- Blood pressure (e.g., 145/92)
- Heart rate (e.g., 78 bpm)
- Temperature (e.g., 98.6°F)
- Respiratory rate
- BMI / Weight

#### Clinical Information
- Diagnoses (e.g., "Type 2 Diabetes")
- Chief complaints
- History of present illness
- Past medical history
- Medications & dosages
- Allergies
- Procedures performed

#### Document Metadata
- Test date
- Result date
- Provider name
- Facility name
- Report type

### Extraction Confidence Scores

Each extracted field includes a confidence score (0.0 - 1.0):

```json
{
  "field": "HbA1c",
  "value": 7.2,
  "unit": "%",
  "confidence": 0.98,      // 98% confident in this extraction
  "source": "Lab Results table, Row 3"
}
```

---

## 🔒 Security & Privacy

### HIPAA Compliance

MediScan is built with HIPAA requirements in mind:

- ✅ **Encryption at Rest** — AES-256 for stored documents
- ✅ **Encryption in Transit** — TLS 1.2+ for all connections
- ✅ **Access Control** — Authentication & authorization
- ✅ **Audit Logging** — All access logged with timestamps
- ✅ **Data Minimization** — Only necessary data processed
- ✅ **PHI Redaction** — Automatic redaction of sensitive info
- ✅ **Data Retention** — Configurable retention policies
- ✅ **Business Associate Agreements** — Vendor compliance

### PHI (Protected Health Information) Handling

```javascript
// In HIPAA_MODE, sensitive data is automatically redacted
if (process.env.HIPAA_MODE === 'true') {
  extractedData.patientName = "[REDACTED]";
  extractedData.ssn = "[REDACTED]";
  extractedData.mrn = "[REDACTED]";
  extractedData.dateOfBirth = "[REDACTED]";
  extractedData.address = "[REDACTED]";
}

// Store encrypted
const encrypted = encryptWithAES256(sensitiveData);
```

### Data Storage Security

```bash
# Uploaded documents stored with encryption
/uploads/[encrypted-filename].enc

# Access logs maintained
/logs/audit.log

# Retention policy enforced
# PHI deleted after 365 days (configurable)
```

### Authentication

```javascript
// All API endpoints require authentication
app.use(authenticateToken);  // Middleware checks JWT

// Example: Include token in requests
Authorization: Bearer eyJhbGc...
```

---

## ✅ Testing

### Unit Tests

Test OCR, parsing, and AI response handling:

```bash
npm test

# Run specific test
npm test -- ocr.service.test.js
npm test -- ai.service.test.js

# Coverage report
npm run test:coverage
```

### Integration Tests

Test full document processing pipeline:

```bash
# Test upload endpoint
npm run test:integration

# Test with sample documents
npm run test:e2e
```

### Manual Testing

```bash
# Start server in dev mode
npm run dev

# In another terminal, test upload
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer test-token" \
  -F "file=@sample_lab_report.pdf"
```

---

## 🚢 Deployment

### Quick Start (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/your-org/mediscan.git
cd mediscan/backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys

# 4. Start server
npm run dev

# Server runs at http://localhost:3000
```

### Docker Deployment

```bash
# Build image
docker build -t mediscan-backend:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  --name mediscan-backend \
  mediscan-backend:latest

# View logs
docker logs -f mediscan-backend
```

### Docker Compose (Full Stack)

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/mediscan
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: mediscan

volumes:
  mongo-data:
```

Run: `docker-compose up -d`

### Production Deployment (PM2)

```bash
npm install -g pm2

# Start application
pm2 start app.js --name "mediscan-backend" --instances 4

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs mediscan-backend
```

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=3000
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
HIPAA_MODE=true
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## 📝 Examples

### Complete Upload & Analysis Example

#### Step 1: Upload a Medical Document

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@lab_report.pdf" \
  -F "patientId=pat-12345" \
  -F "documentType=lab_report"
```

**Response:**
```json
{
  "success": true,
  "documentId": "doc-abc123",
  "fileName": "lab_report.pdf",
  "uploadedAt": "2025-01-11T10:30:00Z",
  "processingStatus": "processing"
}
```

#### Step 2: Get Analysis Results

```bash
curl -X POST http://localhost:3000/api/documents/analyze \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "doc-abc123",
    "analysisLevel": "detailed"
  }'
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "documentType": "lab_report",
    "confidence": 0.96,
    "extractedData": {
      "labResults": [
        {
          "testName": "Hemoglobin A1c",
          "value": 7.2,
          "unit": "%",
          "referenceRange": "4.0-5.6%",
          "flag": "high",
          "severity": "moderate"
        }
      ],
      "diagnoses": ["Type 2 Diabetes"],
      "medications": [
        { "name": "Metformin", "dosage": "1000mg", "frequency": "twice daily" }
      ]
    },
    "summary": "Lab results show elevated HbA1c indicating suboptimal diabetes control.",
    "recommendations": [
      "Optimize diabetes medication regimen",
      "Increase physical activity",
      "Schedule 3-month follow-up"
    ]
  }
}
```

### Node.js / JavaScript Integration

```javascript
const axios = require('axios');

async function analyzePatientLabReport() {
  const client = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Authorization': `Bearer ${process.env.JWT_TOKEN}`
    }
  });

  try {
    // Upload document
    const uploadResponse = await client.post('/api/documents/upload', 
      { /* multipart form data */ }
    );
    const { documentId } = uploadResponse.data;

    // Get analysis
    const analysisResponse = await client.post('/api/documents/analyze', {
      documentId,
      analysisLevel: 'detailed'
    });

    console.log('Analysis:', analysisResponse.data.analysis);
    return analysisResponse.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

analyzePatientLabReport();
```

### Python Integration

```python
import requests
import json

API_TOKEN = "your-jwt-token"
BASE_URL = "http://localhost:3000"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
}

# Upload document
files = {'file': open('lab_report.pdf', 'rb')}
data = {
    'patientId': 'pat-12345',
    'documentType': 'lab_report'
}

upload_response = requests.post(
    f"{BASE_URL}/api/documents/upload",
    headers=headers,
    files=files,
    data=data
)

document_id = upload_response.json()['documentId']

# Get analysis
analysis_response = requests.post(
    f"{BASE_URL}/api/documents/analyze",
    headers=headers,
    json={
        'documentId': document_id,
        'analysisLevel': 'detailed'
    }
)

print(json.dumps(analysis_response.json(), indent=2))
```

---

## ⚠️ Limitations & Safety

### Important Medical Disclaimers

🚨 **This tool is NOT a medical diagnosis system. It is for informational and educational purposes only.**

All API responses include this disclaimer:

> "This analysis is AI-generated and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with a licensed healthcare provider for medical decisions. MediScan may contain errors or omissions."

### What MediScan Can Do ✅

- Extract and structure medical data from documents
- Identify lab values and their reference ranges
- Flag abnormal results
- Summarize clinical findings
- Suggest follow-up actions
- Track trends over multiple documents

### What MediScan Cannot Do ❌

- Provide medical diagnoses
- Replace clinical judgment
- Prescribe medications
- Diagnose diseases
- Provide emergency medical advice
- Replace licensed healthcare providers

### Safety Guardrails in Place

#### 1. Automatic Output Filtering
```javascript
// Remove definitive medical claims
output = output.replace(/\byou have diabetes\b/gi, "results may indicate diabetes");
output = output.replace(/\bdiagnosed? with\b/gi, "may have");
```

#### 2. Confidence Thresholds
- Only surface high-confidence extractions (>0.85)
- Flag low-confidence results for manual review

#### 3. Critical Value Alerts
- Glucose < 50 mg/dL → Emergency alert
- Potassium > 6.5 mEq/L → Critical alert
- Hemoglobin < 7 g/dL → Critical alert

#### 4. Mandatory Disclaimers
Every response includes medical disclaimers and recommendations to consult healthcare providers.

### Known Limitations

| Limitation | Impact | Workaround |
|-----------|--------|-----------|
| OCR accuracy varies by document quality | May miss text from poor scans | Provide high-quality documents |
| Handwritten notes hard to read | May not extract handwritten data | Prefer typed/digital documents |
| Context-dependent values | May misinterpret values without full context | Review extracted data |
| Ambiguous lab names | May match wrong reference range | Manual verification recommended |
| AI can hallucinate | May generate incorrect data | Always verify with original document |

### Recommendations for Safe Use

1. **Always Verify** — Compare AI-extracted data with original document
2. **Clinical Review** — Have healthcare professionals review results
3. **Full Context** — Don't rely on single documents; consider medical history
4. **Emergency Care** — For urgent medical issues, call 911 or go to ER
5. **Professional Advice** — Always consult licensed healthcare providers for medical decisions

---

## 🚀 Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Basic file upload (PDF, images)
- [x] OCR text extraction
- [x] AI-powered document analysis
- [x] Lab value extraction
- [x] Basic API endpoints
- [x] HIPAA-compliant architecture

### Phase 2: Enhanced Features 🔄 (Next)
- [ ] Multi-page document handling
- [ ] Handwriting recognition
- [ ] Medication interaction checking
- [ ] Historical trend analysis
- [ ] Batch document processing
- [ ] User authentication system
- [ ] Database persistence (MongoDB)

### Phase 3: Advanced Analytics 📈 (Future)
- [ ] Predictive health insights
- [ ] Comparative analysis (vs. previous reports)
- [ ] Risk scoring algorithms
- [ ] Clinical knowledge base integration
- [ ] Integration with EHR systems
- [ ] Custom report generation
- [ ] Mobile app support

### Phase 4: Production Hardening 🔐 (Long-term)
- [ ] FDA compliance & validation
- [ ] Clinical testing & validation
- [ ] HIPAA certification
- [ ] Penetration testing
- [ ] Performance optimization
- [ ] Global deployment
- [ ] 24/7 support & monitoring

---

## 📚 Resources

### Medical Document Standards
- [HL7 FHIR](https://www.hl7.org/fhir/) — Healthcare data exchange standard
- [LOINC](https://loinc.org/) — Lab test codes and names
- [SNOMED CT](https://www.snomed.org/) — Clinical terminology
- [ICD-10](https://www.cdc.gov/nchs/icd/) — Diagnosis codes

### Technical Documentation
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract) — Open-source OCR
- [AWS Textract](https://aws.amazon.com/textract/) — Document extraction
- [OpenAI API](https://platform.openai.com/docs/) — GPT-4 documentation
- [Express.js](https://expressjs.com/) — Node.js framework

### Security & Compliance
- [HIPAA Compliance](https://www.hhs.gov/hipaa/) — US healthcare privacy law
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Security best practices
- [NIST Cybersecurity](https://www.nist.gov/cyberframework/) — Security framework

---

## 💡 Contributing

Contributions welcome! To contribute:

```bash
# 1. Fork the repository
git clone https://github.com/your-org/mediscan.git

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make changes & commit
git commit -m "Add your feature"

# 4. Push & create PR
git push origin feature/your-feature
```

### Code Standards
- ESLint for code quality
- Jest for testing (>80% coverage)
- JSDoc comments for all functions
- HIPAA compliance checks

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/mediscan/issues)
- **Email:** support@mediscan.io
- **Docs:** [docs.mediscan.io](https://docs.mediscan.io)

---

**Status:** Active Development  
**Last Updated:** January 2026  
**Maintainers:** MediScan Team

---

## Disclaimer

MediScan is a tool for document analysis and information structuring. It is NOT medical software and does NOT provide medical diagnoses or clinical advice. Always consult qualified healthcare professionals for medical decisions.

