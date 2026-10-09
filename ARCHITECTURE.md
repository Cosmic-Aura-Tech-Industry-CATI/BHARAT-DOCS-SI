# BharatDoc — AI Document Intelligence System Architecture & Technical Specifications

**Document Version:** 1.0.0-RELEASE  
**Hackathon Event:** AVINYA 2K26, Indian Institute of Technology (IIT) Kanpur  
**Event Dates:** October 8–9, 2026 (36-Hour Hackathon Execution)  
**System Target:** Enterprise & MSME AI Document Intelligence for Indian Semi-Structured & Handwritten Documents  
**Authoring Team:** Senior System Architects & AI Infrastructure Engineers  

---

## Executive Summary Table

| Metric / Dimension | Specification / Value |
| :--- | :--- |
| **System Name** | **BharatDoc** (भारतDoc) |
| **Core Functionality** | End-to-end OCR, Layout Parsing, LLM Field Extraction, Rule Validation, HITL Review & NL Querying |
| **Document Scope (MVP)** | GST Invoices, Form-16 (Part A/B), Bank Statements, Hindi Handwritten Receipts |
| **Languages Supported** | English, Hindi (Devanagari script), Mixed Hinglish |
| **Target Throughput** | 100–1,000 docs/day (MVP Hackathon Dev), 10,000+ docs/day (Production Cloud Scale) |
| **End-to-End Processing SLA** | $< 6.5$ seconds average per document (Async Queue Execution) |
| **Target Operational Cost** | $\le \text{₹}2.00$ per document average (using hybrid OCR + LLM prompting strategy) |
| **Primary Deployment** | Docker Compose (Hackathon Dev) $\rightarrow$ AWS `ap-south-1` (Mumbai) Kubernetes (Production) |

---

## Table of Contents

