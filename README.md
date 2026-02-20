# 🏦 Kodbank — Secure Banking Dashboard

A full-stack JWT-authenticated banking web application built with **Node.js + Express + MySQL2 + Aiven MySQL**.

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
node index.js
```

Backend runs on: **http://localhost:5000**

### 2. Open the Frontend

Open the `frontend/` folder files with **VS Code Live Server** (or any static file server):

- `http://127.0.0.1:5500/register.html` — Registration
- `http://127.0.0.1:5500/login.html` — Login
- `http://127.0.0.1:5500/dashboard.html` — Dashboard

---

## 📁 Project Structure

```
kodbankproject/
├── backend/
│   ├── index.js                    ← Express app entry
│   ├── .env                        ← DB + JWT config
│   └── src/
│       ├── db.js                   ← MySQL2 pool (Aiven)
│       ├── controllers/
│       │   └── authController.js  ← register / login / balance / logout
│       ├── middleware/
│       │   └── verifyToken.js     ← JWT cookie middleware
│       └── routes/
│           └── authRoutes.js      ← API routes
├── frontend/
│   ├── register.html
│   ├── login.html
│   └── dashboard.html
└── setup_db.sql                   ← Run once in Aiven MySQL
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new customer |
| POST | `/api/auth/login` | ❌ | Login + set JWT cookie |
| GET | `/api/auth/balance` | ✅ | Fetch account balance |
| GET | `/api/auth/me` | ✅ | Get current user info |
| POST | `/api/auth/logout` | ❌ | Clear JWT cookie |

---

## 🔐 Security

- Passwords hashed with **bcryptjs** (12 rounds)
- JWT signed with **HS256**, stored as **httpOnly cookie**
- Tokens also persisted in `UserToken` table with expiry
- CORS restricted to known frontend origins

---

## 🗄️ Database Setup

If tables don't exist yet, run `setup_db.sql` in your Aiven MySQL console.
