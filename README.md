🏥 Alatyon Hospital — Staff Portal

Admin portal for Doctors and Lab Technicians — built with Next.js 16, Prisma, PostgreSQL (Neon), and AI-powered diagnostics via Google Gemini.


📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Application Flow](#application-flow)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Horizontal Scaling](#horizontal-scaling)
- [Related Repository](#related-repository)



📌 Overview

The Alatyon Staff Portal is the administrative side of the Alatyon Hospital Lab System. It provides dedicated dashboards for two staff roles:

- Lab Technicians — upload and manage patient lab results
- Doctors — review lab results, generate AI-powered diagnostic analyses, approve or reject results, and send findings to patients

This portal connects to a shared **Neon PostgreSQL** database, meaning any result uploaded by a lab tech is immediately visible to the reviewing doctor, and approved results are instantly available to the patient through the Patient Portal.



 ✨ Features

 🔬 Lab Technician Portal (`/lab`)
- Secure login with JWT cookie authentication
- Upload lab results (test name, value, unit, patient selection)
- Dashboard showing upload statistics (total, pending, reviewed, unique patients)
- Recent uploads list with real-time status tracking
- Filter uploads by status: Pending / Reviewed / Rejected
- Search by test name, patient name, or MRN

🩺 Doctor Portal (`/doctor`)
- Secure login with role-based access
- Dashboard with live stats: Pending Reviews, Reviewed Today, Critical Cases, AI Analyses
- Pending Reviews page with severity-based filtering (Normal / Elevated / Critical)
- Patient history view grouped by MRN
- AI-powered diagnostic analysis using **Google Gemini**
- Approve results with doctor notes and severity classification
- Reject results with written reason (sent back to lab tech)
- AI Reports page for viewing generated analyses

🔐 Authentication & Security
- JWT tokens stored in `HttpOnly` cookies (`staff_token`)
- Role-based route protection (doctor vs lab tech)
- Secure logout that clears cookies server-side
- Password reset via email with secure tokenized links (1-hour expiry)
- Rate limiting on API routes via **Upstash Redis**

 🚀 Infrastructure
- Docker containerization with multi-stage build
- Nginx load balancer with SSL termination
- Horizontal scaling support (1 → 12 instances based on user load)
- Health check endpoint (`/api/health`) for container monitoring
- GitHub Actions CI/CD pipeline



 🏗 System Architecture


                        ┌─────────────────────────────┐
                        │         Internet              │
                        └─────────────┬───────────────┘
                                      │
                        ┌─────────────▼───────────────┐
                        │      Nginx (Port 80/443)      │
                        │   Load Balancer + SSL + Rate  │
                        │         Limiting              │
                        └──────────┬──────────────────┘
                                   │  Round-robin / Least Conn
                    ┌──────────────┼──────────────────┐
                    │              │                   │
          ┌─────────▼──┐  ┌───────▼────┐  ┌──────────▼─┐
          │  App :3000  │  │  App :3000 │  │  App :3000 │
          │ Instance 1  │  │ Instance 2 │  │ Instance 3 │
          └─────────────┘  └────────────┘  └────────────┘
                    │              │                   │
                    └──────────────┼───────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │     Neon PostgreSQL (Cloud)       │
                    │   Shared database, pooled conn    │
                    └─────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │     Upstash Redis (Cloud)         │
                    │      Rate limiting store          │
                    └─────────────────────────────────┘




 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript + JavaScript |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma 6 |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT (jsonwebtoken) + HttpOnly cookies |
| Email | Nodemailer (Gmail SMTP) |
| Rate Limiting | Upstash Redis + @upstash/ratelimit |
| Containerization | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| Deployment | Vercel / Docker |
| CI/CD | GitHub Actions |



👥 User Roles

 Lab Technician
- Logs in at `/login` with `role: "LabTech"`
- Can upload new lab results for any registered patient
- Sees upload history and result statuses
- Receives rejection reasons from doctors

 Doctor
- Logs in at `/login` with `role: "Doctor"`
- Reviews results with status `PENDING_DOCTOR`
- Runs AI analysis via Gemini API
- Classifies severity: Normal / Elevated / Critical
- Approves (sends to patient) or Rejects (sends back to lab)



 🔄 Application Flow


Lab Tech uploads result
        │
        ▼
LabResult created in DB
status = "PENDING_DOCTOR"
        │
        ▼
Doctor sees it in Pending Reviews
        │
        ├─── Runs AI Analysis (Gemini) ──────┐
        │                                    │
        ▼                                    ▼
Doctor writes note              AI generates diagnostic
selects severity                summary (editable)
        │
        ├──── APPROVE ────────────────────────┐
        │     status = "COMPLETED"            │
        │     reviewedAt = now()              │
        │     severity saved                  │
        │     interpretation saved            │
        │                                     ▼
        │                          Patient sees result
        │                          in Patient Portal
        │
        └──── REJECT ─────────────────────────┐
              status = "REJECTED"             │
              rejection reason saved          ▼
                                    Lab tech sees rejection
                                    must re-upload





 🌐 API Routes

| Method | Route | Auth | Description |

| POST | `/api/auth/staff-login` | Public | Login for doctors and lab techs |
| POST | `/api/auth/logout` | Cookie | Clear staff_token cookie |
| POST | `/api/auth/forgot-password` | Public | Send password reset email |
| POST | `/api/auth/reset-password` | Token | Reset password with token |
| GET | `/api/doctor/pending` | Cookie | Get PENDING_DOCTOR results |
| GET | `/api/doctor/stats` | Cookie | Dashboard stat counts |
| GET | `/api/doctor/analyze/[id]` | Cookie | Generate AI analysis |
| POST | `/api/doctor/approve/[id]` | Cookie | Approve result |
| PATCH | `/api/doctor/action` | Cookie | Reject result |
| GET | `/api/lab/recent` | Cookie | Recent lab uploads |
| GET | `/api/lab/result/[id]` | Cookie | Single result detail |
| GET | `/api/health` | Public | Docker health check |


📈 Horizontal Scaling

The system supports automatic horizontal scaling based on user load.

 Scaling Table

| Concurrent Users | Instances | Strategy |
|---|---|---|
| ≤ 100 | 1 | Single instance |
| ≤ 500 | 2 | Split load |
| ≤ 1,000 | 3 | Round-robin |
| ≤ 5,000 | 5 | High concurrency |
| ≤ 10,000 | 8 | Very high load |
| > 10,000 | 12 | Maximum capacity |

Nginx uses least_conn_load balancing — requests always go to the instance with the fewest active connections. All instances share the same Neon PostgreSQL and Upstash Redis, so there is no data inconsistency across instances.



 🔗 Related Repository

| Repository | Description | URL |
|---|---|---|
| Alatyon Patient Portal | Patient-facing app for viewing lab results | [github.com/RunTime555/Alatyon-patient](https://github.com/RunTime555/Alatyon-patient) |

Both portals share the same database — results uploaded and approved in the Staff Portal are immediately visible to patients in the Patient Portal.

