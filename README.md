# 🏥 HealthCare — Enterprise Telehealth & Clinical Consultation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Google_Gemini-Applied_AI_&_RAG-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini RAG" />
  <img src="https://img.shields.io/badge/Server--Sent_Events-Live_Token_Streaming-FF6B6B?style=for-the-badge&logo=fastapi&logoColor=white" alt="SSE Streaming" />
  <img src="https://img.shields.io/badge/Docker-Standalone_Container-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD_Automated-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions CI/CD" />
  <img src="https://img.shields.io/badge/Nginx-Reverse_Proxy_Gateway-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx Gateway" />
  <img src="https://img.shields.io/badge/Stripe-Secured_Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## 📌 Executive Summary

**HealthCare** is an enterprise-grade digital health and clinical consultation web platform designed to support millions of patients, board-certified doctors, and hospital administrators. Built with **Next.js 16 (App Router)** and **React 19**, the platform unites specialist discovery, real-time schedule locking, dual-track payment systems (Stripe + Automated Pay Later with live expiration countdown), secure Cloudinary PDF invoice delivery, and end-to-end encrypted telehealth records.

Engineered with high-availability cloud standards, the frontend features **Next.js Standalone Containerization** (reducing image size down to **87 MB**), a unified **Nginx Single Gateway Reverse Proxy**, full **GitHub Actions CI/CD Automation**, and dedicated **Admin Observability & BullMQ Queue Monitoring**.

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client_Layer ["Client Layer (Browser)"]
        User["Patient / Doctor / Admin"]
        Browser["Next.js 16 Client App (Port 3000)"]
    end

    subgraph Gateway_Layer ["Nginx High-Performance Gateway (Port 80)"]
        NginxGateway["Nginx Reverse Proxy & Load Balancer<br/>(Rate Limiting, Gzip, SSL Termination)"]
    end

    subgraph CI_CD ["Automated CI/CD Pipeline (GitHub Actions)"]
        CI["CI: Lint + TypeCheck + Build Verification"]
        CD["CD: Automated Zero-Downtime VPS Deployment"]
    end

    subgraph Container_Cluster ["Containerized Microservices Cluster"]
        FrontendContainer["healthcare_frontend<br/>(Next.js Standalone Runner)"]
        BackendCluster["Backend API Replicas<br/>(Express 5, TypeScript, Prisma)"]
        RedisQueues["healthcare_redis<br/>(BullMQ Worker Queues & Rate Limits)"]
    end

    subgraph Cloud_Services ["Managed Cloud Infrastructure"]
        PostgresDB[("PostgreSQL Database<br/>(Clinical & Patient Records)")]
        StripeGateway["Stripe Payments<br/>(Checkout & Webhook Events)"]
        CloudinaryCDN["Cloudinary Storage<br/>(Encrypted Medical Reports & Invoices)"]
    end

    User --> Browser
    Browser -->|Direct Web Traffic| FrontendContainer
    Browser -->|Unified API Gateway| NginxGateway
    FrontendContainer -->|Next.js SSR & Rewrite Proxy| NginxGateway
    NginxGateway -->|Load-Balanced Requests| BackendCluster
    BackendCluster <--> RedisQueues
    BackendCluster <--> PostgresDB
    BackendCluster <--> StripeGateway
    BackendCluster <--> CloudinaryCDN
    CI --> CD -->|Deploy via SSH| FrontendContainer
