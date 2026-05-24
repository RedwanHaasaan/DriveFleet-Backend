<div align="center">

# ⚙️ DriveFleet — Backend

### RESTful API for Premium Car Rental Platform

A robust, secure backend API built with **Express.js 5** and **MongoDB**, powering the DriveFleet car rental ecosystem with JWT authentication, CRUD operations, and booking management.

[![Live API](https://img.shields.io/badge/🌐_Live_API-Vercel-000000?style=for-the-badge&logo=vercel)](https://drive-fleet-backend-brown.vercel.app/)
[![Express](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live API](#-live-api)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Authentication](#-authentication)
- [Deployment](#-deployment)

---

## 🔍 Overview

**DriveFleet Backend** is the server-side application that powers the DriveFleet car rental platform. It provides a RESTful API for user authentication, car listing management, and booking operations. The backend integrates with Better Auth's password hashing on the frontend and maintains its own JWT-based session via HTTP-only cookies for secure API access.

---

## 🌐 Live API

**Backend API:** [https://drive-fleet-backend-brown.vercel.app/](https://drive-fleet-backend-brown.vercel.app/)
**Frontend:** [https://drive-fleet-frontend-q3d5.vercel.app/](https://drive-fleet-frontend-q3d5.vercel.app/)

---

## 🛠 Tech Stack

| Category          | Technology                                                          |
| ----------------- | ------------------------------------------------------------------- |
| **Runtime**       | [Node.js](https://nodejs.org/) (v18+)                               |
| **Framework**     | [Express.js 5](https://expressjs.com/)                              |
| **Database**      | [MongoDB Atlas](https://www.mongodb.com/atlas) (Native Driver v7)   |
| **Authentication**| [JWT](https://jwt.io/) (jsonwebtoken) + HTTP-only Cookies           |
| **Password**      | [@better-auth/utils](https://www.better-auth.com/) (Argon2 verify)  |
| **Security**      | CORS, Cookie Parser, Secure Cookie Options                          |
| **Deployment**    | [Vercel](https://vercel.com/) (Serverless)                          |

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with 7-day token expiry
- **HTTP-only secure cookies** with SameSite protection
- **Token sync endpoint** for Better Auth integration
- **Password verification** using Argon2 (via Better Auth utils)
- **Protected route middleware** for authenticated operations
- **CORS configuration** with credentials support

### 🚘 Car Management API
- **Full CRUD** — Create, Read, Update, Delete car listings
- **Advanced search & filtering** — Search by brand/model, filter by location and price range
- **Flexible sorting** — Sort by date, price (ascending/descending)
- **Owner authorization** — Only car owners can modify/delete their listings
- **Recent cars endpoint** — Fetch latest car listings for the homepage

### 📅 Booking System API
- **Create bookings** with automatic price calculation
- **Date-based rental pricing** with daily rate computation
- **Booking count tracking** on car listings
- **Update & cancel bookings** with owner verification
- **Booking history** per user

### 🏗 Architecture
- **MVC pattern** — Controllers, Routes, Middleware separation
- **Centralized DB connection** with singleton pattern
- **Reusable utility functions** for JWT and user lookup
- **Production-ready cookie settings** (secure, httpOnly, sameSite)

---

## 🏛 Architecture

```
Client Request
       │
       ▼
┌──────────────┐
│   Express    │──── CORS Middleware
│   Server     │──── JSON Parser
│              │──── Cookie Parser
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────────┐
│   Router     │────▶│   Auth Middleware │
│   Layer      │     │   (JWT Verify)   │
└──────┬───────┘     └──────────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  Controller  │────▶│   MongoDB    │
│   Logic      │     │   Atlas      │
└──────────────┘     └──────────────┘
```

---

## 📡 API Endpoints

### Base URL

```
Production:  https://drive-fleet-backend-brown.vercel.app/api/v1
Development: http://localhost:4000/api/v1
```

### 🔐 Authentication — `/api/v1/auth`

| Method | Endpoint    | Auth | Description                        |
| ------ | ----------- | ---- | ---------------------------------- |
| POST   | `/login`    | ❌    | Login with email & password        |
| POST   | `/sync`     | ❌    | Sync Better Auth session → JWT     |
| POST   | `/logout`   | ❌    | Clear auth cookie & logout         |
| GET    | `/me`       | ✅    | Get current authenticated user     |

### 🚗 Cars — `/api/v1/car`

| Method | Endpoint    | Auth | Description                        |
| ------ | ----------- | ---- | ---------------------------------- |
| GET    | `/`         | ❌    | Get all cars (with search/filter)  |
| GET    | `/my-cars`  | ✅    | Get authenticated user's cars      |
| GET    | `/:id`      | ❌    | Get car by ID                      |
| POST   | `/add-car`  | ✅    | Create a new car listing           |
| PUT    | `/:id`      | ✅    | Update a car (owner only)          |
| DELETE | `/:id`      | ✅    | Delete a car (owner only)          |

#### Query Parameters for `GET /`

| Parameter   | Type   | Description                         |
| ----------- | ------ | ----------------------------------- |
| `search`    | string | Search brand or model name          |
| `location`  | string | Filter by location                  |
| `minPrice`  | number | Minimum daily rental price          |
| `maxPrice`  | number | Maximum daily rental price          |
| `sortBy`    | string | Field to sort by (default: `createdAt`) |
| `sortOrder` | string | `asc` or `desc` (default: `desc`)   |

### 📅 Bookings — `/api/v1/booking`

| Method | Endpoint       | Auth | Description                        |
| ------ | -------------- | ---- | ---------------------------------- |
| POST   | `/`            | ✅    | Create a new booking               |
| GET    | `/my-bookings` | ✅    | Get user's booking history         |
| PUT    | `/:id`         | ✅    | Update booking dates (owner only)  |
| DELETE | `/:id`         | ✅    | Cancel a booking (owner only)      |

### 🆕 Recent Cars — `/api/v1/recentcar`

| Method | Endpoint | Auth | Description                 |
| ------ | -------- | ---- | --------------------------- |
| GET    | `/`      | ❌    | Get recently added car listings |

---

## 📁 Project Structure

```
DriveFleet-Backend/
├── config/
│   └── db.js                  # MongoDB connection (singleton pattern)
├── controllers/
│   ├── authController.js      # Login, sync, logout, getMe
│   ├── carController.js       # CRUD operations for cars
│   ├── bookingController.js   # CRUD operations for bookings
│   └── RecentCarsController.js # Recent car listings
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── routers/
│   ├── authRoutes.js          # Auth route definitions
│   ├── carRoutes.js           # Car route definitions
│   ├── bookingRoutes.js       # Booking route definitions
│   └── recentCarRoutes.js     # Recent cars route definitions
├── utils/
│   ├── findUser.js            # User lookup utilities
│   └── jwt.js                 # JWT sign/verify & cookie config
├── app.js                     # Express app entry point
├── package.json               # Dependencies & scripts
├── .gitignore                 # Git ignore rules
└── .env                       # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- **MongoDB Atlas** cluster

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/drivefleet-backend.git
   cd drivefleet-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)).

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Verify the server is running:**

   ```
   Server is running on port 4000
   MongoDB Connected Successfully
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=drivefleet

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=4000
NODE_ENV=development
```

| Variable        | Description                                  | Required |
| --------------- | -------------------------------------------- | -------- |
| `MONGO_URL`     | MongoDB Atlas connection string              | ✅        |
| `DB_NAME`       | MongoDB database name                        | ✅        |
| `JWT_SECRET`    | Secret key for signing JWT tokens            | ✅        |
| `FRONTEND_URL`  | Frontend URL for CORS whitelist              | ✅        |
| `PORT`          | Server port (default: `4000`)                | ❌        |
| `NODE_ENV`      | Environment (`development` / `production`)   | ❌        |

---

## 📜 Available Scripts

| Command          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Start server with nodemon (hot-reload)             |
| `npm run start`  | Start production server with `node app.js`         |

---

## 🔒 Authentication

### How It Works

1. **Login Flow:**
   - User submits email/password → Backend verifies against Better Auth's hashed password → Issues JWT in HTTP-only cookie

2. **Token Sync Flow:**
   - After Better Auth login/register on frontend → Frontend calls `/api/v1/auth/sync` with userId → Backend issues its own JWT cookie

3. **Protected Requests:**
   - Client sends request with cookie → `authMiddleware` extracts and verifies JWT → Attaches `req.user` → Controller processes request

### JWT Cookie Configuration

```javascript
{
  httpOnly: true,           // Prevents XSS access
  secure: true,             // HTTPS only (production)
  sameSite: "none",         // Cross-site cookies (production)
  maxAge: 604800000,        // 7 days
  path: "/"                 // Available on all routes
}
```

---

## 🚢 Deployment

### Vercel (Current)

The backend is deployed on Vercel as a serverless function.

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set all environment variables in the Vercel dashboard
4. Add a `vercel.json` if needed for serverless routing
5. Deploy

### Traditional Server

```bash
npm install --production
NODE_ENV=production npm start
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Express.js, MongoDB & JWT**

[Live API](https://drive-fleet-backend-brown.vercel.app/) · [Frontend Repo](../Drivefleet-Frontend/) · [Report Bug](https://github.com/your-username/drivefleet/issues)

</div>
