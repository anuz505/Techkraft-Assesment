#  TechKraft Assessment – Full Stack Property Platform

This repository contains a full-stack property platform built as part of the TechKraft assessment.

The project is divided into two main applications:

* **Client** – Modern React frontend for users and admins
* **Server** – FastAPI backend with authentication, role-based access, and property management

Each part is fully documented in its respective directory.

---

## 📁 Project Structure

```bash
.
├── client/   # React + TypeScript frontend
├── server/   # FastAPI backend API
```

---

## Where to Start

Detailed setup and implementation guides are available here:

*  **Frontend (Client):** `./client/README.md`
*  **Backend (Server):** `./server/README.md`

These READMEs include:

* Installation steps
* Environment configuration
* Feature breakdown
* API behavior and architecture

---

##  System Overview

This is a **full-stack property platform** with:

### 🔐 Authentication

* JWT-based auth with refresh tokens
* HTTP-only cookies for secure session handling

###  Property Management

* Browse, search, and filter properties
* View detailed listings
* Admin CRUD operations

###  Favorites System

* Save and manage favorite properties
* Personalized user experience

###  Role-Based Access

* `user` → browse + favorite
* `admin` → full property management

---

## Tech Stack

### Frontend

* React 19 + TypeScript
* Vite + Tailwind CSS
* TanStack Query
* React Router

### Backend

* FastAPI
* PostgreSQL + SQLAlchemy (async)
* JWT Authentication

---

## How the Apps Work Together

* The **client** communicates with the **server API** via HTTP.
* Authentication is handled using **cookies + JWT tokens**.
* The frontend automatically:

  * Refreshes expired sessions
  * Retries failed requests
  * Syncs auth state with backend

---

##  Running the Project

You need to run both services:

### 1. Start the backend

```bash
cd server
uvicorn main:app --reload
```

### 2. Start the frontend

```bash
cd client
pnpm install
pnpm dev
```

---

## 📌 Notes for Reviewers

* This project follows a **clean separation of concerns**:

  * Backend → API + business logic
  * Frontend → UI + state management
* The backend uses a **layered architecture** (API → Service → Repository).
* The frontend uses **React Query + Context** for efficient state and data handling.

---

## 👨‍💻 Author

Anuj Bhandari
