# 🏥 MediScan Backend — AI-Powered Clinical Insights

> A Node.js backend for medical data ingestion, AI-driven biomarker analysis, and secure clinical insights generation.

**Status:** In Development | **Node.js:** v14+ | **License:** MIT

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration--environment)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-model--contracts)
- [AI Integration](#ai--model-integration-design--safety)
- [Biomarker Logic](#biological-interpretation-logic-backend-facing)
- [Security & Compliance](#security-privacy--compliance)
- [File Uploads & Parsing](#uploads-and-parsing)
- [Testing](#testing--validation-backend)
- [Deployment](#deployment--operations)
- [Examples](#example-api-usage)
- [Safety Guidelines](#limitations--clinical-safety)
- [Future Enhancements](#next-steps--enhancements)

---

## Overview

### Purpose

The backend provides:
- **Data Ingestion:** Accepts medical lab reports, CSVs, and structured biomarker data
- **Preprocessing:** Validates, normalizes, and structures health data
- **AI Orchestration:** Routes data to LLM or inference services for clinical insights
- **API Endpoints:** RESTful interfaces for client consumption
- **Analysis Pipeline:** Computes biomarker trends, risk scores, and clinical interpretations

### Audience

Backend engineers, data scientists, DevOps engineers, clinical informaticians

### Use Case

Enable healthcare providers and patients to upload lab results and receive AI-powered clinical interpretations with biomarker trend analysis and risk assessments.

---

## ✨ Features

- ✅ **Multi-Format Upload Support** — CSV, lab reports, JSON biomarker data
- ✅ **AI-Powered Analysis** — Integrates with OpenAI, Anthropic, or local LLMs
- ✅ **Biomarker Normalization** — Standardizes lab units and reference ranges
- ✅ **Clinical Flagging** — Automatically flags abnormal values with severity levels
- ✅ **Risk Scoring** — Computes clinical risk scores (Framingham, ASCVD, etc.)
- ✅ **Drug-Interaction Checking** — Cross-references medications with biomarkers
- ✅ **HIPAA-Ready Architecture** — Designed for PHI handling with encryption and audit logging
- ✅ **Model-Agnostic Design** — Swap AI providers without code changes
- ✅ **Trend Analysis** — Tracks biomarker changes over time
- ✅ **Post-Processing Guardrails** — Prevents unsafe clinical claims in AI output

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js v14+ | Server-side JavaScript execution |
| **Framework** | Express.js | HTTP server & middleware |
| **File Storage** | File system / S3 (optional) | Upload and parsing |
| **Data Storage** | Optional (MongoDB, PostgreSQL) | Persistent biomarker & patient records |
| **AI Integration** | OpenAI, Anthropic, local LLMs | Inference & clinical analysis |
| **Parsing** | CSV, JSON parsers | Lab data extraction |
| **Authentication** | Bearer tokens / API keys | Secure endpoint access |

---

## 📁 Repository Structure

```
backend/
├── app.js                    # Express app initialization
├── server.js                 # Server startup & configuration
├── package.json              # Dependencies & scripts
├── .env.example              # Environment variables template
├── ReadMe.md                 # This file
├── routes/
│   ├── prompt.js             # POST /api/prompt - AI analysis endpoint
│   └── upload.route.js       # POST /api/uploads - File upload handler
├── models/
│   └── user.model.js         # User schema (extend with DB adapter)
├── middleware/               # (optional) Authentication, error handling
├── utils/                    # (optional) Parsing, normalization, validation
├── config/                   # (optional) Reference ranges, drug interactions
└── uploads/                  # 📂 Uploaded files directory (ensure secure)
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

## ⚙️ Configuration & Environment

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=claude-...
MODEL_PROVIDER=openai  # or 'anthropic', 'huggingface', 'local'

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/mediscan
POSTGRES_URL=postgresql://user:password@localhost:5432/mediscan

# Security
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key

# Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_MIME_TYPES=text/csv,application/pdf,application/json

# HIPAA Compliance
HIPAA_MODE=true
AUDIT_LOG_PATH=./logs/audit.log
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MODEL_PROVIDER_KEY` | AI provider API key | `sk-...` |
| `MONGODB_URI` | Database connection | `mongodb://...` |
| `HIPAA_MODE` | Enable compliance logging | `true` |

---

## 🔌 API Endpoints

All endpoints require authentication. Use `Authorization: Bearer <token>` header.

### 1. **POST /api/prompt** — AI Analysis Request

Submits biomarker data for AI-powered clinical interpretation.

**Request:**
```json
{
  "patientId": "pat-12345",
  "context": {
    "age": 62,
    "sex": "male",
    "medications": ["lisinopril", "atorvastatin"],
    "comorbidities": ["hypertension", "type-2-diabetes"]
  },
  "biomarkers": [
    {
      "name": "HbA1c",
      "abbreviation": "HbA1c",
      "value": 7.2,
      "unit": "%",
      "timestamp": "2025-11-28T10:00:00Z",
      "referenceRange": {
        "low": 4.0,
        "high": 5.6,
        "units": "%",
        "population": "general"
      }
    },
    {
      "name": "Total Cholesterol",
      "value": 245,
      "unit": "mg/dL",
      "timestamp": "2025-11-28T10:00:00Z"
    }
  ],
  "instructions": "Provide plain-language interpretation of these results, identify at-risk biomarkers, and suggest next steps."
}
```

**Response:**
```json
{
  "success": true,
  "patientId": "pat-12345",
  "analysis": {
    "summary": "Patient shows elevated HbA1c indicating suboptimal diabetes control. Cholesterol levels are high; recommend lipid management.",
    "riskFactors": ["elevated-glucose", "high-cholesterol"],
    "recommendations": [
      "Increase medication adherence for diabetes control",
      "Consider statin therapy optimization",
      "Schedule follow-up in 3 months"
    ],
    "confidence": 0.92
  },
  "timestamp": "2025-11-28T10:15:22Z"
}
```

**Status Codes:**
- `200` — Success
- `400` — Invalid payload
- `401` — Unauthorized
- `500` — Server error

---

### 2. **POST /api/uploads** — Lab Data Upload

Accepts file uploads (CSV, PDF, JSON) and extracts biomarker data.

**Request:**
```
Content-Type: multipart/form-data

Form fields:
- file: <binary file>
- patientId: "pat-12345" (optional)
- fileType: "csv" | "pdf" | "json"
```

**Response:**
```json
{
  "success": true,
  "fileId": "upload-98765",
  "patientId": "pat-12345",
  "fileName": "lab_results_2025-11.csv",
  "uploadedAt": "2025-11-28T10:20:00Z",
  "biomarkersExtracted": 15,
  "biomarkers": [
    {
      "id": "bm-001",
      "name": "Glucose",
      "value": 145,
      "unit": "mg/dL",
      "flag": "high"
    }
  ],
  "parseErrors": [],
  "warnings": []
}
```

**Supported Formats:**
- CSV with headers: `biomarker_name, value, unit, reference_low, reference_high`
- JSON with biomarker array
- PDF lab reports (requires OCR integration)

---

### 3. **GET /api/patient/:id/summary** — Patient Summary

Returns latest biomarkers, trends, and risk scores.

**Response:**
```json
{
  "patientId": "pat-12345",
  "lastUpdated": "2025-11-28T10:00:00Z",
  "latestBiomarkers": [
    {
      "name": "HbA1c",
      "value": 7.2,
      "unit": "%",
      "flag": "high",
      "change": "+0.1% (30 days)"
    }
  ],
  "riskScores": {
    "cardiovascular": 0.42,
    "diabetes": 0.65
  }
}
```

---

## 📊 Data Model & Contracts

### Biomarker Object

Represents a single lab measurement with clinical context.

```typescript
interface Biomarker {
  id: string;                    // Unique identifier
  name: string;                  // e.g., "Hemoglobin A1c"
  abbreviation: string;          // e.g., "HbA1c"
  value: number;                 // Measured value
  unit: string;                  // e.g., "%", "mg/dL", "mmol/L"
  timestamp: string;             // ISO 8601 datetime
  referenceRange: {
    low: number;
    high: number;
    units: string;
    population?: string;         // e.g., "general", "adult-male", "pediatric"
  };
  flag: "low" | "normal" | "high";  // Clinical flag based on range
  severity?: "mild" | "moderate" | "severe";  // Deviation intensity
  trend?: "improving" | "stable" | "worsening";  // Temporal change
}
```

### Prompt Payload

Request format for AI analysis.

```typescript
interface PromptPayload {
  patientId?: string;
  context: {
    age: number;
    sex: "male" | "female" | "other";
    medications?: string[];
    comorbidities?: string[];
    allergies?: string[];
  };
  biomarkers: Biomarker[];
  instructions: string;        // What to analyze
  includeRiskScores?: boolean;
  modelHints?: string[];        // e.g., ["focus on diabetes", "check drug interactions"]
}
```

### AI Response Contract

```typescript
interface AnalysisResponse {
  success: boolean;
  patientId?: string;
  analysis: {
    summary: string;            // Plain-language interpretation
    riskFactors: string[];      // Identified risks
    recommendations: string[];  // Clinical next steps
    confidence: number;         // 0–1 confidence score
  };
  flaggedBiomarkers: string[];  // Names of abnormal results
  drugInteractions?: Array<{
    medication: string;
    biomarker: string;
    interaction: string;
  }>;
  timestamp: string;
}
```

---

## 🤖 AI / Model Integration (Design & Safety)

### Architecture Overview

The backend is **model-agnostic** and supports multiple AI providers:

```
┌─────────────────────────────────────────────────┐
│         API Request (POST /api/prompt)          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│     Data Validation & Normalization Layer       │
│  - Validate biomarker data                      │
│  - Check reference ranges                       │
│  - Cross-reference medications                  │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    [OpenAI]   [Anthropic]   [Local LLM]
    (GPT-4)     (Claude)      (Llama)
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│    Post-Processing & Guardrails Layer           │
│  - Remove unsafe clinical claims                │
│  - Add disclaimers                              │
│  - Apply rule-based overrides                   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│         Response (JSON Analysis)                │
└─────────────────────────────────────────────────┘
```

### Supported Providers

| Provider | Model | Cost | Latency | Best For |
|----------|-------|------|---------|----------|
| OpenAI | GPT-4, GPT-4o | $$$ | Low | Complex reasoning |
| Anthropic | Claude 3.5 | $$$ | Low | Safety & reliability |
| Hugging Face | Mistral, Llama 2 | $ | Medium | Self-hosted option |
| Local | Ollama, vLLM | Free | High | On-premise HIPAA |

### Key Design Principles

#### 1. **Data Minimization**
- Send only essential biomarkers to the model
- Exclude raw patient identifiers (use pseudonyms)
- Limit context to relevant clinical history

#### 2. **PHI Separation**
```javascript
// ✅ GOOD: Anonymized data sent to external API
const payload = {
  age: 62,
  biomarkers: [{ name: "HbA1c", value: 7.2 }],
  instructions: "Interpret these results"
};
// Omit: patientId, name, email, insurance

// ❌ BAD: Don't send PHI to untrusted providers
const badPayload = {
  patientId: "12345",
  name: "John Smith",
  ssn: "123-45-6789",
  biomarkers: [...]
};
```

#### 3. **Prompt Engineering**
Construct structured prompts that guide the AI model:

```javascript
const systemPrompt = `You are a clinical assistant. Your role is to:
1. Interpret lab values against reference ranges
2. Identify abnormal results with severity
3. Suggest safe, evidence-based next steps
4. NEVER provide a diagnosis or replace clinical judgment
5. Always recommend consulting a licensed physician`;

const userPrompt = `
Analyze these biomarkers:
- HbA1c: 7.2% (ref: 4.0–5.6%, flag: high)
- Glucose: 145 mg/dL (ref: 70–100, flag: high)

Patient context: 62-year-old male, on metformin.

Please provide interpretation and recommendations.
`;
```

#### 4. **Post-Processing Guardrails**

Apply rule-based checks to ensure safe output:

```javascript
function applySafetyGuardrails(aiOutput) {
  let safe = aiOutput
    .replace(/\bdiagnosis\b/gi, "possible indication")
    .replace(/\bcertain\b/gi, "may indicate")
    .replace(/\byou have\b/gi, "results suggest you may have");

  // Add disclaimer
  safe += "\n\n⚠️ Disclaimer: This analysis is informational only. " +
          "Consult a licensed healthcare provider for medical decisions.";

  return safe;
}
```

### Configuration

Add to `.env`:
```env
MODEL_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
PROMPT_TEMPERATURE=0.3      # Lower = more consistent, deterministic
MAX_TOKENS=1000
SAFETY_GUARDRAILS_ENABLED=true
```

---

## 🧬 Biological Interpretation Logic (Backend-Facing)

This section explains how biomarker values are interpreted programmatically. Critical for data scientists and backend engineers.

### Reference Ranges & Contextualization

Many biomarkers have **age-**, **sex-**, and **method-specific ranges**. Implement flexible reference storage:

```json
{
  "biomarkers": {
    "HbA1c": {
      "displayName": "Hemoglobin A1c",
      "unit": "%",
      "references": {
        "general": { "low": 4.0, "high": 5.6 },
        "diabetic-control": { "low": 0, "high": 7.0 },
        "elderly-70plus": { "low": 4.0, "high": 8.0 }
      }
    },
    "Hemoglobin": {
      "displayName": "Hemoglobin",
      "unit": "g/dL",
      "references": {
        "adult-male": { "low": 13.5, "high": 17.5 },
        "adult-female": { "low": 12.0, "high": 15.5 },
        "pediatric-5to12": { "low": 11.5, "high": 15.5 }
      }
    }
  }
}
```

**Best Practice:** Tag missing reference ranges as `"reference_not_available"` and flag for clinical review.

### Flagging Rules

Implement multi-level flagging based on deviation severity:

```javascript
function flagBiomarker(biomarker, referenceRange) {
  const { value, low, high } = { value: biomarker.value, ...referenceRange };

  // Determine base flag
  let flag = "normal";
  if (value < low) flag = "low";
  if (value > high) flag = "high";

  // Calculate severity
  let severity = undefined;
  if (flag !== "normal") {
    const range = high - low;
    const deviation = flag === "low" ? 
      ((low - value) / range) : 
      ((value - high) / range);

    if (deviation < 0.1) severity = "mild";
    else if (deviation < 0.3) severity = "moderate";
    else severity = "severe";
  }

  return { flag, severity };
}
```

### Temporal Analysis

Track changes across time intervals:

```javascript
function analyzeTrend(historicalValues) {
  if (historicalValues.length < 2) return "insufficient-data";

  const latest = historicalValues[0];
  const previous = historicalValues[1];
  const delta = latest.value - previous.value;
  const pctChange = (delta / previous.value) * 100;

  if (Math.abs(pctChange) < 2) return "stable";
  if (pctChange > 0) return "worsening";
  return "improving";
}

// Example: HbA1c 5.9% → 6.6% is flagged differently than stable 6.6%
```

### Risk Score Calculation

Implement validated clinical calculators:

```javascript
function calculateFraminghamRisk(patient) {
  // Framingham Cardiovascular Risk Score
  const {
    age, sex, totalCholesterol, hdl, sbp, 
    isOnBP, isSmoker, hasDiabetes
  } = patient;

  // Points calculation (simplified)
  let points = 0;
  points += age < 40 ? 0 : age < 50 ? 1 : 2;
  points += totalCholesterol < 160 ? -2 : totalCholesterol > 240 ? 2 : 0;
  points += hdl > 60 ? -2 : hdl < 40 ? 2 : 0;
  // ... more risk factors

  // Convert to 10-year risk percentage
  return calculateRiskPercentage(points);
}
```

### Drug–Biomarker Interactions

Maintain a lookup table for common interactions:

```json
{
  "drugInteractions": {
    "atorvastatin": {
      "affects": ["total-cholesterol", "ldl", "triglycerides"],
      "expected": {
        "total-cholesterol": "decreases 20–30%",
        "ldl": "decreases 30–40%"
      }
    },
    "metformin": {
      "affects": ["glucose", "hba1c"],
      "expected": { "glucose": "decreases 15–30%" }
    },
    "lisinopril": {
      "affects": ["creatinine", "potassium"],
      "caution": "May increase creatinine; monitor kidney function"
    }
  }
}
```

---

## 🔒 Security, Privacy & Compliance

### HIPAA Compliance (if handling PHI)

- **Encryption at Rest:** Use AES-256 for sensitive data storage
- **Encryption in Transit:** Enforce TLS 1.2+ for all connections
- **Access Control:** Implement role-based access control (RBAC)
- **Audit Logging:** Log all access with timestamps and user IDs
- **Data Retention:** Define and enforce data retention policies
- **Business Associate Agreements (BAAs):** Ensure all vendors (AI providers, cloud hosts) are HIPAA-compliant

### Data Minimization

**Principle:** Only collect, process, and store data necessary for the use case.

```javascript
// ✅ GOOD: Send minimal data
const minimalPayload = {
  age: 62,
  biomarkers: [{ name: "HbA1c", value: 7.2, unit: "%" }],
  instructions: "Interpret results"
};

// ❌ BAD: Include unnecessary PHI
const excessivePayload = {
  patientId: "12345",
  firstName: "John",
  lastName: "Smith",
  ssn: "123-45-6789",
  email: "john@example.com",
  address: "123 Main St, Anytown, USA",
  ...
};
```

### PHI Handling Best Practices

1. **Use Pseudonymization**
   ```javascript
   // Hash patient IDs
   const patientHash = sha256(patientId + salt);
   // Never log real identifiers
   ```

2. **Separate Storage**
   ```
   Secure Database (HIPAA) ← → Patient Identifiers
   |
   De-identified Data ← → AI Provider (may not be HIPAA)
   ```

3. **Access Logs**
   ```javascript
   // Log all PHI access
   logger.audit({
     timestamp: new Date(),
     userId: req.user.id,
     action: "PHI_READ",
     resource: "patient_labs",
     patientHash: hash(patientId),
     ipAddress: req.ip
   });
   ```

### Audit & Logging

Enable comprehensive audit trails:

```javascript
const auditLog = {
  timestamp: "2025-11-28T10:15:22Z",
  userId: "user-456",
  action: "PROMPT_SUBMITTED",
  resourceId: "pat-hash-123",
  status: "success",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  additionalInfo: {
    biomarkersProcessed: 5,
    aiProvider: "openai",
    responseTime: "1200ms"
  }
};
```

### Environment-Based Security

```bash
# .env.production
HIPAA_MODE=true
AUDIT_LOG_PATH=/var/log/mediscan/audit.log
ENCRYPTION_KEY_PATH=/secure/vault/encryption.key
DB_SSL=true
API_RATE_LIMIT=100  # requests per minute
REQUIRE_API_KEY=true
```

---

## 📤 Uploads and Parsing

### File Upload Validation

Implement strict validation for all uploaded files:

```javascript
const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024,      // 10 MB
  allowedMimeTypes: [
    "text/csv",
    "application/json",
    "application/pdf"
  ],
  allowedExtensions: [".csv", ".json", ".pdf"]
};

function validateUpload(file) {
  // Check size
  if (file.size > uploadConfig.maxFileSize) {
    throw new Error("File exceeds maximum size");
  }

  // Check MIME type
  if (!uploadConfig.allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Invalid file type");
  }

  // Check extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!uploadConfig.allowedExtensions.includes(ext)) {
    throw new Error("Invalid file extension");
  }

  return true;
}
```

### CSV Parsing Example

Expected CSV format:

```csv
biomarker_name,value,unit,reference_low,reference_high,date
HbA1c,7.2,%,4.0,5.6,2025-11-28
Glucose,145,mg/dL,70,100,2025-11-28
Creatinine,1.1,mg/dL,0.7,1.3,2025-11-28
```

Parsing logic:

```javascript
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const biomarkers = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        biomarkers.push({
          name: row.biomarker_name,
          value: parseFloat(row.value),
          unit: row.unit,
          timestamp: new Date(row.date).toISOString(),
          referenceRange: {
            low: parseFloat(row.reference_low),
            high: parseFloat(row.reference_high)
          }
        });
      })
      .on("end", () => resolve(biomarkers))
      .on("error", reject);
  });
}
```

### Upload Response

```json
{
  "success": true,
  "uploadId": "upload-98765",
  "fileName": "lab_results_2025-11.csv",
  "uploadedAt": "2025-11-28T10:20:00Z",
  "status": "processed",
  "biomarkersExtracted": 15,
  "parseErrors": [],
  "warnings": [
    "Row 5: Missing reference range for 'TSH' — using default",
    "Row 8: Timestamp invalid; using upload date"
  ],
  "biomarkerSummary": {
    "totalCount": 15,
    "flagged": 3,
    "highCount": 2,
    "lowCount": 1
  }
}
```

---

## ✅ Testing & Validation (Backend)

### Unit Tests

Test parsing, normalization, and flagging logic:

```javascript
// tests/biomarker.test.js
describe("Biomarker Flagging", () => {
  test("should flag HbA1c 7.2% as high", () => {
    const biomarker = {
      name: "HbA1c",
      value: 7.2,
      referenceRange: { low: 4.0, high: 5.6 }
    };
    const result = flagBiomarker(biomarker);
    expect(result.flag).toBe("high");
    expect(result.severity).toBe("moderate");
  });

  test("should handle missing reference ranges gracefully", () => {
    const biomarker = { name: "CustomMarker", value: 100 };
    const result = flagBiomarker(biomarker);
    expect(result.flag).toBe("unknown");
  });
});

describe("CSV Parsing", () => {
  test("should parse valid CSV file", async () => {
    const result = await parseCSV("./test-data/labs.csv");
    expect(result).toHaveLength(15);
    expect(result[0].name).toBe("HbA1c");
  });

  test("should reject invalid MIME type", async () => {
    const file = { mimetype: "application/exe" };
    expect(() => validateUpload(file)).toThrow();
  });
});
```

### Integration Tests

Test API endpoints with mock responses:

```javascript
// tests/api.integration.test.js
describe("POST /api/prompt", () => {
  test("should return analysis for valid biomarkers", async () => {
    const response = await request(app)
      .post("/api/prompt")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        context: { age: 62, sex: "male" },
        biomarkers: [
          { name: "HbA1c", value: 7.2, unit: "%" }
        ],
        instructions: "Analyze these results"
      });

    expect(response.status).toBe(200);
    expect(response.body.analysis).toBeDefined();
    expect(response.body.analysis.summary).toBeTruthy();
  });

  test("should reject missing authorization", async () => {
    const response = await request(app)
      .post("/api/prompt")
      .send({ /* payload */ });

    expect(response.status).toBe(401);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- biomarker.test.js

# Watch mode
npm run test:watch
```

### Test Configuration (package.json)

```json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"],
    "collectCoverageFrom": ["**/*.js", "!node_modules/**"]
  }
}
```

---

## 🚢 Deployment & Operations

### Local Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Server runs on http://localhost:3000
```

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t mediscan-backend:latest .
docker run -p 3000:3000 --env-file .env mediscan-backend:latest
```

### Docker Compose

For full stack (backend + database):

```yaml
# docker-compose.yml
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

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run: `docker-compose up -d`

### Process Manager (PM2)

For production Node.js process management:

```bash
npm install -g pm2

# Start application
pm2 start app.js --name "mediscan-backend"

# Enable startup on system reboot
pm2 startup
pm2 save

# Monitor
pm2 logs
pm2 monit
```

### Health Checks

Implement a health check endpoint:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: "connected",
      aiProvider: "available",
      diskSpace: "sufficient"
    }
  });
});
```

### Monitoring & Observability

**Logging:**
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

**Metrics:**
```bash
npm install prom-client  # Prometheus metrics
```

**APM (Application Performance Monitoring):**
- NewRelic
- Datadog
- Elastic APM
- Scout APM

### Load Balancing & Scaling

Use Nginx or AWS load balancers:

```nginx
upstream mediscan_backend {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
}

server {
  listen 80;
  server_name api.mediscan.example.com;

  location / {
    proxy_pass http://mediscan_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 📝 Example API Usage

### cURL Examples

#### 1. AI Analysis Request

```bash
curl -X POST https://api.mediscan.example.com/api/prompt \
  -H "Authorization: Bearer your-api-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "pat-12345",
    "context": {
      "age": 62,
      "sex": "male",
      "medications": ["lisinopril", "atorvastatin"],
      "comorbidities": ["hypertension", "type-2-diabetes"]
    },
    "biomarkers": [
      {
        "name": "HbA1c",
        "abbreviation": "HbA1c",
        "value": 7.2,
        "unit": "%",
        "timestamp": "2025-11-28T10:00:00Z",
        "referenceRange": {
          "low": 4.0,
          "high": 5.6,
          "units": "%",
          "population": "general"
        }
      },
      {
        "name": "Total Cholesterol",
        "value": 245,
        "unit": "mg/dL",
        "timestamp": "2025-11-28T10:00:00Z"
      }
    ],
    "instructions": "Provide interpretation and recommendations."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "analysis": {
    "summary": "Patient shows elevated HbA1c (7.2%) indicating suboptimal diabetes control. Total cholesterol is elevated at 245 mg/dL; statin therapy should be reviewed.",
    "riskFactors": ["elevated-glucose", "high-cholesterol", "cardiovascular-risk"],
    "recommendations": [
      "Optimize diabetes medication regimen",
      "Consider statin therapy intensification",
      "Increase physical activity",
      "Schedule follow-up in 3 months"
    ],
    "confidence": 0.94
  },
  "timestamp": "2025-11-28T10:15:22Z"
}
```

#### 2. File Upload

```bash
curl -X POST https://api.mediscan.example.com/api/uploads \
  -H "Authorization: Bearer your-api-token-here" \
  -F "file=@/path/to/lab_results.csv" \
  -F "patientId=pat-12345"
```

#### 3. Get Patient Summary

```bash
curl -X GET https://api.mediscan.example.com/api/patient/pat-12345/summary \
  -H "Authorization: Bearer your-api-token-here"
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.mediscan.example.com',
  headers: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
});

async function analyzeBiomarkers() {
  try {
    const response = await client.post('/api/prompt', {
      patientId: 'pat-12345',
      context: {
        age: 62,
        sex: 'male'
      },
      biomarkers: [
        {
          name: 'HbA1c',
          value: 7.2,
          unit: '%'
        }
      ],
      instructions: 'Interpret these results'
    });

    console.log('Analysis:', response.data.analysis);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

analyzeBiomarkers();
```

### Python Example

```python
import requests
import json

API_TOKEN = "your-api-token"
BASE_URL = "https://api.mediscan.example.com"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

payload = {
    "patientId": "pat-12345",
    "context": {
        "age": 62,
        "sex": "male"
    },
    "biomarkers": [
        {
            "name": "HbA1c",
            "value": 7.2,
            "unit": "%"
        }
    ],
    "instructions": "Provide interpretation and recommendations"
}

response = requests.post(
    f"{BASE_URL}/api/prompt",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.status_code} - {response.text}")
```

---

## ⚠️ Limitations & Clinical Safety

### Important Disclaimers

**This tool is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.**

All users must include the following disclaimer in UI and API responses:

> "This tool provides informational insights based on biomarker data and AI analysis. **It is not a diagnosis.** Please consult with a licensed healthcare provider for medical decisions, diagnoses, or treatment plans."

### Safety Guardrails

The backend implements multiple safety layers:

#### 1. Output Filtering
```javascript
function sanitizeClinicalOutput(aiOutput) {
  const unsafePatterns = [
    { pattern: /\bdiagnosed? with\b/gi, replacement: "may indicate" },
    { pattern: /\byou have\b/gi, replacement: "your results suggest you may have" },
    { pattern: /\bcertain(ly)?\b/gi, replacement: "may" },
    { pattern: /\bprove(s|d)?\b/gi, replacement: "suggest" }
  ];

  let safe = aiOutput;
  unsafePatterns.forEach(({ pattern, replacement }) => {
    safe = safe.replace(pattern, replacement);
  });

  return safe;
}
```

#### 2. Mandatory Disclaimers
```javascript
function appendDisclaimers(analysis) {
  const disclaimer = `
⚠️ MEDICAL DISCLAIMER:
This analysis is not a medical diagnosis. Always consult with a licensed healthcare provider 
before making any medical decisions. AI-generated insights may contain errors.

🔍 VERIFICATION: Have your results reviewed by a qualified clinician.
💊 MEDICATION: Do not change medications without healthcare provider approval.
🏥 EMERGENCIES: Call 911 or go to the nearest emergency room for urgent concerns.
  `;

  return {
    ...analysis,
    disclaimer
  };
}
```

#### 3. Confidence Thresholds
```javascript
// Only surface high-confidence results
const MIN_CONFIDENCE = 0.7;

if (analysisConfidence < MIN_CONFIDENCE) {
  return {
    warning: "Analysis confidence below threshold. Recommend clinical review.",
    analysis: null
  };
}
```

### Clinical Governance

1. **Audit All AI Outputs**
   - Log every AI-generated recommendation
   - Flag unusual or high-risk outputs for human review
   - Maintain audit trail for regulatory compliance

2. **Rule-Based Overrides**
   - Critical values (e.g., glucose < 50 mg/dL, K+ > 6.5 mEq/L) trigger urgent alerts
   - Conflicting AI recommendations are flagged for review
   - Clinical validation required before surfacing critical findings

3. **Human Verification Loop**
   - Encourage clinician review of all AI insights
   - Provide clear referral pathways to specialists
   - Track outcomes to improve model accuracy

### Known Limitations

| Limitation | Implication | Mitigation |
|-----------|------------|-----------|
| **Single timepoint analysis** | No trend detection with one value | Require historical data when possible |
| **Demographic bias in reference ranges** | Age/sex/ethnicity-specific ranges needed | Use population-specific references |
| **Medication interactions not exhaustive** | Missed drug interactions possible | Recommend pharmacist review |
| **AI probabilistic nature** | Occasional nonsensical output | Post-processing guardrails + human review |
| **Data quality dependency** | Garbage in, garbage out | Validate all input before analysis |

---

## 🚀 Next Steps & Enhancements

### Phase 1: MVP (Current)
- [x] Basic API endpoints (prompt, upload, summary)
- [x] CSV parsing and normalization
- [x] AI provider integration
- [x] Biomarker flagging logic

### Phase 2: Core Features (Planned)
- [ ] Persistent database (MongoDB/PostgreSQL)
- [ ] User authentication & authorization (JWT, OAuth2)
- [ ] Trend analysis & historical tracking
- [ ] Standard reference range database
- [ ] Drug-interaction lookup service
- [ ] Clinical calculator integration (Framingham, ASCVD, etc.)
- [ ] Comprehensive unit tests
- [ ] API documentation (Swagger/OpenAPI)

### Phase 3: Advanced (Future)
- [ ] Role-based access control (RBAC)
- [ ] Multi-tenancy support
- [ ] Real-time alert system
- [ ] Clinical knowledge base integration
- [ ] Advanced visualization & reporting
- [ ] Mobile app integration
- [ ] HIPAA compliance certification
- [ ] Audit trail & compliance reporting

### Phase 4: Production Hardening
- [ ] Rate limiting & DDoS protection
- [ ] Advanced security & penetration testing
- [ ] Performance optimization
- [ ] Global deployment & CDN
- [ ] Disaster recovery & backup
- [ ] Regulatory compliance (FDA, EHR integration)
- [ ] Clinical validation studies

---

## 📚 References & Resources

### Clinical Standards
- [LOINC (Lab Observation Identifiers Names and Codes)](https://loinc.org/)
- [SNOMED CT (Clinical Terminology)](https://www.snomed.org/)
- [ICD-10 Codes](https://www.cdc.gov/nchs/icd/icd10.htm)
- [Framingham Risk Score](https://www.framinghamheartstudy.org/)
- [ASCVD Risk Calculator](https://tools.acc.org/ascvd-risk-estimator-plus/)

### Technical References
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### Related Technologies
- **Biomarker Databases:** Wikidata, DrugBank, PubChem
- **EHR Integration:** HL7 FHIR, CCD standards
- **Data Visualization:** D3.js, Plotly, Chart.js
- **Database:** MongoDB, PostgreSQL, DynamoDB
- **Containerization:** Docker, Kubernetes
- **Monitoring:** Prometheus, Grafana, DataDog

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards
- Use ESLint with provided `.eslintrc.js`
- Run tests before submitting PR: `npm test`
- Maintain >80% code coverage
- Follow Express.js best practices
- Add JSDoc comments for all functions

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

For questions, issues, or contributions:

- **GitHub Issues:** [Report bugs or request features](https://github.com/your-org/mediscan/issues)
- **Email:** support@mediscan.example.com
- **Documentation:** [Full docs](https://docs.mediscan.example.com/)
- **Community:** [Discord/Slack channel]

---

## 🙏 Acknowledgments

- Clinical advisors and SMEs for reference ranges and validation
- Open-source community (Express, Node.js ecosystem)
- Healthcare data standards organizations (LOINC, SNOMED, HL7)

---

**Last Updated:** January 2026  
**Maintainer:** [Your Team Name]  
**Status:** Active Development

---

For biology-specific references and clinical thresholds, coordinate with clinical SMEs and maintain a curated knowledge base that both backend and frontend can query.

