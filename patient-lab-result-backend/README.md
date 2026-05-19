# 🏥 Patient Laboratory Results Portal - Backend API

## 📋 Project Overview
A secure RESTful backend API for managing patient laboratory results. Built for healthcare facilities to allow patients to view their lab results online.

## 🚀 Live Demo
- **Base URL:** `http://localhost:3000/api`
- **Health Check:** `GET /api/health`

## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| Next.js 14 | Backend Framework |
| TypeScript | Type Safety |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd patient-lab-result-backend

# 2. Install dependencies
npm install

# 3. Create database
psql -U postgres
CREATE DATABASE lab_portal;
\q

# 4. Run schema
psql -U postgres -d lab_portal -f database/schema.sql

# 5. Create .env.local file
echo DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lab_portal" > .env.local
echo JWT_SECRET="your-super-secret-key" >> .env.local

# 6. Start server
npm run dev