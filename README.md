# ✂️ AZHAGU — South India Salon & Bridal Booking Platform

> Premier South Indian salon discovery, traditional bridal styling, and appointment booking platform.

---

## 🌟 Overview & Architecture

AZHAGU is an end-to-end multi-role salon management & booking platform built for South India. It consists of:

1. **Customer Web Application** — Discovery, service selection, stylist choice, date/time slot reservation, instant UPI/Card payments, booking history, and 2-hour cancellation enforcement.
2. **Salon Owner & Staff Portal** — Revenue analytics, appointment approvals, staff shift scheduling, and leave management.
3. **Platform Admin Panel** — Audit logs, platform statistics, and salon verification.
4. **Backend REST API Server** — Node.js + Express server with persistent file-backed JSON database, double-booking overlap protection, and authentication.

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Run Backend REST API Server
```bash
node server/server.js
```
*Server runs at `http://localhost:5050`*

### 3. Run Frontend Web App
```bash
npm run dev
```
*Vite application runs at `http://localhost:3000`*

---

## 🔑 Demo Login Credentials

| Role | Identifier / Email | Password | Access Panel |
| :--- | :--- | :--- | :--- |
| **Customer** | `guruprasath@azhagu.demo` | `password123` | Customer Discovery Portal |
| **Salon Owner** | `kavitha@azhagu.demo` | `password123` | Salon Portal (`/salon-dashboard`) |
| **Salon Manager** | `senthil@azhagu.demo` | `password123` | Salon Portal (`/salon-dashboard`) |
| **Staff / Stylist** | `senthil@azhagu.demo` | `password123` | Staff Portal (`/salon-dashboard`) |
| **Platform Admin** | `admin@azhagu.demo` | `password123` | Admin Panel (`/admin-dashboard`) |

---

## 🛡️ Key Security & Technical Features

- **Double Booking Overlap Prevention**: Mathematical interval algorithm prevents two customers from booking overlapping time slots with the same stylist.
- **2-Hour Cancellation Window**: Prevents online cancellations within 2 hours of appointment start time.
- **Role-Based Access Control (RBAC)**: Strict 403 Forbidden protection on unauthorized panel routes.
- **REST API Architecture**: Frontend connects to REST endpoints on `http://localhost:5050/api`.

---

## 📁 Repository Structure

```
├── server/
│   ├── server.js          # Express REST API Server (Port 5050)
│   ├── database.js        # File-backed JSON DB & Seed Data
│   └── db.json            # Persistent Database Storage
├── docs/
│   └── API_DOCUMENTATION.md # Complete REST API Specification
├── src/
│   ├── components/        # Customer, Salon, Admin, Auth components
│   ├── context/           # App & Auth React Context
│   ├── services/          # API Client & Storage Engine
│   └── types/             # TypeScript Schemas
├── README.md              # Project Documentation
└── package.json           # Node dependencies
```