```

---

## 🚀 Automated CI/CD Pipeline (GitHub Actions)

The repository implements a robust, continuous integration and continuous deployment (CI/CD) lifecycle configured via **GitHub Actions**:

### 1. Continuous Integration (`.github/workflows/ci.yml`)
- **Triggers:** Every push to `main`, `dev`, or `feature/**` branches, and on Pull Requests targeting `main` or `dev`.
- **Concurrency Control:** Cancels superseded in-progress builds to conserve runner compute minutes.
- **Automated Quality Checks:**
  1. **Clean Installation:** `npm ci --legacy-peer-deps` using automated Node.js v20 npm caching.
  2. **ESLint Code Quality Audit:** Validates clean syntax, React Compiler standards, and Next.js best practices (`npm run lint`).
  3. **Strict Type-Checking:** Runs `npx tsc --noEmit` across all 48 App Router routes and modules to prevent runtime type errors.
  4. **Standalone Production Build Verification:** Executes `npm run build` with mock gateway variables to guarantee zero build breakages.

### 2. Continuous Deployment (`.github/workflows/deploy.yml`)
- **Triggers:** Automatically on push to `main` branch (or manual dispatch).
- **Execution Workflow:**
  1. Secure authentication via encrypted SSH (`appleboy/ssh-action@v1.0.3`) into the production Linux VPS.
  2. Executes repository sync (`git pull origin main`).
  3. Rebuilds and launches the Next.js standalone container (`docker compose up -d --build --remove-orphans`).
  4. Automatic garbage collection of dangling layers (`docker image prune -f`) to maintain lean server storage.

---

## 🤖 Enterprise Applied AI & Clinical RAG Frontend Architecture

Our frontend features a clinical-grade **AI Health Assistant & Medical Triage Interface** built on real-time **Server-Sent Events (SSE) streaming**, **ChatGPT / Gemini-style multi-session history**, and **Retrieval-Augmented Generation (RAG)** visualization. It bridges patients directly to board-certified hospital specialists while enforcing deterministic medical safety guardrails.

```mermaid
flowchart TD
    Patient["Patient Query<br/>(Natural Language Bengali / English)"] --> ClientInput["AIChatInput Component<br/>• Auto-Growing Textarea<br/>• Multi-Device Quick Chips (Wheel / Chevrons / Drag)"]
    
    ClientInput --> HookEngine["useAIChatStream Hook Engine"]
    
    subgraph MultiSession["1. ChatGPT / Gemini Multi-Session Memory"]
        HookEngine --> LocalStorage[("localStorage: healthcare_ai_chat_sessions_v2")]
        DrawerUI["AIChatHistoryDrawer (Slide-Over Sidebar)<br/>• Session Auto-Titling<br/>• Instant Context Switching<br/>• Session Deletion & History Cleanup"] <--> LocalStorage
    end
    
    subgraph SSEStreamingEngine["2. Real-Time Network & Streaming Layer"]
        HookEngine --> NetService["aiService.streamAIChat()<br/>POST /api/v1/ai/chat/stream"]
        AbortSig["AbortController Signal<br/>('Stop Generating' Action)"] -.-> NetService
        NetService --> ChunkBuffer["SSE Buffer Reassembly Pipeline<br/>• Fragment Boundary Split ('\\n\\n')<br/>• Token-by-Token Accumulator (TTFT < 300ms)"]
    end
    
    subgraph ClinicalPresentation["3. Medical Triage & Action Layer"]
        ChunkBuffer -- "token event" --> LiveBubble["AIMessageBubble<br/>(Real-Time Markdown Typing)"]
        ChunkBuffer -- "done event" --> TriageParser["Clinical Metadata Parser"]
        
        TriageParser -- "isEmergency = true" --> EmergencyAlert["🚨 AIEmergencyBanner<br/>Deterministic 999 Hotline & ER Directives"]
        TriageParser -- "Specialist Recommendation" --> DocCard["AIDoctorRecommendationCard<br/>• Sanitized Profile & Specialty<br/>• Dynamic 'Book Slot' Link"]
        TriageParser -- "RAG Citations" --> SourceCite["Verified Clinical Sources Dropdown<br/>(Cosine Similarity >= 0.35)"]
    end

    subgraph AdminObservability["4. Admin Vector Store Management"]
        AdminUser["Hospital Administrator"] --> AdminPage["Admin Dashboard: /admin/dashboard/ai-knowledge"]
        AdminPage --> StatsCard["Vector Store Telemetry Cards<br/>(Total Vectors, Category Breakdown)"]
        AdminPage --> SyncAction["Incremental SHA-256 Vector Sync<br/>(POST /api/v1/ai/sync)"]
        AdminPage --> Sandbox["Live Triage & Vector Simulator"]
    end
```

### 🧠 Core Frontend AI Engineering Pillars

#### 1. Real-Time SSE Token-by-Token Streaming with Defragmentation Buffer
- **The Problem:** Traditional single-payload REST APIs force patients to stare at a loading spinner for 3 to 6 seconds before seeing any response. Furthermore, standard HTTP chunks can fragment JSON payloads across packet boundaries (e.g., `data: {"text": "par` in chunk 1 and `tial"}` in chunk 2), causing naive `JSON.parse` logic to crash.
- **Our Solution:** A custom chunk reassembly engine in `aiService.streamAIChat()`:
  - Consumes incoming chunks via `response.body.getReader()` and `TextDecoder("utf-8")`.
  - Buffers and splits chunks on double-newline SSE boundaries (`\n\n`), keeping trailing partial fragments in memory until the next chunk arrives.
  - Emits real-time tokens with a **Time-To-First-Token (TTFT) under 300ms**.
- **Stream Abortion (Stop Generating):** Integrated with an `AbortController`. When the user clicks "Stop", the controller triggers `reader.cancel()` immediately, terminating frontend state updates and closing the network stream.

#### 2. ChatGPT, Gemini & Claude Style Multi-Session Conversation History
- **Slide-Over History Drawer (`AIChatHistoryDrawer.tsx`):** A slide-over glassmorphic panel accessible via the hamburger menu icon in the chat header.
- **Auto-Session Titling:** New consultation sessions are dynamically titled using the patient's first clinical query (e.g., *"আমার হাঁটুতে অনেক ব্যথা..."*), just like ChatGPT and Gemini.
- **Complete Session Lifecycle:**
  - `+ New Consultation`: Spawns a fresh session with an initialized clinical greeting.
  - Seamless session switching: Restores past conversation messages and doctor recommendations in $O(1)$ time.
  - Individual session deletion (`Trash2`) and complete history wipe (`Clear all`).
  - **Local Persistence:** Preserves session histories in `localStorage` across page reloads and browser sessions.

#### 3. Deterministic Clinical Emergency Triage & Rule-0 Visualization
- **Acute Emergency Highlighting (`AIEmergencyBanner.tsx`):** When the backend's deterministic regex engine flags a life-threatening symptom (e.g., myocardial infarction, severe dyspnea, acute stroke), the UI renders an animated crimson emergency beacon.
- **Direct 999 Hotline Action:** Overrides standard appointment booking with an immediate action button dialing Bangladesh Emergency Services (`tel:999`) and directs the patient to the nearest emergency room.

#### 4. Board-Certified Doctor Recommendations & Direct Booking Integration
- **Sanitized Doctor Cards (`AIDoctorRecommendationCard.tsx`):** Replaces raw backend text with clean specialist cards displaying avatar fallback initials, consultation fees, and formatted specialties (cleaning database indices like `neurology -1` into clean labels).
- **Direct Booking Link:** Seamlessly binds recommendation cards to the doctor's booking route (`/doctors/[id]`), allowing patients to reserve a slot within seconds of AI triage.
- **Verified Clinical RAG Citations:** Collapsible accordion listing verified database sources (Doctors, Specialties, Policies) matching the query with cosine similarity scores ($\ge 0.35$).

#### 5. Multi-Device Accessible Quick Ask Chips (Desktop Wheel, Chevrons & Drag)
- **Desktop Mouse Wheel Translation:** Solves the classic browser bug where vertical mouse wheels (`deltaY`) fail to scroll horizontal `overflow-x` containers by translating vertical scroll inputs into horizontal offset shifts.
- **Floating Navigation Chevrons (`<` & `>`):** Rendered dynamically when chips overflow the viewport, allowing one-click scrolling.
- **Mouse Drag-to-Scroll:** Enables click-and-drag horizontal swiping on desktop alongside native touch swiping on mobile.

#### 6. Admin AI Vector Knowledge Base & Telemetry Dashboard (`/admin/dashboard/ai-knowledge`)
- **Direct Admin Navigation:** Integrated into the Admin Sidebar under `System & Monitoring`.
- **Live Vector Store Telemetry:** Visualizes total indexed vectors, doctor document counts, specialty tags, and pgvector cosine distance health metrics (`GET /api/v1/ai/stats`).
- **One-Click Incremental Sync:** Trigger button for `POST /api/v1/ai/sync` with loading spinners and status toasts.
- **Live Triage & Vector Simulator:** Interactive administrative sandbox allowing staff to test Bengali or English symptom queries and preview vector matching in real-time.

---

## ✨ Core Features & Architectural Highlights

### 1. 🌟 High-Conversion Clinical Landing Page
- **Interactive Specialist Search Bar:** Embedded search with real-time specialty filtering and auto-suggestion directly linked to `/doctors`.
- **Dynamic Clinical Departments:** Dynamic data-fetching of medical departments (Cardiology, Neurology, Pediatrics, Orthopedics, Ophthalmology, etc.).
- **Live Doctor Showcase:** Server-rendered doctor cards featuring verified credentials, designation, hospital affiliation, consultation fee, and direct booking CTA.
- **Modern Bento Grid Ecosystem:** Showcases encrypted video telemedicine, cloud e-prescriptions, Stripe checkout, and zero-conflict schedule locking.

### 2. 📅 Zero-Conflict Doctor Scheduling & Booking Engine
- **Slot Reservation Algorithm:** Transactional slot locking prevents double booking and schedule collision.
- **Timezone & Running Date Normalization:** Automatically filters out historical/passed schedule slots to reduce client-side payload and eliminate database load.
- **Smart Appointment Tracking:** Immediate feedback with full booking review modal, doctor summary, and calendar integration.

### 3. 💳 Intelligent Dual-Payment Architecture
- **Stripe Card Checkout:** Seamless integration with Stripe hosted checkout and asynchronous webhook event synchronization.
- **Automated Pay-Later Reservation with Real-Time Expiry:**
  - Patients can reserve their slot instantly without immediate payment.
  - **30-Minute Live Countdown Component (`PayLaterCountdown.tsx`):** Displays real-time remaining minutes and seconds.
  - **Urgent 5-Minute Warning State:** At $\le 5$ minutes, switches into an animated pulsing alert beacon (`⚠️ Hurry! Pay before auto-cancel`).
  - **Auto-Expiration Protection:** Expired bookings automatically deactivate the "Pay Online" button to avoid conflict and keep slot availability clean.
- **Official PDF Invoice Delivery:** Generates PDF invoices stored securely in Cloudinary with dedicated delivery permissions and browser preview.

### 4. 🛡️ Admin Telemetry & Real-Time Monitoring Ecosystem
- **Request Logs & HTTP Telemetry (`/admin/dashboard/request-logs`):**
  - High-throughput audit buffer tracking request path, HTTP method badge, response status codes, latencies, IP addresses, and user-agent devices.
  - Role-based user tracking: Displays authenticated user role badges (`SUPER_ADMIN`, `ADMIN`) and user IDs alongside anonymous public traffic.
  - Fast search, method/status code filtering, and instant audit log cleanup.
- **Background Job Queues Dashboard (`/admin/dashboard/queues`):**
  - Embedded **BullMQ & Bull-Board** visual monitoring dashboard.
  - Real-time visibility into active workers: Email Notification Queue, Stripe Webhook Processing, and Schedule Auto-Release Cron.
  - Same-origin reverse proxy (`next.config.ts` rewrites) eliminating CORS and `X-Frame-Options: SAMEORIGIN` restrictions while automatically relaying authorization cookies.

### 5. 📊 Patient & Doctor Clinical Portals
- **Server-Side Pagination (`AppPagination.tsx`):** Fast URL-driven search parameter pagination (`?page=1&limit=6`) with total records metadata counters.
- **Appointments Management:** Distinct status badges for `SCHEDULED`, `COMPLETED`, and `CANCELED` consultations.
- **Digital Health Records & Prescriptions:** Direct access to medical records, prescriptions, and official receipts.

### 6. 🔐 Role-Based Access Control (RBAC) & Next.js Middleware
- Strict multi-role protection (`PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`).
- Next.js edge middleware inspecting HttpOnly JWT tokens, silent refresh-token rotation, and instant unauthenticated redirects.

---

## 🐳 DevOps, Docker & Containerization

The project utilizes a 4-stage multi-stage Docker build optimized for high-security enterprise environments:

| Stage | Image | Purpose |
| :--- | :--- | :--- |
| **1. Base** | `node:22-alpine` | Installs `libc6-compat` for Alpine Linux native binary compatibility |
| **2. Deps** | `node:22-alpine` | Caches package manifests and runs clean dependency installation (`npm ci --legacy-peer-deps`) |
| **3. Builder** | `node:22-alpine` | Executes `output: "standalone"` Next.js build with baked client environment variables & proxy targets |
| **4. Runner** | `node:22-alpine` | Non-root system user (`nextjs:nodejs`), minimal image size, sub-second boot time |

### 🚀 Image Optimization Result:
- **Default Image Size:** $\sim 1.5\text{ GB}$
- **Optimized Standalone Image Size:** **$87.3\text{ MB}$** ($\gt 94\%$ reduction)
- **Startup Time:** `Ready in 0ms`

---

## 🗺️ Product Roadmap & Upcoming Milestones

We are actively expanding this platform into a comprehensive AI-augmented healthcare network:

- [x] **🤖 AI Clinical Health Assistant & Real-Time Triage (Shipped)**
  - Full-stack clinical RAG integration with Google Gemini & PostgreSQL pgvector (768-D).
  - Sub-300ms Server-Sent Events (SSE) token streaming with AbortController cancellation.
  - ChatGPT / Gemini-style multi-session history with auto-titling and slide-over drawer (`AIChatHistoryDrawer`).
  - Deterministic Rule-0 acute emergency alerts with instant 999 dialing (`AIEmergencyBanner`).
  - Admin vector knowledge base telemetry & one-click incremental sync dashboard (`/admin/dashboard/ai-knowledge`).
- [ ] **🎥 WebRTC HD Video & Audio Telehealth (Q1 2027)**
  - In-browser peer-to-peer and SFU video consultation rooms.
  - Doctor-patient screen sharing, clinical vitals dashboard, and real-time appointment timer.
- [ ] **💬 Real-Time In-Consultation Chat (Q2 2027)**
  - WebSocket / Socket.IO encrypted messaging with instant laboratory report and diagnostic image sharing.
- [ ] **📑 OCR Prescription Parser & Diagnostic Lab Integration (Q3 2027)**
  - Computer-vision OCR to digitize handwritten doctor prescriptions and schedule automated medicine dosage reminders.
- [ ] **📲 Multi-Channel Notifications (WhatsApp & SMS) (Q3 2027)**
  - Automated Twilio / WhatsApp Business API notifications for appointment confirmations, 15-minute reminders, and invoice receipts.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Applied AI & RAG** | [Google Gemini](https://ai.google.dev/) API, Server-Sent Events (SSE), Vector Citations & Multi-Session Storage |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), `tw-animate-css`, Glassmorphism |
| **Component System**| [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Networking** | [Axios](https://axios-http.com/) & Native Fetch with dual-network SSR/CSR resolution |
| **Monitoring & Queues**| [Bull-Board](https://github.com/felixmosh/bull-board) (BullMQ Visual UI), Real-time HTTP Telemetry |
| **DevOps & CI/CD** | [Docker](https://www.docker.com/) (Standalone), [GitHub Actions](https://github.com/features/actions) |
| **Reverse Proxy** | [Nginx](https://nginx.org/) Unified Single Gateway |
| **Payments** | [Stripe](https://stripe.com/) Checkout SDK |
| **Storage & Assets** | [Cloudinary](https://cloudinary.com/) (Certified Secure Raw PDF & Image Delivery) |

---

## ⚙️ Environment Configuration
 
Configure your local environment by creating a `.env` file based on the template:

```bash
cp .env.example .env
```

Add your service endpoints:

```env
# Client-Facing Public API Gateway (Accessible from User's Browser)
NEXT_PUBLIC_API_BASE_URL=http://localhost/api/v1
NEXT_PUBLIC_API_URL=http://localhost/api/v1

# Internal Docker Network Service URL (For Server-Side Rendering within Docker Network)
INTERNAL_API_BASE_URL=http://healthcare_nginx/api/v1
```

---

## 🚀 Getting Started

### Option 1: Running with Docker Compose (Recommended)

Make sure Docker Desktop is running, then run:

```bash
# Build and launch the container in the background
docker compose up -d --build

# View container logs
docker compose logs -f

# Stop container
docker compose down
```

Access the application at **`http://localhost:3000`** (or through the Nginx gateway at **`http://localhost`**).

### Option 2: Running Locally

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run development server
npm run dev

# 3. Production build & start
npm run build
npm run start
```

---

## 👨‍💻 Engineering & Maintainer

**Developed by:** Alif Hossin Sajjad  
- **GitHub:** [@alifhossinsajjad](https://github.com/alifhossinsajjad)  
- **Platform:** HealthCare Services Ltd.  
- **Focus:** Enterprise Full-Stack Web Development, Telehealth Engineering & Distributed Microservices.

---

<p align="center">
  <sub>Built with clinical precision and modern web architecture. Available under the MIT License.</sub>
</p>
