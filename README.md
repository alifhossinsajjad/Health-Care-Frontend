# 🏥 HealthCare — Enterprise Telehealth & Clinical Consultation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.8-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Stripe-Secured_Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/HIPAA-Compliance_Architecture-10B981?style=for-the-badge&logo=shield&logoColor=white" alt="HIPAA Ready" />
</p>

---

## 📌 Executive Summary

**HealthCare** is an enterprise-grade digital health and clinical consultation web platform designed to support millions of patients, board-certified doctors, and hospital administrators. Built with **Next.js 16 (App Router)** and **React 19**, the platform eliminates administrative friction by uniting specialist discovery, real-time schedule locking, dual-track payment systems (Stripe + Automated Pay Later), secure PDF invoice delivery, and end-to-end encrypted telehealth records.

Engineered with high-performance production standards, the frontend features **Next.js Standalone Containerization** (reducing image size from 1.5 GB down to **87 MB**), zero-conflict booking algorithms, and dual-network routing for server-side rendering (SSR).

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client_Layer ["Client Layer (Browser)"]
        User["Patient / Doctor / Admin"]
        UI["Next.js 16 Web Application"]
    end

    subgraph Container_Cluster ["Containerized Services"]
        Frontend["Frontend Service<br/>(Next.js Standalone Runner)"]
        BackendAPI["Backend API Gateway<br/>(Express, TypeScript, Prisma)"]
        RedisCache["Redis Cache<br/>(Session & Rate Limiting)"]
    end

    subgraph Cloud_Infrastructure ["Managed Cloud Infrastructure"]
        PostgresDB[("PostgreSQL Database<br/>(Cloud Storage)")]
        StripeGateway["Stripe Payments<br/>(Secure Checkout & Webhooks)"]
        CloudinaryCDN["Cloudinary Storage<br/>(Prescriptions & Invoices)"]
    end

    User --> UI
    UI -->|HTTPS Request| Frontend
    UI -->|Client API Calls| BackendAPI
    Frontend -->|SSR Internal DNS Resolution| BackendAPI
    BackendAPI <--> RedisCache
    BackendAPI <--> PostgresDB
    BackendAPI <--> StripeGateway
    BackendAPI <--> CloudinaryCDN
```

---

## ✨ Core Features & Architectural Highlights

### 1. 🌟 High-Conversion Enterprise Landing Page
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

### 4. 📊 Patient & Doctor Dashboards
- **Server-Side Pagination (`AppPagination.tsx`):** Fast URL-driven search parameter pagination (`?page=1&limit=6`) with total records metadata counters.
- **Appointments Management:** Distinct status badges for `SCHEDULED`, `COMPLETED`, and `CANCELED` consultations.
- **Digital Health Records & Prescriptions:** Direct access to medical records, prescriptions, and official receipts.

### 5. 🛡️ Role-Based Access Control (RBAC) & Next.js Middleware
- Strict multi-role protection (`PATIENT`, `DOCTOR`, `ADMIN`).
- Next.js edge middleware inspecting HttpOnly JWT tokens, silent refresh-token rotation, and instant unauthenticated redirects.

---

## 🐳 DevOps, Docker & Containerization

The project utilizes a 4-stage multi-stage Docker build optimized for high-security enterprise environments:

| Stage | Image | Purpose |
| :--- | :--- | :--- |
| **1. Base** | `node:22-alpine` | Installs `libc6-compat` for Alpine Linux native binary compatibility |
| **2. Deps** | `node:22-alpine` | Caches package manifests and runs clean dependency installation |
| **3. Builder** | `node:22-alpine` | Executes `output: "standalone"` Next.js build with baked client environment variables |
| **4. Runner** | `node:22-alpine` | Non-root system user (`nextjs:nodejs`), minimal image size, sub-second boot time |

### 🚀 Image Optimization Result:
- **Default Image Size:** $\sim 1.5\text{ GB}$
- **Optimized Standalone Image Size:** **$87.3\text{ MB}$** ($\gt 94\%$ reduction)
- **Startup Time:** `Ready in 0ms`

---

## 🗺️ Product Roadmap & Upcoming Milestones

We are actively expanding this platform into a comprehensive AI-augmented healthcare network:

- [ ] **🎥 WebRTC HD Video & Audio Telehealth (Q1 2027)**
  - In-browser peer-to-peer and SFU video consultation rooms.
  - Doctor-patient screen sharing, clinical vitals dashboard, and real-time appointment timer.
- [ ] **🤖 AI Symptom Checker & Smart Clinical Triage (Q2 2027)**
  - LLM-powered (Gemini / Med-PaLM) interactive triage assistant.
  - Pre-consultation symptom intake automatically summarized for the consulting physician.
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
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), `tw-animate-css`, Glassmorphism |
| **Component System**| [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Networking** | [Axios](https://axios-http.com/) & Native Fetch with dual-network SSR/CSR resolution |
| **Date & Time** | [date-fns](https://date-fns.org/) |
| **Payments** | [Stripe](https://stripe.com/) Checkout SDK |
| **Storage & Assets** | [Cloudinary](https://cloudinary.com/) (Certified Secure Raw PDF & Image Delivery) |
| **Containerization**| [Docker](https://www.docker.com/) & Docker Compose |

---

## ⚙️ Environment Configuration
 
Configure your local environment by creating a `.env` file based on the template:

```bash
cp .env.example .env
```

Add your service endpoints:

```env
# Client-Facing Public API Gateway (Accessible from User's Browser)
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1

# Internal Docker Network Service URL (Optional: For Server-Side Rendering within Docker)
INTERNAL_API_BASE_URL=http://backend_service:port/api/v1
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

Access the application at **`http://localhost:3000`**.

### Option 2: Running Locally

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run development server
npm run dev

# 3. Production build
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
