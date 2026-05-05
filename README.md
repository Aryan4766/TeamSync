# 🚀 TeamSync — One team. One flow.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

> **A professional-grade, high-performance project management ecosystem built for high-accountability teams.**

---

## ✨ System Highlights

TeamSync is not just another todo list. It is a **secure, role-aware productivity suite** designed with the MERN stack. It features a premium dark-themed UI, stateless JWT authentication, and a granular Role-Based Access Control (RBAC) system.

### 💎 Key Features
- 🔐 **Stateless Security**: JWT-based authentication with Bcrypt password hashing.
- 🎭 **Role-Based Access**: Specialized views and permissions for **Admins** and **Members**.
- 📊 **Dynamic Dashboard**: Real-time project statistics with automated "Overdue" task tracking.
- 🏗️ **Modular Backend**: Clean MVC-inspired architecture for massive scalability.
- 🎨 **Premium UI**: Dark-mode glassmorphism design using Tailwind CSS and Lucide icons.
- ⚡ **Vite Optimized**: Lightning-fast HMR and optimized production builds.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Component-based UI with industry-leading build speeds. |
| **Styling** | Tailwind CSS | Atomic CSS for consistent, rapid, and lightweight styling. |
| **State** | Context + useReducer | Native React state management without Redux overhead. |
| **Backend** | Node.js + Express | Event-driven, non-blocking I/O for high concurrency. |
| **Database** | MongoDB + Mongoose | Flexible NoSQL schema design for evolving task data. |
| **Auth** | JWT + LocalStorage | Stateless scalability with client-side persistence. |

---

## 📁 Elite Documentation
For a deep dive into the engineering decisions, system design diagrams, and interview preparation, refer to our master technical file:
👉 **[TECHNICAL_DOCUMENTATION.txt](./TECHNICAL_DOCUMENTATION.txt)**

---

## ⚙️ Quick Start (Developer Setup)

### 1. Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** cluster URI

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/team-task-manager.git

# Setup Server
cd server && npm install

# Setup Client
cd ../client && npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=ttm_super_secret_key_2025
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 4. Database Seeding
Populate your database with elite test data instantly:
```bash
cd server
node seed/seed.js
```

**Test Credentials:**
- 📧 **Admin:** `admin@example.com` / `password123`
- 📧 **Member:** `alice@example.com` / `password123`

---

## 🚀 Execution
Run both servers simultaneously for the full experience:

| Terminal | Command | Target |
| :--- | :--- | :--- |
| **Terminal 1** | `cd server && npm run dev` | `http://localhost:5000` |
| **Terminal 2** | `cd client && npm run dev` | `http://localhost:5173` |

---

## 🛡️ Security & Reliability
- **CORS Whitelisting**: Prevents unauthorized domains from hitting your API.
- **Input Sanitization**: Global error handling and `express-validator` integration.
- **Statelessness**: Zero session storage on the server ensures horizontal scaling readiness.
- **Bcrypt Salt**: Passwords are salted with 12 rounds for maximum entropy.

---

## 👥 Permission Matrix

| Action | Admin | Member |
| :--- | :---: | :---: |
| **Create/Delete Projects** | ✅ | ❌ |
| **Manage Team Members** | ✅ | ❌ |
| **Create/Delete Tasks** | ✅ | ❌ |
| **Modify Task Structure** | ✅ | ❌ |
| **Update Own Task Status**| ✅ | ✅ |
| **View Analytics** | ✅ | ✅ |

---

## 📜 License & Acknowledgments
Built with ❤️ by Aryan Sharma.
Distributed under the **MIT License**.

---
**BOOM! YOUR PROJECT IS READY TO SCALE.** 🚀🔥