- [SECTION 0: ASSUMPTIONS (MANDATORY — READ FIRST)](#section-0-assumptions-mandatory--read-first)
  - [0.1 Business \& Scope Assumptions](#01-business--scope-assumptions)
  - [0.2 Technical Assumptions](#02-technical-assumptions)
  - [0.3 AI/ML Assumptions](#03-aiml-assumptions)
  - [0.4 Infrastructure \& Deployment Assumptions](#04-infrastructure--deployment-assumptions)
  - [0.5 Data \& Privacy Assumptions](#05-data--privacy-assumptions)
  - [0.6 Team \& Time Assumptions](#06-team--time-assumptions)
  - [0.7 Constraints \& Out-of-Scope](#07-constraints--out-of-scope)
  - [0.8 Risk Assumptions](#08-risk-assumptions)
  - [0.9 Assumption Validation Plan](#09-assumption-validation-plan)
- [SECTION 1: EXECUTIVE SUMMARY](#section-1-executive-summary)
  - [1.1 System Context \& Mission](#11-system-context--mission)
  - [1.2 The Indian Document Complexity Problem](#12-the-indian-document-complexity-problem)
  - [1.3 High-Level Architecture Summary](#13-high-level-architecture-summary)
  - [1.4 Key Architectural Principles](#14-key-architectural-principles)
- [SECTION 2: SYSTEM ARCHITECTURE OVERVIEW](#section-2-system-architecture-overview)
  - [2.1 End-to-End System Architecture Diagram](#21-end-to-end-system-architecture-diagram)
  - [2.2 Layered Architecture Breakdown](#22-layered-architecture-breakdown)
  - [2.3 Comprehensive Data Flow Walkthrough](#23-comprehensive-data-flow-walkthrough)
- [SECTION 3: SERVER ARCHITECTURE (DETAILED)](#section-3-server-architecture-detailed)
  - [3.1 Server Topology: Modular Monolith vs Microservices](#31-server-topology-modular-monolith-vs-microservices)
  - [3.2 Compute Server Components](#32-compute-server-components)
  - [3.3 Server Sizing \& Resource Allocation Matrix](#33-server-sizing--resource-allocation-matrix)
  - [3.4 Load Balancing, Queue Backpressure \& Auto-scaling](#34-load-balancing-queue-backpressure--auto-scaling)
  - [3.5 Inter-Service Communication Protocols](#35-inter-service-communication-protocols)
- [SECTION 4: AI/ML LAYER (MOST IMPORTANT)](#section-4-aiml-layer-most-important)
  - [4.1 AI Integration Across Processing Lifecycle](#41-ai-integration-across-processing-lifecycle)
  - [4.2 Model Selection \& Technical Justification](#42-model-selection--technical-justification)
  - [4.3 AI Model Hosting \& Compute Architecture](#43-ai-model-hosting--compute-architecture)
  - [4.4 Detailed AI Pipeline Flowchart](#44-detailed-ai-pipeline-flowchart)
  - [4.5 Prompt Engineering Strategy \& JSON Schema Enforcement](#45-prompt-engineering-strategy--json-schema-enforcement)
  - [4.6 AI Operational Cost Breakdown](#46-ai-operational-cost-breakdown)
  - [4.7 AI Resilience, Circuit Breakers \& Fallback Chain](#47-ai-resilience-circuit-breakers--fallback-chain)
  - [4.8 AI Model Versioning \& ML Registry Strategy](#48-ai-model-versioning--ml-registry-strategy)
- [SECTION 5: DATA LAYER](#section-5-data-layer)
  - [5.1 Database Architecture \& Relational DDL Schema](#51-database-architecture--relational-ddl-schema)
  - [5.2 Entity-Relationship (ER) Diagram](#52-entity-relationship-er-diagram)
  - [5.3 Blob Storage Architecture \& S3 Bucket Layout](#53-blob-storage-architecture--s3-bucket-layout)
  - [5.4 Redis Caching \& Key Schema Design](#54-redis-caching--key-schema-design)
  - [5.5 Data Privacy, PII Lifecycle \& DPDP Purging](#55-data-privacy-pii-lifecycle--dpdp-purging)
- [SECTION 6: API DESIGN](#section-6-api-design)
  - [6.1 Protocol Selection: REST vs GraphQL](#61-protocol-selection-rest-vs-graphql)
  - [6.2 Authentication, Authorization \& Rate Limiting](#62-authentication-authorization--rate-limiting)
  - [6.3 OpenAPI Endpoint Specification Catalog](#63-openapi-endpoint-specification-catalog)
  - [6.4 Asynchronous Processing \& Real-Time SSE API](#64-asynchronous-processing--real-time-sse-api)
  - [6.5 Error Handling Standard (RFC 7807)](#65-error-handling-standard-rfc-7807)
- [SECTION 7: FRONTEND ARCHITECTURE](#section-7-frontend-architecture)
  - [7.1 Tech Stack Selection](#71-tech-stack-selection)
  - [7.2 Page Layout Structure \& Component Hierarchy](#72-page-layout-structure--component-hierarchy)
  - [7.3 Interactive Split-Screen HITL Verification Canvas](#73-interactive-split-screen-hitl-verification-canvas)
  - [7.4 Real-Time State Synchronization](#74-real-time-state-synchronization)
- [SECTION 8: SECURITY \& PRIVACY](#section-8-security--privacy)
  - [8.1 Authentication \& RBAC Architecture](#81-authentication--rbac-architecture)
  - [8.2 Data Encryption Standards](#82-data-encryption-standards)
  - [8.3 Automated PII Detection \& Masking Pipeline](#83-automated-pii-detection--masking-pipeline)
  - [8.4 Audit Logging \& DPDP Act Compliance](#84-audit-logging--dpdp-act-compliance)
- [SECTION 9: DEPLOYMENT ARCHITECTURE](#section-9-deployment-architecture)
  - [9.1 Environment Topology](#91-environment-topology)
  - [9.2 Production-Ready Docker Compose Specification](#92-production-ready-docker-compose-specification)
  - [9.3 Production Kubernetes (K8s) Topology](#93-production-kubernetes-k8s-topology)
  - [9.4 CI/CD Pipeline Architecture](#94-cicd-pipeline-architecture)
  - [9.5 Observability Stack (Prometheus + Grafana + Loki)](#95-observability-stack-prometheus--grafana--loki)
  - [9.6 Cloud Infrastructure Budget Breakdown](#96-cloud-infrastructure-budget-breakdown)
- [SECTION 10: SCALABILITY \& PERFORMANCE](#section-10-scalability--performance)
  - [10.1 Auto-Scaling Strategy](#101-auto-scaling-strategy)
  - [10.2 Performance Target \& Latency Budget Allocation](#102-performance-target--latency-budget-allocation)
  - [10.3 System Bottlenecks \& Mitigation Playbook](#103-system-bottlenecks--mitigation-playbook)
  - [10.4 Multi-Tier Caching Architecture](#104-multi-tier-caching-architecture)
- [SECTION 11: RELIABILITY \& FAULT TOLERANCE](#section-11-reliability--fault-tolerance)
  - [11.1 Retry \& Exponential Backoff Strategy](#111-retry--exponential-backoff-strategy)
  - [11.2 Circuit Breaker Implementation](#112-circuit-breaker-implementation)
  - [11.3 Dead Letter Queue (DLQ) Architecture](#113-dead-letter-queue-dlq-architecture)
  - [11.4 Disaster Recovery \& Backup Standard](#114-disaster-recovery--backup-standard)
- [SECTION 12: INDIA-SPECIFIC CONSIDERATIONS](#section-12-india-specific-considerations)
  - [12.1 Hindi \& Devanagari OCR Nuances](#121-hindi--devanagari-ocr-nuances)
  - [12.2 Indian Financial \& Identity Validation Engine](#122-indian-financial--identity-validation-engine)
  - [12.3 DPDP Act 2023 Compliance \& Data Residency](#123-dpdp-act-2023-compliance--data-residency)
  - [12.4 Low-Bandwidth Optimizations](#124-low-bandwidth-optimizations)
- [SECTION 13: ARCHITECTURAL TRADE-OFFS \& DECISION MATRIX](#section-13-architectural-trade-offs--decision-matrix)
- [SECTION 14: FUTURE ROADMAP](#section-14-future-roadmap)
- [SECTION 15: APPENDIX](#section-15-appendix)
  - [15.1 Technical Glossary](#151-technical-glossary)
  - [15.2 Academic \& Industry References](#152-academic--industry-references)
  - [15.3 Production JSON Schemas](#153-production-json-schemas)
  - [15.4 Production-Grade Validation Code (Python)](#154-production-grade-validation-code-python)
  - [15.5 Assumption Traceability Matrix](#155-assumption-traceability-matrix)

---

## SECTION 0: ASSUMPTIONS (MANDATORY — READ FIRST)

The architectural decisions, component selections, resource sizing, and data pipelines defined within this report are strictly grounded upon the following explicit assumptions. Every architectural claim made in subsequent sections references these assumption codes (e.g., `[A-BUS-01]`, `[A-TECH-03]`).

### 0.1 Business & Scope Assumptions
- `[A-BUS-01] Target Users`: Primary end-users include Indian Micro, Small, and Medium Enterprises (MSMEs), Chartered Accountants (CAs), tax consultants, small retail business owners, and agricultural producers.
- `[A-BUS-02] Primary Use Cases`: System supports dual ingestion modes: single-file manual uploads via Web UI and batch folder drops via a headless REST API.
- `[A-BUS-03] Processing Volume`: The Minimum Viable Product (MVP) handles 100–1,000 documents per day. The core architecture must scale seamlessly to 10,000+ documents/day without requiring structural refactoring.
- `[A-BUS-04] Language Scope`: MVP targets bilingual Devanagari (Hindi) and Latin (English) scripts, including mixed "Hinglish" text. Support for regional Dravidian (Tamil, Telugu) and Eastern Indo-Aryan (Bengali) scripts is deferred to Phase 2.
- `[A-BUS-05] Document Types in MVP`: System processes four core semi-structured formats: GST Invoices, Form-16 (Tax Deducted at Source certificates), Bank Account Statements (PDF/scanned images), and Hindi Handwritten Receipts/Kachha Bills.
- `[A-BUS-06] Latency & Streaming`: Asynchronous batch/queue processing is fully acceptable. Real-time streaming optical character recognition (OCR) is out of scope for MVP.
- `[A-BUS-07] Human-in-the-Loop Threshold`: Field-level confidence scores below $0.70$ ($70\%$) automatically trigger routing to the Human-in-the-Loop (HITL) review queue.
- `[A-BUS-08] User Infrastructure`: Users operate standard laptops or mid-tier 4G/5G smartphones with active internet connections. Offline-first PWA features are deferred.

### 0.2 Technical Assumptions
- `[A-TECH-01] Input Specifications`: Ingested files are restricted to PDF, PNG, JPG, and JPEG formats, with a maximum file size of 20MB and a 10-page limit per document bundle.
- `[A-TECH-02] Image Quality Distribution`: Scanned input quality spans high-resolution 300 DPI native digital PDFs down to noisy, low-light, skewed 72 DPI mobile camera images.
- `[A-TECH-03] Baseline OCR Character Accuracy`: Expected character recognition baseline is $\ge 95\%$ for printed English, $\ge 85\%$ for printed Devanagari Hindi, and $60\%\text{--}70\%$ for handwritten Hindi text.
- `[A-TECH-04] Cloud LLM Uptime`: Third-party Large Language Model APIs (Google Gemini 1.5 Pro, OpenAI GPT-4o) maintain $\ge 99.0\%$ uptime SLA.
- `[A-TECH-05] Network Latency`: Internet round-trip latency between local compute nodes and cloud LLM endpoints is $\le 2.0$ seconds.
- `[A-TECH-06] LLM Context Window`: Multi-page documents fit well within modern context windows (e.g., Gemini 1.5 Pro 1,000,000 tokens).
- `[A-TECH-07] Database Scale`: A single PostgreSQL 16 instance handles up to 100,000 documents and 1,000,000 extracted field rows without horizontal table sharding.
- `[A-TECH-08] In-Memory Cache`: Redis 7.x efficiently handles 1,000 concurrent active background extraction jobs.
- `[A-TECH-09] Geographic Deployment`: Deployment inside a single AWS region (`ap-south-1`, Mumbai) or GCP region (`asia-south1`, Mumbai) satisfies latency and residency requirements.
- `[A-TECH-10] Regulatory Scope`: Full PCI-DSS and HIPAA certifications are out of scope for MVP. Basic data protection and encryption standards apply.
- `[A-TECH-11] PII Handling`: Personally Identifiable Information (PII) like Aadhaar, PAN, and bank accounts are present and must be masked prior to persistent database writes.

### 0.3 AI/ML Assumptions
- `[A-AIML-01] Open-Source Models`: Pre-trained open-source computer vision models (PaddleOCR v4, LayoutLMv3) perform adequately without requiring full domain fine-tuning during MVP.
- `[A-AIML-02] Structured Extraction`: Prompting LLMs with strict JSON Schema constraints (via Pydantic/Instructor) replaces complex custom Named Entity Recognition (NER) token classifiers.
- `[A-AIML-03] Field Confidence Formula`: Confidence per field is computed via a composite heuristic formula combining OCR character probability, LLM logprob, and deterministic rule validation:
  $$C_{\text{field}} = 0.4 \times C_{\text{OCR}} + 0.35 \times C_{\text{LLM}} + 0.25 \times V_{\text{rule}}$$
- `[A-AIML-04] Inference Hardware`: Local machine learning inference (PaddleOCR, Presidio, sentence-transformers) runs on 4-core CPU for dev/hackathon and scales to NVIDIA T4 GPUs for production.
- `[A-AIML-05] No Custom Training`: No neural network weights are trained or fine-tuned during the 36-hour hackathon execution window.
- `[A-AIML-06] Dense Vector Search`: Pre-trained `sentence-transformers` (`bge-m3` or `multilingual-e5-base`) provide dense vector embeddings for semantic document search.
- `[A-AIML-07] LLM Cost Ceiling`: API spend per document averages $\le \text{₹}2.00$ ($< \$0.024$ USD) across mixed document batches.

### 0.4 Infrastructure & Deployment Assumptions
- `[A-INFRA-01] Hackathon Compute`: Dev environment runs on a single Virtual Machine (4 vCPU, 8GB RAM, 100GB SSD) orchestrated via Docker Compose.
- `[A-INFRA-02] Production Compute`: Production environment deploys on managed Kubernetes (AWS EKS or GCP GKE) in the Mumbai region.
- `[A-INFRA-03] Object Storage`: S3-compatible API object storage (MinIO for local dev, AWS S3 / GCP Cloud Storage for production).
- `[A-INFRA-04] Cloud Budget`: Production MVP cloud operational budget is capped at $< \$300/\text{month}$.
- `[A-INFRA-05] Air-Gapped Deployment`: Fully isolated, air-gapped on-premise deployment is designed as an architectural option for enterprise clients but is inactive during MVP demo.
- `[A-INFRA-06] Multi-Tenancy`: Logical multi-tenancy (`org_id` column isolation) is used for MVP rather than full physical cluster segregation.

### 0.5 Data & Privacy Assumptions
- `[A-PRIV-01] User Consent`: Users explicitly accept Terms of Service authorizing document parsing and processing.
- `[A-PRIV-02] Masking Standard`: Aadhaar numbers are masked to last 4 digits (`XXXX-XXXX-1234`), PAN cards masked (`XXXXX1234X`), and bank accounts masked (`XXXXXX9876`).
- `[A-PRIV-03] Document Retention`: Raw original uploaded images/PDFs are automatically deleted after 90 days via S3 lifecycle policies. Extracted structured JSON data is stored indefinitely.
- `[A-PRIV-04] Audit Trail Retention`: Immutable operational audit logs are retained for 365 days.
- `[A-PRIV-05] Data Residency`: All data, raw files, vectors, and database backups remain strictly within Indian physical borders (`ap-south-1`).
- `[A-PRIV-06] DPDP Alignment`: System design complies with key tenets of India's Digital Personal Data Protection (DPDP) Act 2023 (purpose limitation, right to erasure).

### 0.6 Team & Time Assumptions
- `[A-TEAM-01] Team Size`: Engineering team consists of 4–5 members (2 Backend/Systems, 1 Frontend/UX, 1 AI/ML Engineer, 1 Full-Stack).
- `[A-TEAM-02] Hackathon Duration`: Execution time window is 36 consecutive hours (yielding $\approx 30$ productive hours per developer).
- `[A-TEAM-03] DevOps Resource`: No dedicated DevOps engineer; backend engineers manage Docker Compose, Redis, and PostgreSQL configurations.
- `[A-TEAM-04] UI Component Library`: Frontend UI relies on pre-built `shadcn/ui` and `Tailwind CSS` components without custom Figma design assets.
- `[A-TEAM-05] QA Testing`: Testing is conducted directly by developer authors via automated Python unit tests and manual browser validation.

### 0.7 Constraints & Out-of-Scope
- **Out of Scope (MVP):** Native iOS/Android mobile apps, offline browser OCR execution, multi-region database clustering, real-time multi-user live editing, custom PyTorch training pipelines, blockchain proof-of-authenticity ledger, voice-driven document queries.
- **Hard Constraints:** 36-hour build deadline, zero budget for paid commercial training datasets, no proprietary APIs beyond standard LLM endpoints.
- **Soft Constraints:** Total cloud operational budget $< \$300/\text{month}$, team size $\le 5$ engineers.

### 0.8 Risk Assumptions
- `[A-RISK-01] Third-Party LLM Outage` $\rightarrow$ **Mitigation:** Fallback chain: Gemini 1.5 Pro $\rightarrow$ OpenAI GPT-4o-mini $\rightarrow$ Local Ollama Llama-3-8B. Automatic retry via Celery queue backoff.
- `[A-RISK-02] Low Quality / Unreadable Scan` $\rightarrow$ **Mitigation:** Pre-OCR image quality scoring. If quality score $< 0.40$, immediately fail fast and trigger HITL review.
- `[A-RISK-03] Live Demo Internet Failure` $\rightarrow$ **Mitigation:** Pre-loaded mock sandbox datasets saved locally in SQLite/MinIO container.
- `[A-RISK-04] LLM Rate Limiting` $\rightarrow$ **Mitigation:** Client-side rate-limiting queues in Redis with exponential backoff token bucket dispatchers.

### 0.9 Assumption Validation Plan

| Assumption ID | Parameter / Claim | Validation Method | Failure Threshold | Fallback / Remediation Action |
| :--- | :--- | :--- | :--- | :--- |
| `[A-TECH-03]` | Printed Devanagari OCR $\ge 85\%$ | Test PaddleOCR on 30 sample Indian bills | Accuracy $< 80\%$ | Switch to Google Cloud Vision API endpoint |
| `[A-AIML-07]` | LLM Cost $\le \text{₹}2.00$/doc | Track token usage over 100 benchmark docs | Average cost $> \text{₹}2.50$ | Optimize system prompt; use Gemini 1.5 Flash |
| `[A-TECH-08]` | Redis handles 1k active jobs | Run `locust` queue load generator | Memory spike $> 80\%$ | Shorten job result TTL; increase Redis memory cap |
| `[A-PRIV-05]` | Data Residency (`ap-south-1`) | Terraform region check & bucket location API | Any region outside India | Enforce AWS IAM boundary policy locking region |
| `[A-TEAM-02]` | 36-Hour Hackathon Delivery | End-of-hour milestone feature checks | Delayed component $> 3$ hrs | Cut scope (e.g., drop complex bank parser, keep GST) |

---

## SECTION 1: EXECUTIVE SUMMARY

### 1.1 System Context & Mission
**BharatDoc** is an enterprise-grade AI Document Intelligence Platform specifically engineered to address the unique complexities of Indian financial, tax, identity, and handwritten semi-structured documents `[A-BUS-01]`. Operating at the intersection of Computer Vision, Large Language Models (LLMs), and rule-based verification engines, BharatDoc converts noisy, multi-lingual, poorly scanned physical invoices, receipts, tax certificates, and bank statements into verified, confidence-scored, relational and vector-queryable structured data `[A-BUS-05]`.

### 1.2 The Indian Document Complexity Problem
Document processing in the Indian business landscape presents severe challenges that break standard off-the-shelf Western OCR engines:
1. **Multi-Script & Code-Mixing:** Invoices and bills frequently mix Devanagari Hindi text with English Latin characters within a single line or table `[A-BUS-04]`.
2. **Kachha Bills & Handwriting:** Millions of MSMEs rely on handwritten receipts ("Kachha Bills") executed with ballpoint pens on low-quality paper stock.
3. **Noisy Scan Artifacts:** Scans are often taken via low-cost mobile phones in poor lighting, exhibiting severe skew, perspective distortion, and shadows `[A-TECH-02]`.
4. **Strict Financial Rules:** Indian financial compliance demands strict structural verification (e.g., GSTIN checksums, PAN format structure, Devanagari numeral conversions, line-item arithmetic reconciliation).

### 1.3 High-Level Architecture Summary
BharatDoc utilizes a **Validation-First, Modular Monolith Architecture** `[A-INFRA-01]`. Ingested documents undergo computer vision enhancement, multi-engine OCR extraction, layout-aware LLM field parsing, deterministic financial rule validation, composite field confidence scoring, automated PII masking, and indexed relational/vector persistence. Low-confidence fields ($< 0.70$) are seamlessly dispatched to an interactive split-screen Human-in-the-Loop (HITL) web interface `[A-BUS-07]`.

### 1.4 Key Architectural Principles
1. **Validation-First AI:** Deterministic Indian financial checksums (GSTIN Modulo-36, PAN format, IFSC) take precedence over statistical LLM outputs `[A-AIML-03]`.
2. **India-Centric Devanagari OCR:** Native handling of Devanagari shirorekha (continuous top header line), complex conjunct consonants, and Devanagari numerals (`०-९`) `[A-BUS-04]`.
3. **Field-Level Confidence & HITL:** Every extracted JSON key receives an explicit confidence score ($0.00 \text{--} 1.00$) to enable automated workflow routing `[A-BUS-07]`.
4. **Data Sovereignty & DPDP Compliance:** All data processing, storage, and embedding generation remain pinned within Indian geographic boundaries (`ap-south-1`) `[A-PRIV-05]`.
5. **Cost-Optimized Hybrid AI Pipeline:** Local open-source models handle vision and OCR, reserving high-capability LLM API calls strictly for structural JSON synthesis to keep average cost $\le \text{₹}2.00$/doc `[A-AIML-07]`.

---

## SECTION 2: SYSTEM ARCHITECTURE OVERVIEW

### 2.1 End-to-End System Architecture Diagram

```mermaid
flowchart TD
    %% Client Layer
    subgraph Client_Layer["1. CLIENT LAYER"]
        WebUI["Next.js Web App\n(Split-Screen HITL)"]
        MobilePWA["Mobile Web PWA\n(Camera Scan Capture)"]
        RestAPIClient["Headless REST API Client\n(ERP / Tally / Python)"]
    end

    %% API Gateway Layer
    subgraph Gateway_Layer["2. API GATEWAY & SECURITY LAYER"]
        Nginx["Nginx Ingress / Reverse Proxy\n(TLS 1.3, Rate Limiting)"]
        FastAPI_Gateway["FastAPI Gateway Engine\n(JWT Auth, RBAC, Validation)"]
    end

    %% Async Queue Layer
    subgraph Queue_Layer["3. ASYNC ORCHESTRATION LAYER"]
        Redis_Broker["Redis Queue & Pub/Sub\n(Broker & Result Cache)"]
        Celery_Workers["Celery Distributed Worker Pool\n(Async Task Execution)"]
    end

    %% AI/ML Processing Pipeline Layer
    subgraph AIML_Layer["4. AI/ML PROCESSING PIPELINE LAYER"]
        CV_Engine["OpenCV Preprocessor\n(Deskew, Denoise, Contrast)"]
        OCR_Engine["PaddleOCR v4 Engine\n(Devanagari + English Text)"]
        Layout_Classifier["LayoutLMv3 Classifier\n(Doc Type & Region Detection)"]
        LLM_Extractor["Gemini 1.5 Pro / GPT-4o Engine\n(JSON Schema Prompting)"]
        PII_Masker["Presidio PII Redactor\n(Aadhaar / PAN / Acc Masking)"]
        Confidence_Calculator["Composite Field Confidence Engine\n(OCR + LLM + Rules)"]
    end

    %% Rule Validation Engine
    subgraph Rule_Layer["5. DETERMINISTIC VALIDATION LAYER"]
        Rule_Engine["Financial Rule Engine\n(GSTIN Checksum, PAN, Devanagari Digits, Tax Math)"]
    end

    %% Storage Layer
    subgraph Storage_Layer["6. DATA PERSISTENCE LAYER"]
        PostgreSQL[("PostgreSQL 16 DB\n(Relational & JSONB Store)")]
        pgvector[("pgvector Store\n(BGE-M3 Dense Embeddings)")]
        MinIO[("MinIO / AWS S3\n(Raw PDFs & Masked Artifacts)")]
    end

    %% External Systems Layer
    subgraph External_Layer["7. EXTERNAL INTEGRATIONS"]
        GSTN_Portal["GSTN Tax Portal API\n(Sandbox GST Verification)"]
        Tally_Export["Tally XML / Accounting Export"]
    end

    %% Connections
    WebUI & MobilePWA & RestAPIClient -->|HTTPS / REST| Nginx
    Nginx --> FastAPI_Gateway
    FastAPI_Gateway -->|Dispatch Job| Redis_Broker
    Redis_Broker --> Celery_Workers
    
    Celery_Workers --> CV_Engine
    CV_Engine --> OCR_Engine
    OCR_Engine --> Layout_Classifier
    Layout_Classifier --> LLM_Extractor
    LLM_Extractor --> Rule_Engine
    Rule_Engine --> Confidence_Calculator
    Confidence_Calculator --> PII_Masker
    
    PII_Masker -->|Save Extracted JSON| PostgreSQL
    PII_Masker -->|Generate Vectors| pgvector
    PII_Masker -->|Store Files| MinIO
    
    Rule_Engine -.->|Validate GSTIN| GSTN_Portal
    PostgreSQL -.->|Export Data| Tally_Export
    
    Celery_Workers -->|SSE Progress Updates| FastAPI_Gateway
    FastAPI_Gateway -->|Live Progress Stream| WebUI
```

### 2.2 Layered Architecture Breakdown

#### 1. Client Layer `[A-BUS-01]`, `[A-BUS-08]`
- **Next.js Web App:** Modern React-based Single Page Application. Houses the interactive split-screen canvas for reviewing documents side-by-side with extracted fields.
- **Mobile Web PWA:** Optimized responsive interface equipped with HTML5 camera input for rapid physical document capture by field workers or farmers.
- **Headless REST API Client:** High-throughput endpoint connection for automated ERP software ingestion (e.g., Tally Prime, Zoho Books).

#### 2. API Gateway & Security Layer `[A-TECH-10]`, `[A-PRIV-05]`
- **Nginx Ingress Proxy:** Serves as the outer perimeter controller, terminating TLS 1.3 encryption, handling CORS policies, and enforcing rate limiting (100 req/min per IP).
- **FastAPI Gateway Engine:** High-performance asynchronous Python API server responsible for JWT authentication token validation, request payload checking, and task dispatch.

#### 3. Orchestration & Queue Layer `[A-TECH-08]`, `[A-INFRA-01]`
- **Redis Broker:** In-memory message queue broker and fast result store. Facilitates real-time state tracking and handles backpressure during batch upload spikes.
- **Celery Worker Pool:** Distributed background task executor pool. Distributes heavy CPU/GPU computer vision, OCR, and LLM jobs across worker processes.

#### 4. AI/ML Processing Pipeline Layer `[A-AIML-01]`, `[A-AIML-04]`
- **OpenCV Computer Vision Processor:** Executes fast image normalization, auto-rotation, perspective correction, bilateral filtering, and deskewing.
- **PaddleOCR v4 Engine:** Dual Devanagari-Latin text recognition engine. Extracts text bounding boxes ($x_{min}, y_{min}, x_{max}, y_{max}$), baseline text strings, and character confidence scores.
- **LayoutLMv3 Classifier:** Identifies document category (GST Invoice vs Form-16 vs Bank Statement vs Hindi Bill) and segments visual regions (header, line-item table, footer).
- **LLM Structural Extractor:** Passes OCR bounding box text into Gemini 1.5 Pro / GPT-4o with Pydantic JSON Schema enforcement for structured entity extraction.
- **Presidio PII Redactor:** Scans extracted strings for sensitive identity tokens and masks them per `[A-PRIV-02]`.
- **Composite Confidence Calculator:** Computes field-level confidence scores combining OCR, LLM, and rule scores `[A-AIML-03]`.

#### 5. Deterministic Validation Layer `[A-AIML-03]`, `[A-TECH-10]`
- **Financial Rule Engine:** Executes strict algorithmic verification routines (GSTIN Modulo-36 check, PAN card regex, Devanagari digit converter, line-item multiplication checks).

#### 6. Data Persistence Layer `[A-TECH-07]`, `[A-INFRA-03]`
- **PostgreSQL 16 Relational DB:** Primary ACID transactional database storing document metadata, field extractions, confidence scores, and user audit logs.
- **pgvector Vector Extension:** Stores 1024-dimensional dense vector embeddings generated by `bge-m3` for fast semantic document search.
- **MinIO / AWS S3 Object Store:** Stores original raw document files, processed intermediate images, and thumbnail previews.

#### 7. External Integrations Layer `[A-BUS-02]`
- **GSTN Portal Sandbox API:** Optional external API verification bridge to cross-reference extracted GSTINs against official tax registry records.
- **Tally / Accounting Export:** Formats verified document fields into Tally XML or CSV for direct import into business accounting software.

### 2.3 Comprehensive Data Flow Walkthrough

```
[Document Upload] ──> (1. Upload API) ──> [MinIO Storage]
                           │
                           ▼
                    (2. Enqueue Job) ──> [Redis Queue]
                                             │
                                             ▼
                                    (3. Celery Worker)
                                             │
                                             ├─> [OpenCV Deskew]
                                             ├─> [PaddleOCR Text Extraction]
                                             ├─> [LayoutLM Classification]
                                             ├─> [Gemini LLM JSON Parsing]
                                             ├─> [Python Rule Checksum Engine]
                                             ├─> [Confidence Score Calculation]
                                             └─> [Presidio PII Redaction]
                                                     │
                                                     ▼
                                            (4. Evaluate Confidence)
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │ (Score >= 0.70)                               │ (Score < 0.70)
                             ▼                                               ▼
                     [PostgreSQL Write]                              [Route to HITL Queue]
                             │                                               │
                             ▼                                               ▼
                   [Status: Auto-Verified]                         [Status: Pending Review]
                             │                                               │
                             └───────────────────────┬───────────────────────┘
                                                     │
                                                     ▼
                                           (5. Next.js Web UI Sync)
                                                     │
                                                     ▼
                                           (6. NL Search & Export)
```

1. **Ingestion & Validation:** The client uploads a 300 DPI PDF invoice via `POST /api/v1/documents/upload` `[A-TECH-01]`. FastAPI validates file size ($< 20\text{MB}$) and MIME type, streams the raw file to S3/MinIO, inserts a `documents` row with status `QUEUED`, and returns a job UUID `[A-TECH-07]`.
2. **Asynchronous Dispatch:** FastAPI enqueues the task ID into Redis `[A-TECH-08]`. A Celery worker picks up the job and emits a Server-Sent Event (SSE) updating client state to `PROCESSING`.
3. **Vision Preprocessing:** The worker pulls the raw image from MinIO and applies OpenCV bilateral filtering (denoising), Otsu thresholding, and Hough transform deskewing.
4. **Dual OCR Extraction:** PaddleOCR v4 processes the cleaned image frame, generating text tokens, bounding box coordinates, and character-level confidence scores for both English and Devanagari text `[A-TECH-03]`.
5. **Layout Classification & Structuring:** Text tokens and spatial coordinates are passed to LayoutLMv3 to classify the document type (e.g., `GST_INVOICE`) and detect table boundaries `[A-AIML-01]`.
6. **LLM Schema Extraction:** Formatted bounding-box text is sent to Gemini 1.5 Pro via an API call using a Pydantic schema enforcing structured JSON output `[A-AIML-02]`.
7. **Deterministic Rule Validation:** The raw extracted JSON is passed to the Python Financial Rule Engine. The engine verifies the GSTIN checksum, validates the PAN pattern, converts any Devanagari numerals to ASCII, and checks table math ($\text{Quantity} \times \text{Rate} = \text{Amount}$) `[A-AIML-03]`.
8. **Composite Field Scoring & PII Redaction:** The system calculates a field-level confidence score $C_{\text{field}}$ for each key. Presidio masks sensitive strings (e.g., Aadhaar digits) per `[A-PRIV-02]`.
9. **Persistence & Routing:** Extracted JSON, confidence scores, and bounding boxes are saved to PostgreSQL `[A-TECH-07]`.
   - If **all** field confidence scores are $\ge 0.70$, document status is marked `VERIFIED` `[A-BUS-07]`.
   - If **any** critical field score is $< 0.70$, document status is marked `NEEDS_REVIEW` and enqueued into the HITL review interface.
10. **Query & Export:** Verified data is indexed using `pgvector` for Natural Language querying and can be exported as Tally XML or CSV `[A-AIML-06]`.

---

## SECTION 3: SERVER ARCHITECTURE (DETAILED)

### 3.1 Server Topology: Modular Monolith vs Microservices

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MODULAR MONOLITH (MVP)                                  │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                 FastAPI Container                                 │  │
│  │                                                                                   │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │  │
│  │  │  Ingestion Mod.  │  │  OCR Pipeline    │  │  LLM Engine      │  │  Rule Engine│  │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────┘  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │  │
│  │  │  HITL Module     │  │  NL Query Mod.   │  │  Auth/RBAC Mod.  │  │  Export Mod.│  │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           │ (Scale Evolution Path)
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                             MICROSERVICES ARCHITECTURE (Scale)                          │
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐  │
│  │ Ingestion Svc   │    │ OCR Worker Svc  │    │ LLM Parsing Svc │    │ Rule Validation│  │
│  │ (FastAPI Pods)  │    │ (GPU Pod Swarm) │    │ (Async LiteLLM) │    │ Service Pods │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Architectural Recommendation: Modular Monolith for MVP `[A-TEAM-02]`, `[A-TEAM-03]`
For the 36-hour hackathon execution window and initial production MVP, BharatDoc adopts a **Modular Monolith** pattern within a unified Python 3.11 code structure.

**Rationale:**
- **Zero Network Overhead:** In-process function calls replace gRPC/REST network calls between internal components, eliminating serialization latencies and network failure modes.
- **Simplified Deployment:** A single unified Docker container image simplifies orchestration on a standard VM or basic Kubernetes cluster `[A-INFRA-01]`.
- **Clean Service Boundaries:** Code is strictly separated into decoupled Python packages (`app.ingestion`, `app.ocr`, `app.llm`, `app.rules`, `app.hitl`, `app.storage`). This enables an easy split into distinct microservices when scaling to 10,000+ docs/day `[A-BUS-03]`.

### 3.2 Compute Server Components

1. **API Gateway & HTTP Web Server (FastAPI + Uvicorn):** Asynchronous ASGI web framework handling REST requests, auth token validation, CORS headers, static asset delivery, and Server-Sent Event (SSE) progress streams.
2. **Distributed Task Workers (Celery + Redis):** Background task processes executing CPU/GPU intensive image transformations, OCR token extraction, LLM API calls, and vector embedding generation.
3. **OCR & Computer Vision Compute Node:** Isolated compute process optimized for PaddleOCR Devanagari text extraction and OpenCV matrix manipulation `[A-AIML-01]`.
4. **LLM Integration Proxy:** Async HTTP wrapper that abstracts interactions with cloud LLMs (Gemini, OpenAI), enforcing token rate limits, retry backoff, and circuit breaker protection `[A-TECH-04]`.
5. **Deterministic Validation Engine:** Lightweight, CPU-bound Python execution service running financial regex, GSTIN Modulo-36 checksums, and table arithmetic reconciliation algorithms.

### 3.3 Server Sizing & Resource Allocation Matrix

| Compute Component | Hackathon Dev Node `[A-INFRA-01]` | Production MVP Node `[A-INFRA-02]` | Scale Target (10k+ docs/day) |
| :--- | :--- | :--- | :--- |
| **API Gateway / Web Server** | 1 vCPU, 2GB RAM | 2 vCPU, 4GB RAM (2 Pods) | 4 vCPU, 8GB RAM (Autoscaled) |
| **Celery Worker Engine** | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM (4 Pods) | 8 vCPU, 16GB RAM (Worker Pool) |
| **OCR Compute Node** | CPU Shared | 4 vCPU, 8GB RAM + NVIDIA T4 | 8 vCPU, 16GB RAM + NVIDIA A10G |
| **PostgreSQL 16 DB** | 1 vCPU, 1GB RAM | 2 vCPU, 4GB RAM (20GB SSD) | 4 vCPU, 16GB RAM (RDS Multi-AZ) |
| **Redis 7.x Cache & Queue** | Shared (512MB RAM) | 1 vCPU, 2GB RAM (ElastiCache) | 2 vCPU, 8GB RAM (Redis Cluster) |
| **MinIO / Object Storage** | Local Disk (20GB) | AWS S3 Bucket (Standard) | AWS S3 + CloudFront CDN |

### 3.4 Load Balancing, Queue Backpressure & Auto-scaling

```
                        ┌──────────────────────────────┐
                        │   Incoming HTTP Request      │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │     Nginx Ingress Proxy      │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │     FastAPI Gateway          │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │  Redis Job Queue (List/Stream)│
                        └──────────────┬───────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │ (Queue Depth < 20)       │ (Queue Depth 20-100)      │ (Queue Depth > 100)
            ▼                          ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Baseline Workers    │    │  Autoscale Workers   │    │  Backpressure Rejection│
│  (2 Active Replicas) │    │  (Scale to 8 Replicas│    │  (HTTP 429 / Retry)  │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

- **Backpressure Monitoring:** Celery worker health and Redis queue depth are monitored continuously. If Redis queue depth exceeds 100 pending jobs, FastAPI initiates rate-limiting backpressure, returning HTTP status `429 Too Many Requests` to non-priority bulk API batch jobs.
- **Horizontal Pod Autoscaling (HPA):** In Kubernetes production, Celery worker Pods autoscale based on custom Prometheus metrics tracking queue length:
  $$\text{Target Replicas} = \left\lceil \frac{\text{Current Queue Depth}}{\text{Target Jobs Per Worker (10)}} \right\rceil$$

### 3.5 Inter-Service Communication Protocols
- **Client $\leftrightarrow$ API Gateway:** Synchronous HTTPS REST (JSON payloads) for data requests and Server-Sent Events (SSE) for real-time processing progress updates.
- **API Gateway $\leftrightarrow$ Redis Queue:** Asynchronous Celery Protocol over Redis TCP socket connections.
- **Worker $\leftrightarrow$ External LLMs:** Asynchronous HTTPS/2 client calls (via `httpx` / `google-genai` SDK) configured with 5-second connection timeouts `[A-TECH-05]`.
- **Worker $\leftrightarrow$ PostgreSQL:** Connection-pooled SQL database access using `SQLAlchemy 2.0` async engine + `AsyncPG` driver.

---

## SECTION 4: AI/ML LAYER (MOST IMPORTANT)

### 4.1 AI Integration Across Processing Lifecycle

| Processing Stage | Processing Task | AI/ML Included? | Model / Engine Used | Input Payload | Output Payload |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Preprocessing** | Auto-rotate, deskew, denoise | No | OpenCV (Non-AI Computer Vision) | Raw RGB Image | Denoised Normalized Image |
| **2. OCR Extraction** | Extract Devanagari/English text | Yes `[A-AIML-01]` | PaddleOCR v4 (PP-OCRv4) | Normalized Image | Bounding Boxes + Text + Confidence |
| **3. Classification** | Detect document type & sections | Yes `[A-AIML-01]` | LayoutLMv3-base | Bounding Boxes + Image | Category Label (`GST_INVOICE`, etc.) |
| **4. Structuring** | Extract JSON fields | Yes `[A-AIML-02]` | Gemini 1.5 Pro / GPT-4o | Bounding Box Text + Prompt | Pydantic Validated JSON Schema |
| **5. Validation** | Checksums, math, GSTIN check | No | Python Rule Engine | Raw Extracted JSON | Validated JSON + Rule Flags |
| **6. Scoring** | Compute field-level score | Hybrid `[A-AIML-03]`| Heuristic Algorithm | OCR + LLM Logprob + Rules | Composite Score $C_{\text{field}} \in [0, 1]$ |
| **7. PII Redaction** | Mask Aadhaar, PAN, Accounts | Yes `[A-PRIV-02]` | Presidio NER + Custom Regex | Extracted JSON Strings | Masked Extracted JSON Strings |
| **8. Semantic Search** | Natural Language query indexing | Yes `[A-AIML-06]` | `bge-m3` Sentence-Transformer | Structured Text Summary | 1024-dim Dense Vector |

### 4.2 Model Selection & Technical Justification

#### 1. OCR Engine: PaddleOCR v4 (PP-OCRv4)
- **Selection:** PaddleOCR v4 Multilingual Devanagari & English models `[A-AIML-01]`.
- **Justification:** Superior character recognition accuracy for Hindi Devanagari script (handles top header line *shirorekha* and vertical matras effectively). Lightweight footprint runs locally on CPU without per-page cloud API charges `[A-AIML-04]`.
- **Alternatives Evaluated:** Tesseract 5 (poor Devanagari accuracy on low DPI scans, $\sim 65\%$), Google Cloud Vision API (excellent accuracy $\sim 95\%$, but introduces $\sim \$1.50/1000$ pages cost and external network dependencies).
- **Fallback Option:** If PaddleOCR character confidence for a document page falls below $0.50$, fallback dynamically to Google Vision API `[A-RISK-02]`.

#### 2. Layout Parsing & Document Classification: LayoutLMv3
- **Selection:** LayoutLMv3-base-uncased pre-trained multimodal layout model.
- **Justification:** Combines visual image layout, spatial 2D bounding boxes, and text tokens to distinguish structurally similar forms (e.g., Form-16 Part A vs Part B) `[A-AIML-01]`.
- **Alternatives Evaluated:** YOLOv8-Document (good for bounding box detection, weak on text context), Rule-based regex keyword matching (brittle across varying invoice templates).

#### 3. Structured Field Extraction Engine: Google Gemini 1.5 Pro
- **Selection:** Google Gemini 1.5 Pro API (with GPT-4o-mini as automated backup) `[A-AIML-02]`.
- **Justification:** Exceptional multi-lingual Devanagari comprehension, robust adherence to Pydantic JSON Schema mode (`response_mime_type="application/json"`), large context window, and competitive pricing matching target per-doc cost limit ($\le \text{₹}2.00$) `[A-AIML-07]`.
- **Alternatives Evaluated:** Open-source Llama-3-70B (requires heavy local GPU infrastructure like $2\times$ A10G), Anthropic Claude 3.5 Sonnet (higher operational API cost $\approx \text{₹}4.50$/doc).

#### 4. Semantic Search Vector Model: `bge-m3` (BAAI)
- **Selection:** `sentence-transformers/bge-m3` dense multilingual embedding model `[A-AIML-06]`.
- **Justification:** Native support for cross-lingual Hindi-English retrieval, multi-functionality (dense retrieval, sparse retrieval, re-ranking), 1024-dimensional embeddings, open-source Apache 2.0 license.

### 4.3 AI Model Hosting & Compute Architecture

| AI Component | Hosting Target | Hardware Allocation | Latency SLA | Operational Cost |
| :--- | :--- | :--- | :--- | :--- |
| **PaddleOCR v4** | Local Container Process | 2 vCPU / NVIDIA T4 GPU | 1.8 seconds / page | ₹0.00 (Self-hosted) `[A-AIML-04]` |
| **LayoutLMv3** | Local Container Process | 2 vCPU / NVIDIA T4 GPU | 0.8 seconds / page | ₹0.00 (Self-hosted) |
| **Gemini 1.5 Pro** | Cloud Managed API | Distributed Cloud API | 2.5 seconds / request | ~₹0.50 - ₹1.20 / doc `[A-AIML-07]` |
| **Presidio PII** | Local Container Process | 1 vCPU (CPU Bound) | 0.2 seconds / doc | ₹0.00 (Self-hosted) |
| **bge-m3 Embeddings**| Local Container Process | 1 vCPU / GPU Shared | 0.3 seconds / doc | ₹0.00 (Self-hosted) |

### 4.4 Detailed AI Pipeline Flowchart

```mermaid
flowchart TD
    RawImage["Raw Input Document\n(PDF / JPEG / PNG)"] --> CV_Prep["Computer Vision Preprocessing\n(Bilateral Filter, Otsu Threshold, Deskew)"]
    
    CV_Prep --> PaddleOCR["PaddleOCR v4 Execution\n(Devanagari + English Text Extraction)"]
    
    PaddleOCR --> OCR_Check{"OCR Confidence\nC_OCR >= 0.50?"}
    
    OCR_Check -- Yes --> TokenAssembly["Assemble Text Tokens & Bounding Boxes\n(x1, y1, x2, y2, text, conf)"]
    OCR_Check -- No (Fallback) --> CloudVisionFallback["Google Cloud Vision API\n(High-Accuracy Fallback OCR)"] --> TokenAssembly
    
    TokenAssembly --> LayoutLM["LayoutLMv3 Model\n(Classify Document Type & Regions)"]
    
    LayoutLM --> PromptBuild["Build Schema Prompt\n(System Rules + OCR Tokens + Target JSON Schema)"]
    
    PromptBuild --> GeminiAPI["Gemini 1.5 Pro LLM Call\n(JSON Schema Mode Enabled)"]
    
    GeminiAPI --> LLM_Check{"LLM Call\nSuccessful?"}
    
    LLM_Check -- No (Error/Timeout) --> GPT4_Fallback["Fallback to OpenAI GPT-4o-mini"] --> SchemaVal
    LLM_Check -- Yes --> SchemaVal["Pydantic Schema Validation\n(Validate JSON Structure)"]
    
    SchemaVal --> RuleEngine["Python Financial Rule Engine\n(GSTIN Checksum, PAN Regex, Math Reconciliation)"]
    
    RuleEngine --> ConfScorer["Composite Field Confidence Engine\nC_field = 0.4*OCR + 0.35*LLM + 0.25*Rule"]
    
    ConfScorer --> PresidioPII["Presidio PII Redactor\n(Mask Aadhaar, PAN, Bank Accounts)"]
    
    PresidioPII --> RoutingCheck{"All Critical Fields\nC_field >= 0.70?"}
    
    RoutingCheck -- Yes --> AutoApproved["Set Status: VERIFIED\n(Save to DB & Index Vectors)"]
    RoutingCheck -- No --> HITLQueue["Set Status: NEEDS_REVIEW\n(Route to HITL Review Queue)"]
```

### 4.5 Prompt Engineering Strategy & JSON Schema Enforcement

To achieve deterministic extraction across semi-structured documents, BharatDoc uses strict system prompts combined with Pydantic JSON schemas passed via API parameter flags (`response_mime_type="application/json"`).

#### Production System Prompt (GST Invoice Extraction)

```text
SYSTEM PROMPT: You are a specialized Indian Financial Document Parsing Engine for BharatDoc.
Your task is to convert raw OCR spatial text tokens extracted from an Indian GST Invoice into a strictly validated JSON structure.

CRITICAL EXTRACTION RULES:
1. Extract ALL fields listed in the JSON Schema. If a field is absent, set its value to null.
2. GSTIN FORMAT: Must be exactly 15 alphanumeric characters matching regex `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`.
3. DEVANAGARI NUMERALS: Translate Devanagari numerals (०, १, २, ३, ४, ५, ६, ७, ८, ९) into ASCII digits (0-9).
4. DATE FORMAT: Standardize all dates to ISO-8601 YYYY-MM-DD format.
5. AMOUNTS: Extract raw monetary values as positive float numbers. Do NOT include currency symbols (₹, Rs, INR).
6. LINE ITEMS: Extract table rows accurately. Ensure Quantity * Rate == Taxable Amount.

OUTPUT REQUIREMENT: Return ONLY a valid JSON object matching the requested schema. Do not include markdown formatting, backticks, or explanatory text.
```

### 4.6 AI Operational Cost Breakdown

| Pipeline Stage | Model / Service | Tokens / Resources Used per Doc | Unit Rate | Average Cost per Doc |
| :--- | :--- | :--- | :--- | :--- |
| **OCR Text Extraction** | PaddleOCR v4 | 1 Page Image Matrix | Self-hosted CPU `[A-AIML-04]` | ₹0.00 |
| **Layout Classification** | LayoutLMv3 | 512 Spatial Tokens | Self-hosted CPU | ₹0.00 |
| **Field Extraction (Primary)** | Gemini 1.5 Pro API | ~1,500 Input Tokens + ~400 Output Tokens | $0.00125 / 1k input, $0.005 / 1k output | **₹0.48** ($0.0058 USD) `[A-AIML-07]` |
| **PII Redaction** | Presidio + Regex | Local Python CPU execution | Self-hosted CPU | ₹0.00 |
| **Vector Embedding** | `bge-m3` Model | ~300 Extracted Text Tokens | Self-hosted CPU `[A-AIML-06]` | ₹0.00 |
| **Total Pipeline Average** | — | — | — | **~₹0.48 / document** (Well within ₹2.00 cap) |

### 4.7 AI Resilience, Circuit Breakers & Fallback Chain

```
               ┌────────────────────────────────────────┐
               │    Primary LLM: Gemini 1.5 Pro API     │
               └───────────────────┬────────────────────┘
                                   │
                     (Timeout > 5s OR HTTP 5xx)
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │  Secondary LLM: OpenAI GPT-4o-mini API │
               └───────────────────┬────────────────────┘
                                   │
                     (Timeout > 5s OR HTTP 5xx)
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │ Tertiary LLM: Local Ollama Llama-3-8B  │
               └───────────────────┬────────────────────┘
                                   │
                               (Failed)
                                   │
                                   ▼
               ┌────────────────────────────────────────┐
               │ Route Document to HITL Queue (Manual)  │
               └────────────────────────────────────────┘
```

1. **Primary Provider Execution:** Send extraction request to Google Gemini 1.5 Pro API with a 5-second socket timeout `[A-TECH-05]`.
2. **Circuit Breaker Activation:** If Gemini API returns 3 consecutive HTTP errors (`500 Internal Error`, `429 Rate Limit`) or fails to respond within 5 seconds, PyBreaker trips open for 60 seconds.
3. **Secondary Fallback:** Traffic immediately redirects to OpenAI `GPT-4o-mini` API endpoint.
4. **Tertiary Local Fallback:** If cloud internet connectivity drops entirely `[A-RISK-01]`, the worker routes jobs to a locally hosted `Ollama Llama-3-8B` instance running on CPU/GPU.
5. **Fail-Safe Routing:** If all LLM providers fail, the raw OCR text is saved, the document status is set to `LLM_PARSE_FAILED`, and it is routed to the human review queue.

### 4.8 AI Model Versioning & ML Registry Strategy
- **MLflow Tracking:** Model weights, OCR configurations, prompt version strings, and Pydantic schemas are tracked in an MLflow registry database.
- **Schema Version Tagging:** Extracted database rows contain a `schema_version` column (e.g., `gst_invoice_v1.2.json`), ensuring backward compatibility if schema fields are updated in future releases.

---

## SECTION 5: DATA LAYER

### 5.1 Database Architecture & Relational DDL Schema

BharatDoc uses **PostgreSQL 16** equipped with the `pgvector` extension for storing structured document attributes, confidence scores, human verification logs, and vector embeddings `[A-TECH-07]`.

```sql
-- Enable PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Document Master Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size_bytes INT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- GST_INVOICE, FORM_16, BANK_STATEMENT, HINDI_BILL
    processing_status VARCHAR(30) NOT NULL DEFAULT 'QUEUED', -- QUEUED, PROCESSING, VERIFIED, NEEDS_REVIEW, FAILED
    overall_confidence_score NUMERIC(4, 3), -- 0.000 to 1.000
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Extracted Document Fields Table
CREATE TABLE document_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL, -- e.g., supplier_gstin, total_amount, invoice_date
    raw_value TEXT,
    normalized_value TEXT,
    masked_value TEXT, -- Masked PII string for display
    ocr_confidence NUMERIC(4, 3),
    llm_confidence NUMERIC(4, 3),
    rule_validated BOOLEAN DEFAULT FALSE,
    composite_confidence NUMERIC(4, 3) NOT NULL,
    bounding_box JSONB, -- {x_min, y_min, x_max, y_max, page_number}
    is_human_corrected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Human-in-the-Loop Review Audit Table
CREATE TABLE human_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    review_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    correction_reason VARCHAR(255)
);

-- 4. Document Vector Search Index Table
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    embedding vector(1024), -- 1024-dimensional bge-m3 dense vector
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for High Performance
CREATE INDEX idx_documents_org_status ON documents(organization_id, processing_status);
CREATE INDEX idx_doc_fields_doc_id ON document_fields(document_id);
CREATE INDEX idx_doc_fields_key_value ON document_fields(field_key, normalized_value);
CREATE INDEX idx_embeddings_vector ON document_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 5.2 Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ DOCUMENTS : owns
    DOCUMENTS ||--o{ DOCUMENT_FIELDS : contains
    DOCUMENTS ||--o{ HUMAN_REVIEWS : triggers
    DOCUMENTS ||--o{ DOCUMENT_EMBEDDINGS : vectors
    DOCUMENTS ||--o{ AUDIT_LOGS : records

    DOCUMENTS {
        uuid id PK
        uuid organization_id FK
        string original_filename
        string file_path
        string document_type
        string processing_status
        float overall_confidence_score
        timestamp created_at
    }

    DOCUMENT_FIELDS {
        uuid id PK
        uuid document_id FK
        string field_key
        string raw_value
        string normalized_value
        string masked_value
        float composite_confidence
        jsonb bounding_box
        boolean is_human_corrected
    }

    HUMAN_REVIEWS {
        uuid id PK
        uuid document_id FK
        uuid reviewer_user_id
        string field_key
        string old_value
        string new_value
        timestamp review_timestamp
    }

    DOCUMENT_EMBEDDINGS {
        uuid id PK
        uuid document_id FK
        string chunk_text
        vector_1024 embedding
    }
```

### 5.3 Blob Storage Architecture & S3 Bucket Layout

Unstructured binary files (PDFs, raw scans, thumbnails) are stored in S3-compatible object storage (MinIO locally, AWS S3 in production) `[A-INFRA-03]`.

```
s3://bharatdoc-storage-ap-south-1/
├── raw-documents/
│   └── org_{org_id}/
│       └── YYYY/MM/DD/
│           └── {doc_uuid}.pdf
├── processed-images/
│   └── org_{org_id}/
│       └── {doc_uuid}/
│           ├── page_1_cleaned.png
│           └── page_1_bbox_overlay.png
├── thumbnails/
│   └── {doc_uuid}_thumb.jpg
└── exports/
    └── org_{org_id}/
        └── tally_export_{batch_id}.xml
```

#### Bucket Lifecycle Policy (DPDP Compliance `[A-PRIV-03]`)
- **Raw & Processed Images (`raw-documents/`, `processed-images/`):** Automatically deleted after **90 days** using S3 Lifecycle Expiration Rules.
- **Extracted PostgreSQL Data:** Retained indefinitely until an explicit user deletion request is received.

### 5.4 Redis Caching & Key Schema Design

Redis 7.x manages background task queues, pub/sub status events, and session states `[A-TECH-08]`.

| Redis Key Structure | Type | Purpose | TTL |
| :--- | :--- | :--- | :--- |
| `job:status:{doc_uuid}` | Hash | Real-time task progress tracking (`stage`, `pct`, `error`) | 24 Hours |
| `job:lock:ocr:{doc_uuid}` | String | Distributed mutex preventing duplicate OCR execution | 5 Minutes |
| `cache:gstin:{gstin_number}` | String | Cached GSTN Portal verification lookup result | 30 Days |
| `ratelimit:api:{tenant_id}` | String | Token bucket counter enforcing rate limits | 1 Minute |

### 5.5 Data Privacy, PII Lifecycle & DPDP Purging

```
[Raw Document Upload] ──> [OCR Extraction] ──> [Presidio PII Redactor]
                                                        │
                                                        ├──> [Masked Strings] ──> [PostgreSQL Storage]
                                                        │    (Aadhaar: XXXX-XXXX-1234)
                                                        │
                                                        └──> [Raw Unmasked Text] ──> [Transient Worker RAM]
                                                                                    │
                                                                                    ▼
                                                                            (Explicit Garbage Collection)
                                                                            (Purged on Job Complete)
```

1. **Transient Processing:** Raw unmasked text resides strictly in volatile container RAM during OCR and LLM parsing `[A-TECH-11]`.
2. **In-Flight Masking:** Presidio masks all identity tokens (Aadhaar, PAN, Bank Accounts) *before* writing records to persistent PostgreSQL tables `[A-PRIV-02]`.
3. **Automated Purge Engine:** A scheduled Celery daily cron job scans PostgreSQL for expired document storage timers, purging raw binary files from S3 after 90 days `[A-PRIV-03]`.

---

## SECTION 6: API DESIGN

### 6.1 Protocol Selection: REST vs GraphQL
BharatDoc adopts **RESTful HTTP APIs** using standard JSON request/response payloads, supplemented by **Server-Sent Events (SSE)** for real-time document progress streaming.

**Justification:** REST facilitates straightforward integration for business developers and ERP platforms (Tally, Zoho Books) without requiring complex GraphQL schema query parsing `[A-BUS-02]`.

### 6.2 Authentication, Authorization & Rate Limiting
- **Authentication:** OAuth2 with JSON Web Tokens (JWT) sent via `Authorization: Bearer <token>` HTTP headers.
- **Role-Based Access Control (RBAC):**
  - `admin`: Full tenant administration, API key rotation, system metrics viewing.
  - `ca_auditor`: Document upload, verification, HITL correction, Tally export.
  - `msme_user`: Document upload, document viewing, simple NL query interface.
- **Rate Limiting:** Enforced via Redis token buckets at 100 requests per minute per IP address for standard APIs, and 10 document upload requests per minute for free tier tenants.

### 6.3 OpenAPI Endpoint Specification Catalog

#### 1. Document Upload (Ingestion API)
- **HTTP Method:** `POST`
- **Path:** `/api/v1/documents/upload`
- **Request Parameters:** `file` (Multipart form-data), `document_type` (Optional hint string).
- **Response Payload (HTTP 202 Accepted):**

```json
{
  "status": "success",
  "message": "Document accepted and enqueued for processing.",
  "data": {
    "document_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "filename": "gst_invoice_vendor_a.pdf",
    "file_size_bytes": 1458200,
    "processing_status": "QUEUED",
    "estimated_completion_seconds": 6.5,
    "sse_status_stream_url": "/api/v1/documents/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d/stream"
  }
}
```

#### 2. Get Document Status & Results
- **HTTP Method:** `GET`
- **Path:** `/api/v1/documents/{document_id}/results`
- **Response Payload (HTTP 200 OK):**

```json
{
  "document_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "processing_status": "NEEDS_REVIEW",
  "document_type": "GST_INVOICE",
  "overall_confidence": 0.685,
  "fields": {
    "supplier_gstin": {
      "raw_value": "07AAAAA0000A1Z5",
      "normalized_value": "07AAAAA0000A1Z5",
      "confidence": 0.980,
      "rule_validated": true,
      "bounding_box": {"x_min": 120, "y_min": 450, "x_max": 380, "y_max": 480, "page": 1}
    },
    "total_amount": {
      "raw_value": "Rs. १२,५००.००",
      "normalized_value": "12500.00",
      "confidence": 0.620,
      "rule_validated": false,
      "bounding_box": {"x_min": 500, "y_min": 920, "x_max": 650, "y_max": 950, "page": 1}
    }
  },
  "hitl_routing_reason": "Field 'total_amount' composite confidence (0.620) is below threshold (0.700)."
}
```

#### 3. Submit Human Review Corrections (HITL API)
- **HTTP Method:** `POST`
- **Path:** `/api/v1/documents/{document_id}/review`
- **Request Body:**

```json
{
  "corrections": [
    {
      "field_key": "total_amount",
      "corrected_value": "12500.00",
      "correction_reason": "Fixed Devanagari digit OCR parse misinterpretation"
    }
  ]
}
```

#### 4. Natural Language Query Interface
- **HTTP Method:** `POST`
- **Path:** `/api/v1/query`
- **Request Body:** `{"query": "Show total GST tax paid to Vendor A in September 2026"}`
- **Response Payload (HTTP 200 OK):**

```json
{
  "query": "Show total GST tax paid to Vendor A in September 2026",
  "generated_sql": "SELECT SUM(CAST(df_tax.normalized_value AS NUMERIC)) FROM document_fields df_tax JOIN document_fields df_vendor ON df_tax.document_id = df_vendor.document_id WHERE df_vendor.normalized_value ILIKE '%Vendor A%' AND df_tax.field_key = 'total_tax_amount';",
  "result_summary": "Total GST tax paid to Vendor A across 4 verified invoices in September 2026 is ₹45,200.00.",
  "data_table": [
    {"invoice_no": "INV-2026-091", "date": "2026-09-04", "tax_amount": 11300.00},
    {"invoice_no": "INV-2026-098", "date": "2026-09-12", "tax_amount": 11300.00}
  ]
}
```

### 6.4 Asynchronous Processing & Real-Time SSE API

Clients open a single persistent HTTP connection to `/api/v1/documents/{id}/stream` to receive processing status events via Server-Sent Events (SSE).

```text
event: status_update
data: {"stage": "CV_PREPROCESSING", "progress_pct": 15, "timestamp": "2026-10-09T01:50:00Z"}

event: status_update
data: {"stage": "DEVANAGARI_OCR", "progress_pct": 45, "timestamp": "2026-10-09T01:50:02Z"}

event: status_update
data: {"stage": "LLM_SCHEMA_EXTRACTION", "progress_pct": 80, "timestamp": "2026-10-09T01:50:05Z"}

event: processing_complete
data: {"status": "VERIFIED", "overall_confidence": 0.94, "results_url": "/api/v1/documents/9b1deb4d.../results"}
```

### 6.5 Error Handling Standard (RFC 7807)
All API errors return standardized JSON compliant with **RFC 7807 Problem Details**:

```json
{
  "type": "https://bharatdoc.in/errors/gstin-checksum-invalid",
  "title": "Invalid GSTIN Checksum",
  "status": 422,
  "detail": "Extracted supplier GSTIN '07AAAAA0000A1Z9' failed Modulo-36 checksum verification.",
  "instance": "/api/v1/documents/9b1deb4d/results",
  "invalid_params": [
    {"name": "supplier_gstin", "reason": "Checksum character expected '5', got '9'"}
  ]
}
```

---

## SECTION 7: FRONTEND ARCHITECTURE

### 7.1 Tech Stack Selection
- **Core Framework:** React 18 / Next.js 14 (App Router) with TypeScript `[A-TEAM-01]`.
- **Styling & Components:** Tailwind CSS + `shadcn/ui` accessible components `[A-TEAM-04]`.
- **State Management:** TanStack Query (React Query v5) for server state management + Zustand for UI state (active bounding boxes, zoom scale).
- **PDF & Image Canvas:** PDF.js + HTML5 `<canvas>` for drawing visual bounding box overlays.

### 7.2 Page Layout Structure & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 NEXT.JS FRONTEND APP                                   │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Header (Logo, Tenant Selector, Role Badge, Notifications)             │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────┬──────────────────────────────────────────────────────┐  │
│  │ Sidebar Menu              │ Main Workspace Router                                │  │
│  │                           │                                                      │  │
│  │ ├─ Upload Dashboard       │ ┌──────────────────────────────────────────────────┐ │  │
│  │ ├─ Batch Processing Queue │ │ Active Route: Split-Screen HITL Verification View │ │  │
│  │ ├─ Verification Workspace │ │                                                    │ │  │
│  │ ├─ NL Query Console       │ │ ┌──────────────────────┬─────────────────────────┐ │ │  │
│  │ └─ Settings & Export      │ │ │ PDF / Image Canvas   │ Extracted Fields Form   │ │ │  │
│  │                           │ │ │ (Bounding Box Overlay│ (Confidence Badges      │ │ │  │
│  │                           │ │ │  Zoom / Rotate / Pan)│  Inline Edit Inputs)    │ │ │  │
│  │                           │ │ └──────────────────────┴─────────────────────────┘ │ │  │
│  │                           │ └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────┴──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Interactive Split-Screen HITL Verification Canvas

The core component of the frontend workspace is the **Split-Screen Interactive Verification Workspace**:

```
┌─────────────────────────────────────────┬──────────────────────────────────────────┐
│ Left Panel: Document Canvas             │ Right Panel: Extracted Fields Form       │
│                                         │                                          │
│ [Zoom In] [Zoom Out] [Rotate]           │ Document Type: [ GST Invoice   ▼ ]       │
│ ┌─────────────────────────────────────┐ │ Overall Confidence: 68.5% (NEEDS REVIEW) │
│ │ TAX INVOICE                         │ │                                          │
│ │ Vendor: ABC Enterprises             │ │ Supplier GSTIN:                          │
│ │ GSTIN: [07AAAAA0000A1Z5]  <───────┼─┼──[07AAAAA0000A1Z5]       [CONF: 98%  ✓]   │
│ │                                     │ │                                          │
│ │ Line Items:                         │ │ Invoice Date:                            │
│ │ 1. Steel Rods - Rs. 12,500.00       │ │  [2026-09-15]             [CONF: 92%  ✓]   │
│ │                                     │ │                                          │
│ │ Total Amount:                       │ │ Total Amount:  (Low Confidence Flag!)    │
│ │  [Rs. १२,५००.००] <────────────────┼─┼──[12500.00           ]  [CONF: 62%  ⚠️]  │
│ │  (Highlighted Yellow BBox)          │ │  (Focus moves canvas view on click)      │
│ └─────────────────────────────────────┘ │                                          │
│                                         │ [Reject Document]   [Save & Approve Data]│
└─────────────────────────────────────────┴──────────────────────────────────────────┘
```

#### Key Interaction Features:
- **Bi-Directional Highlight Syncing:** Clicking an extracted field input on the right panel automatically scrolls and highlights the corresponding bounding box on the PDF canvas on the left.
- **Visual Confidence Indicators:**
  - Green Badge ($\ge 90\%$): High Confidence.
  - Yellow Badge ($70\%\text{--}89\%$): Medium Confidence.
  - Red Alert Badge ($< 70\%$): Low Confidence / Requires Human Review.

### 7.4 Real-Time State Synchronization
The frontend utilizes a custom `useDocumentProgress(documentId)` React hook that connects to the SSE API stream, updating progress bars in real time without polling the database repeatedly.

---

## SECTION 8: SECURITY & PRIVACY

### 8.1 Authentication & RBAC Architecture
- **JWT Standard:** Short-lived JWT access tokens (15-minute expiration) paired with secure HTTP-only refresh cookies (7-day expiration).
- **Role Permissions Matrix:**

| Role | Upload Docs | View Verified Data | Edit / Approve HITL | Export Tally XML | Manage System |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Admin** | Yes | Yes | Yes | Yes | Yes |
| **CA Auditor** | Yes | Yes | Yes | Yes | No |
| **MSME User** | Yes | Yes | No (Read Only) | No | No |

### 8.2 Data Encryption Standards
- **Encryption in Transit:** Mandatory TLS 1.3 encryption across all public endpoints and inter-pod communications. HTTP plain requests are automatically upgraded via 301 redirects.
- **Encryption at Rest:**
  - PostgreSQL DB storage encrypted using **AES-256-GCM**.
  - AWS S3 bucket objects encrypted via **AWS KMS Customer Managed Keys (CMK)**.

### 8.3 Automated PII Detection & Masking Pipeline

```python
# System PII Masking Implementation Snippet
import re
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

class IndiaPIIRedactor:
    def __init__(self):
        self.analyzer = AnalyzerEngine()
        self.anonymizer = AnonymizerEngine()
        
    def redact_pii(self, text: str) -> str:
        # 1. Custom Regex for Indian Aadhaar (12 digits)
        aadhaar_pattern = r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b'
        text = re.sub(aadhaar_pattern, "XXXX-XXXX-1234", text)
        
        # 2. Custom Regex for Indian PAN Card (5 Alpha + 4 Digit + 1 Alpha)
        pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
        text = re.sub(pan_pattern, r'\g<0>[:5]XXXX\g<0>[9]', text)
        
        return text
```

### 8.4 Audit Logging & DPDP Act Compliance
Every document lifecycle action (upload, extraction, review correction, deletion, export) triggers an immutable entry in the `audit_logs` table:

```json
{
  "audit_id": "8f3b2a1c-9d8e-7f6a-5b4c-3d2e1f0a9b8c",
  "document_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "actor_user_id": "usr_ca_mumbai_0912",
  "action": "FIELD_HUMAN_CORRECTION",
  "field_modified": "total_amount",
  "before_value": "1250.00",
  "after_value": "12500.00",
  "ip_address": "103.21.124.85",
  "timestamp": "2026-10-09T01:52:10Z"
}
```

---

## SECTION 9: DEPLOYMENT ARCHITECTURE

### 9.1 Environment Topology
1. **Development Environment (Hackathon):** Single Linux VM (4 vCPU, 8GB RAM) running localized containerized environment via Docker Compose `[A-INFRA-01]`.
2. **Staging Environment:** Single AWS EC2 (`t3.xlarge`) instance running staging workloads against sandbox GST APIs.
3. **Production Environment:** Multi-node AWS EKS Kubernetes cluster in Mumbai (`ap-south-1`) equipped with auto-scaling node groups `[A-INFRA-02]`.

### 9.2 Production-Ready Docker Compose Specification

```yaml
version: '3.8'

services:
  # 1. API Gateway & Web Server
  api_gateway:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: bharatdoc_api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://bharat_usr:SecretPass123@postgres:5432/bharatdoc_db
      - REDIS_URL=redis://redis:6379/0
      - MINIO_ENDPOINT=minio:9000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis
      - minio

  # 2. Celery Async Task Worker Pool
  celery_worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    container_name: bharatdoc_worker
    command: celery -A app.tasks worker --loglevel=info -c 4
    environment:
      - DATABASE_URL=postgresql+asyncpg://bharat_usr:SecretPass123@postgres:5432/bharatdoc_db
      - REDIS_URL=redis://redis:6379/0
      - MINIO_ENDPOINT=minio:9000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis

  # 3. PostgreSQL Database with pgvector
  postgres:
    image: pgvector/pgvector:pg16
    container_name: bharatdoc_postgres
    environment:
      - POSTGRES_USER=bharat_usr
      - POSTGRES_PASSWORD=SecretPass123
      - POSTGRES_DB=bharatdoc_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  # 4. Redis Cache & Message Broker
  redis:
    image: redis:7-alpine
    container_name: bharatdoc_redis
    ports:
      - "6379:6379"

  # 5. MinIO S3 Object Storage
  minio:
    image: minio/minio:RELEASE.2024-01-16T16-07-38Z
    container_name: bharatdoc_minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minio_admin
      - MINIO_ROOT_PASSWORD=minio_secret_pass
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  miniodata:
```

### 9.3 Production Kubernetes (K8s) Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        AWS EKS CLUSTER (ap-south-1 Mumbai)                             │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ AWS Application Load Balancer (ALB) - TLS 1.3 Termination                        │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                          │                                             │
│                     ┌────────────────────┴────────────────────┐                        │
│                     ▼                                         ▼                        │
│  ┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐     │
│  │ FastAPI App Pods (HPA: 2-8 Replicas)│   │ Next.js Web UI Pods (2 Replicas)    │     │
│  └──────────────────┬──────────────────┘   └─────────────────────────────────────┘     │
│                     │                                                                  │
│                     ▼                                                                  │
│  ┌─────────────────────────────────────┐                                               │
│  │ ElastiCache Redis Cluster           │                                               │
│  └──────────────────┬──────────────────┘                                               │
│                     │                                                                  │
│                     ▼                                                                  │
│  ┌─────────────────────────────────────┐                                               │
│  │ Celery Worker Pods (GPU / CPU)      │                                               │
│  │ (HPA based on Queue Length)         │                                               │
│  └──────────────────┬──────────────────┘                                               │
│                     │                                                                  │
│         ┌───────────┴───────────┐                                                      │
│         ▼                       ▼                                                      │
│  ┌──────────────┐       ┌──────────────┐                                               │
│  │ RDS Postgres │       │ AWS S3 Bucket│                                               │
│  │ (Multi-AZ)   │       │ (ap-south-1) │                                               │
│  └──────────────┘       └──────────────┘                                               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.4 CI/CD Pipeline Architecture
Automated build and delivery pipe executed via GitHub Actions:
1. **Lint & Static Analysis:** Run `flake8`, `black`, `mypy`, and `eslint` on pull requests.
2. **Automated Unit Testing:** Execute pytest test suite covering GSTIN checksums and schema validators.
3. **Container Build & Security Scan:** Build Docker images, run Trivy vulnerability scanner.
4. **Push to Registry:** Push signed container images to AWS Elastic Container Registry (ECR).
5. **Kubectl Rollout:** Apply Kubernetes manifests via `helm upgrade --install`.

### 9.5 Observability Stack (Prometheus + Grafana + Loki)
- **Prometheus:** Collects system metrics (HTTP request rates, latency histograms, Celery queue depth, LLM API call response times).
- **Grafana:** Displays real-time operational dashboards tracking document success rates, field confidence averages, and cloud operational expenditure.
- **Loki:** Aggregates container logs for centralized forensic error investigation.

### 9.6 Cloud Infrastructure Budget Breakdown

| Service Component | AWS Service Selection | Sizing / Spec | Monthly Cost (USD) |
| :--- | :--- | :--- | :--- |
| **App Compute** | AWS Fargate / EKS | 2 vCPU, 4GB RAM (2 Replicas) | $48.00 |
| **OCR Worker GPU Node** | AWS EC2 `g4dn.xlarge` | 4 vCPU, 16GB RAM + NVIDIA T4 | $120.00 |
| **Relational Database** | AWS RDS PostgreSQL | `db.t4g.medium` (Single-AZ, 30GB) | $42.00 |
| **Redis Cache** | AWS ElastiCache | `cache.t4g.micro` | $14.00 |
| **Object Storage** | AWS S3 Bucket | 100GB Storage + Transfers | $5.00 |
| **LLM API Allocation** | Google Gemini 1.5 Pro API | ~5,000 Documents / Month | $30.00 `[A-AIML-07]` |
| **Total Operational Spend**| — | — | **$259.00 / month** (Under $300 cap `[A-INFRA-04]`) |

---

## SECTION 10: SCALABILITY & PERFORMANCE

### 10.1 Auto-Scaling Strategy
- **Celery Worker Scaling:** Pods autoscale when Redis queue length exceeds 20 items for more than 2 minutes.
- **Database Scaling:** PostgreSQL uses connection pooling (`PgBouncer`) capping active database connections at 100 to prevent connection exhaustion under heavy load.

### 10.2 Performance Target & Latency Budget Allocation

```
Overall End-to-End Processing Budget: <= 6.50 Seconds
├── 1. File Upload & Ingestion API   [0.30s] █
├── 2. Image Preprocessing (OpenCV)  [0.50s] ██
├── 3. Devanagari OCR (PaddleOCR)    [1.80s] ███████
├── 4. Document Classification       [0.40s] █
├── 5. LLM Extraction (Gemini API)   [2.80s] ███████████
├── 6. Rule Checksums & Confidence   [0.20s] █
└── 7. DB Save & Notification        [0.50s] ██
```

### 10.3 System Bottlenecks & Mitigation Playbook

| System Bottleneck | Root Cause | Mitigation Strategy |
| :--- | :--- | :--- |
| **Devanagari OCR Speed** | Heavy CPU rasterization of high-DPI scans | Pre-scale image to max 2000px width before passing to PaddleOCR. |
| **LLM API Rate Limits** | External API HTTP 429 quota exhaustion | Client-side Redis token bucket rate limiter with exponential backoff `[A-RISK-04]`. |
| **Multi-page PDF Parsing** | Processing 10-page documents sequentially | Parallelize page rendering across Celery sub-tasks using `pdf2image`. |

### 10.4 Multi-Tier Caching Architecture
1. **OCR Text Cache:** SHA-256 image hashes are cached in Redis. Re-uploading the same physical image reuses previous OCR tokens instantly.
2. **GSTIN Lookup Cache:** Verified GSTIN company names are cached for 30 days, skipping repeated sandbox API calls.

---

## SECTION 11: RELIABILITY & FAULT TOLERANCE

### 11.1 Retry & Exponential Backoff Strategy
For transient external network failures, Celery tasks execute retries using an exponential backoff formula with full jitter:
$$T_{\text{wait}} = \text{random}\left(0, \, \min\left(M_{\text{max}}, \, B \times 2^{\text{attempt}}\right)\right)$$
Where base backoff $B = 2.0\text{ seconds}$, maximum ceiling $M_{\text{max}} = 60\text{ seconds}$, and max retry attempts $= 3$.

### 11.2 Circuit Breaker Implementation

```python
import pybreaker
import httpx

# Circuit breaker opens after 3 consecutive failures, resets after 60 seconds
llm_circuit_breaker = pybreaker.CircuitBreaker(
    fail_max=3,
    reset_timeout=60,
    name="Gemini_LLM_Circuit_Breaker"
)

@llm_circuit_breaker
async def call_gemini_extraction_api(payload: dict) -> dict:
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro", json=payload)
        response.raise_for_status()
        return response.json()
```

### 11.3 Dead Letter Queue (DLQ) Architecture
If a document fails processing after 3 complete task retries, it is automatically transferred to the Celery Dead Letter Queue (`bharatdoc_dlq`), updating document status in PostgreSQL to `FAILED_DLQ` and notifying system administrators.

### 11.4 Disaster Recovery & Backup Standard
- **PostgreSQL Database:** Automated daily point-in-time recovery (PITR) with continuous WAL archiving to an isolated AWS S3 bucket.
- **RTO (Recovery Time Objective):** $< 2$ Hours.
- **RPO (Recovery Point Objective):** $< 5$ Minutes.

---

## SECTION 12: INDIA-SPECIFIC CONSIDERATIONS

### 12.1 Hindi & Devanagari OCR Nuances
Processing Devanagari script requires handling structural features unique to Indic languages:
1. **Shirorekha (Continuous Header Line):** Devanagari characters hang from a continuous top horizontal bar. PaddleOCR uses line-segmentation pre-processing to prevent character segmentation errors.
2. **Matra Segmentation:** Vowels appear above, below, before, or after base consonants (e.g., `ि`, `ी`, `ु`, `ू`). The OCR engine maintains a 2D spatial bounding box to associate floating matras with their parent consonant.
3. **Complex Conjunct Consonants:** Handles merged Devanagari ligatures (e.g., `क्ष`, `त्र`, `ज्ञ`, `श्र`).

### 12.2 Indian Financial & Identity Validation Engine

#### 1. GSTIN Modulo-36 Checksum Algorithm
India's 15-character Goods and Services Tax Identification Number (GSTIN) contains an embedded Modulo-36 checksum algorithm at position 15.

```
GSTIN Structure: [07] [AAAAA0000A] [1] [Z] [5]
                  │       │         │   │   └─ Checksum Digit (Position 15)
                  │       │         │   └───── Default character 'Z'
                  │       │         └──────── Entity Code
                  │       └────────────────── PAN Card Number (10 Chars)
                  └────────────────────────── State Code (01-38)
```

```python
def validate_gstin_checksum(gstin: str) -> bool:
    """
    Validates a 15-character Indian GSTIN using the official Modulo-36 Checksum algorithm.
    """
    if not gstin or len(gstin) != 15:
        return False
        
    gstin = gstin.upper()
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    char_map = {c: i for i, c in enumerate(chars)}
    
    factor = 1
    total_sum = 0
    modulus = 36
    
    for i in range(14):
        code_point = char_map.get(gstin[i], -1)
        if code_point == -1:
            return False
            
        product = code_point * factor
        factor = 2 if factor == 1 else 1
        
        quotient, remainder = divmod(product, modulus)
        total_sum += quotient + remainder
        
    remainder = total_sum % modulus
    check_code_point = (modulus - remainder) % modulus
    expected_check_char = chars[check_code_point]
    
    return gstin[14] == expected_check_char
```

#### 2. Devanagari Numerals Normalizer
Translates traditional Devanagari numeric characters into standard ASCII digits:

```python
def normalize_devanagari_numerals(text: str) -> str:
    """
    Converts Devanagari digits (०-९) into standard ASCII digits (0-9).
    """
    devanagari_map = str.maketrans({
        '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
        '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    })
    return text.translate(devanagari_map)
```

### 12.3 DPDP Act 2023 Compliance & Data Residency
- **Data Localization:** All infrastructure, data stores, and S3 buckets are pinned to `ap-south-1` (Mumbai), ensuring compliance with the Digital Personal Data Protection Act `[A-PRIV-05]`.
- **Right to Erasure:** Calling `DELETE /api/v1/user/data` triggers an automated purging script that deletes raw files, DB rows, and vector embeddings within 24 hours.

### 12.4 Low-Bandwidth Optimizations
- **Client-Side Image Compression:** The Next.js frontend compresses physical camera captures using WebP compression prior to network transmission, reducing upload sizes by up to $80\%$.

---

## SECTION 13: ARCHITECTURAL TRADE-OFFS & DECISION MATRIX

| Architectural Decision | Chosen Solution | Evaluated Alternative | Technical Rationale & Trade-Off | Linked Assumption |
| :--- | :--- | :--- | :--- | :--- |
| **System Topology** | **Modular Monolith** | Microservices Architecture | Eliminates network RPC complexity for 36-hour hackathon. Clean module separation permits future microservice extraction `[A-TEAM-02]`. | `[A-INFRA-01]`, `[A-TEAM-03]` |
| **OCR Core Engine** | **PaddleOCR v4** | Google Cloud Vision API | Free, runs locally on CPU/GPU, superior Devanagari matra handling. Zero per-page cloud costs `[A-AIML-01]`. | `[A-TECH-03]`, `[A-AIML-04]` |
| **Field Extraction** | **Gemini 1.5 Pro LLM** | Fine-tuned LayoutLMv3 | Schema prompting avoids expensive custom ML model training during the hackathon `[A-AIML-05]`. | `[A-AIML-02]`, `[A-AIML-07]` |
| **Relational Database**| **PostgreSQL + pgvector** | MongoDB + Pinecone | Provides ACID transactional consistency for financial data while handling vector search in a single DB instance `[A-TECH-07]`. | `[A-TECH-07]`, `[A-AIML-06]` |
| **Async Task Broker** | **Redis + Celery** | Apache Kafka | Redis provides simple setup for 1,000 concurrent jobs without the operational overhead of Kafka clusters `[A-TECH-08]`. | `[A-TECH-08]`, `[A-TEAM-03]` |

---

## SECTION 14: FUTURE ROADMAP

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                BHARATDOC SYSTEM ROADMAP                                │
│                                                                                        │
│  [PHASE 1: Hackathon MVP] (Current 36-Hour Scope)                                      │
│  ├─ Devanagari + English OCR, LayoutLMv3 & Gemini 1.5 Pro Parsing                      │
│  ├─ Core Doc Types: GST Invoices, Form-16, Bank Statements, Hindi Bills                │
│  ├─ Rule Engine: GSTIN Checksum, Devanagari Digits, PII Masking                        │
│  └─ Next.js Split-Screen Interactive HITL Review Workspace                             │
│                                                                                        │
│  [PHASE 2: Post-Hackathon 3-Month Scale-Up]                                            │
│  ├─ Multi-lingual Expansion: Tamil, Telugu, Bengali, Gujarati OCR                       │
│  ├─ Tally Prime ERP & Zoho Books direct accounting API sync                            │
│  └─ Containerized Air-Gapped On-Premises Enterprise Package                            │
│                                                                                        │
│  [PHASE 3: 6-Month Enterprise Integration]                                             │
│  ├─ Domain Fine-Tuned Layout Models on 100k Indian Business Documents                  │
│  ├─ Native iOS / Android Mobile Scanning Application                                   │
│  └─ Automated Multi-Bank Statement Financial Reconciliation                            │
│                                                                                        │
│  [PHASE 4: 1-Year Ecosystem Platform]                                                  │
│  ├─ BharatDoc Developer SDKs (Python, Node.js, Go)                                     │
│  └─ Enterprise Workflow Automation Builder Marketplace                                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 15: APPENDIX

### 15.1 Technical Glossary
- **GSTIN:** Goods and Services Tax Identification Number (15-character unique Indian tax identifier).
- **Devanagari:** The Indic script used for writing Hindi, Marathi, Sanskrit, and Nepali.
- **Shirorekha:** The top horizontal header bar connecting Devanagari letters into words.
- **HITL:** Human-in-the-Loop (Workflow routing low-confidence data to human operators).
- **DPDP Act:** Digital Personal Data Protection Act 2023 (Indian data privacy law).
- **Presidio:** Microsoft open-source PII detection and anonymization SDK.
- **pgvector:** Open-source vector similarity search extension for PostgreSQL.

### 15.2 Academic & Industry References
1. Du, Y., et al. (2022). *PP-OCRv3: More Compact and Accurate End-to-End OCR System*. arXiv:2206.03001.
2. Huang, Y., et al. (2022). *LayoutLMv3: Pre-training for Document AI with Unimodal and Multimodal Tasks*. ACM Multimedia.
3. Government of India. (2023). *The Digital Personal Data Protection Act, 2023*. Ministry of Law and Justice.
4. Goods and Services Tax Network (GSTN). (2024). *GSTIN Verification and Checksum Algorithm Specifications*.

### 15.3 Production JSON Schemas

#### Production Pydantic Schema (GST Invoice)

```python
from pydantic import BaseModel, Field
from typing import List, Optional

class InvoiceItem(BaseModel):
    item_description: str = Field(description="Description of goods or services")
    hsn_sac_code: Optional[str] = Field(None, description="HSN or SAC code")
    quantity: Optional[float] = Field(None, description="Quantity of items")
    unit_rate: Optional[float] = Field(None, description="Rate per unit")
    taxable_amount: float = Field(description="Total taxable value for item")
    gst_rate_pct: Optional[float] = Field(None, description="GST Tax Rate percentage")

class GSTInvoiceSchema(BaseModel):
    supplier_name: str = Field(description="Full legal name of supplying business")
    supplier_gstin: str = Field(description="15-character GSTIN of supplier")
    invoice_number: str = Field(description="Invoice reference number")
    invoice_date: str = Field(description="Invoice date in YYYY-MM-DD format")
    buyer_name: Optional[str] = Field(None, description="Name of purchasing entity")
    buyer_gstin: Optional[str] = Field(None, description="15-character GSTIN of buyer")
    items: List[InvoiceItem] = Field(default_factory=list, description="Line items list")
    total_taxable_value: float = Field(description="Subtotal taxable amount")
    cgst_amount: Optional[float] = Field(0.0, description="Central GST Tax Amount")
    sgst_amount: Optional[float] = Field(0.0, description="State GST Tax Amount")
    igst_amount: Optional[float] = Field(0.0, description="Integrated GST Tax Amount")
    total_invoice_amount: float = Field(description="Grand total invoice amount")
```

### 15.4 Production-Grade Validation Code (Python)

```python
import re

def validate_pan_format(pan: str) -> bool:
    """
    Validates Indian Permanent Account Number (PAN) format.
    Format: 5 Uppercase Letters + 4 Digits + 1 Uppercase Letter (e.g., ABCDE1234F).
    Fourth character represents status: P (Person), C (Company), F (Firm), H (HUF), T (Trust).
    """
    if not pan or len(pan) != 10:
        return False
    pattern = r'^[A-Z]{3}[PCHFTABGJL]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$'
    return bool(re.match(pattern, pan.upper()))

def validate_ifsc_code(ifsc: str) -> bool:
    """
    Validates Indian Financial System Code (IFSC) format used for NEFT/RTGS bank transfers.
    Format: 4 Letters (Bank Code) + 0 (Control Character) + 6 Alphanumeric Characters.
    Example: SBIN0001234.
    """
    if not ifsc or len(ifsc) != 11:
        return False
    pattern = r'^[A-Z]{4}0[A-Z0-9]{6}$'
    return bool(re.match(pattern, ifsc.upper()))
```

### 15.5 Assumption Traceability Matrix

| Assumption ID | Parameter / Claim | System Component Linked | Architecture Section | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| `[A-BUS-01]` | Target MSME / CA Users | Client Layer & RBAC | Section 1.1, Section 7.1, Section 8.1 | User Persona Requirements Check |
| `[A-BUS-03]` | 100-1k docs/day (MVP) $\rightarrow$ 10k+ (Scale) | Server Topology & DB | Section 3.3, Section 5.1, Section 10.1 | Load Testing (`locust`) |
| `[A-BUS-04]` | Hindi Devanagari + English Scope | OCR & AI Pipeline | Section 4.2, Section 12.1 | Devanagari Test Suite (30 Docs) |
| `[A-BUS-05]` | GST, Form-16, Bank, Hindi Bill Scope | JSON Schemas | Section 4.5, Section 15.3 | Schema Validation Suite |
| `[A-BUS-07]` | HITL Confidence Threshold $< 0.70$ | Confidence Engine | Section 2.3, Section 4.4, Section 7.3 | Automated Routing Unit Test |
| `[A-TECH-03]` | Devanagari Character Accuracy $\ge 85\%$ | PaddleOCR Engine | Section 4.2, Section 12.1 | OCR Ground Truth Comparison |
| `[A-TECH-07]` | PostgreSQL 16 100k Document Scale | Database Architecture | Section 5.1, Section 9.2 | DB Benchmark Script |
| `[A-TECH-08]` | Redis 1,000 Concurrent Jobs | Task Queue Broker | Section 3.4, Section 5.4 | Redis Memory Benchmarking |
| `[A-AIML-01]` | Open-Source Models (PaddleOCR, LayoutLM) | AI Processing Layer | Section 4.2, Section 4.3 | Local Execution Benchmark |
| `[A-AIML-03]` | Composite Confidence Formula | Confidence Calculator | Section 4.1, Section 4.4 | Heuristic Formula Verification |
| `[A-AIML-07]` | LLM Cost Ceiling $\le \text{₹}2.00$ / doc | LLM Proxy Module | Section 4.6, Section 9.6 | API Token Tracker Log |
| `[A-INFRA-01]`| 4 vCPU / 8GB RAM Hackathon Container | Docker Compose Setup | Section 3.3, Section 9.2 | Docker Compose Deployment Test |
| `[A-INFRA-04]`| Cloud Monthly Budget $< \$300$ | Cloud Architecture | Section 9.6 | Cloud Calculator Estimate |
| `[A-PRIV-02]`| PII Masking (Aadhaar, PAN, Accounts) | Presidio Redactor Engine| Section 5.5, Section 8.3 | PII Detection Unit Test Suite |
| `[A-PRIV-03]`| 90-Day Raw File Retention Purge | S3 Lifecycle Rules | Section 5.3, Section 12.3 | S3 Lifecycle Policy Inspection |
| `[A-PRIV-05]`| India Data Residency (`ap-south-1`) | AWS Infrastructure | Section 5.5, Section 12.3 | IAM Policy & Terraform Verification |
| `[A-TEAM-02]`| 36-Hour Hackathon Execution Window | Development Scope | Section 3.1, Section 14 | Timeline Milestone Check |
| `[A-RISK-01]`| LLM API Outage Fallback Chain | Circuit Breaker & Retry | Section 4.7, Section 11.2 | Simulated Outage Injection Test |
| `[A-RISK-04]`| LLM Rate Limit Prevention | Redis Rate Limiter | Section 3.4, Section 6.2, Section 10.3 | Token Bucket Load Test |

---

*Report compiled and generated for BharatDoc AI Document Intelligence Platform.*  
*AVINYA 2K26 Hackathon, Indian Institute of Technology (IIT) Kanpur.*
