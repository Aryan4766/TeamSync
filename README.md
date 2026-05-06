# 🚀 TeamSync — One team. One flow.

> **A professional-grade, high-performance project management ecosystem built for high-accountability teams.**

---

### 🛡️ Tech Stack & Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

---

## 🌐 Live Demo

Experience **TeamSync** in action with the production-ready deployment:

🔗 **Frontend:** [https://team-sync-pied.vercel.app](https://team-sync-pied.vercel.app)  
🔗 **Backend API:** [https://teamsync-backend-a21l.onrender.com](https://teamsync-backend-a21l.onrender.com)

### 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Member** | `alice@example.com` | `password123` |

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

## 🧠 What This Project Demonstrates

This project is a comprehensive showcase of modern full-stack engineering principles, designed to solve real-world team collaboration challenges. It serves as a professional demonstration of:

*   **Full-stack MERN Architecture**: Seamless integration between MongoDB, Express, React, and Node.js.
*   **Secure JWT Authentication**: Implementation of stateless authentication with secure token handling and persistent sessions.
*   **Role-Based Access Control (RBAC)**: Granular permission systems differentiating between Administrative and Member privileges.
*   **RESTful API Design**: A clean, modular API structure following industry standard MVC patterns.
*   **Complex MongoDB Relationships**: Efficient data modeling with Mongoose for nested project and task structures.
*   **Production-Ready Deployment**: Orchestration of multi-platform cloud hosting (Vercel + Render).
*   **Environment Strategy**: Robust management of environment variables across development and production cycles.
*   **CORS & Security**: Advanced security configurations including cross-origin resource sharing and request sanitization.

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

## 🚀 Deployment Architecture

TeamSync utilizes a distributed cloud architecture to ensure high availability and performance.

*   **Frontend**: Hosted on **Vercel** for lightning-fast global delivery and edge caching.
*   **Backend**: Hosted on **Render**, providing a scalable Node.js environment with automated CI/CD.
*   **Database**: Hosted on **MongoDB Atlas**, a multi-cloud database-as-a-service providing automated scaling and backups.

### 🌐 Production Flow

```text
[ Client (Vercel) ] <--- HTTPS / JSON ---> [ API Server (Render) ] <--- Wired Protocol ---> [ Database (Atlas) ]
```

These services communicate securely via encrypted channels, with the backend acting as a central orchestrator for data persistence and business logic.

---

## 📁 Elite Documentation
For a deep dive into the engineering decisions, system design diagrams, and interview preparation, refer to my master technical file:
👉 **[TECHNICAL_DOCUMENTATION.txt](./TECHNICAL_DOCUMENTATION.txt)**

---

## ⚡ Challenges & Learnings

Every production-grade application comes with unique engineering hurdles. Here's a breakdown of the key challenges overcome during the development of TeamSync:

*   **MongoDB Atlas IP Whitelisting**: Navigating the "connection timeout" issue common in cloud environments. Resolved by implementing dynamic IP whitelisting for the Render deployment environment.
*   **Render Root Directory Deployment**: Optimized the deployment workflow to handle the monorepo-style structure, ensuring proper build commands and environment mapping for the server.
*   **CORS Debugging**: Tackling complex Cross-Origin Resource Sharing issues during the transition from local development to a multi-domain production environment.
*   **Production Environment Management**: Implementing a robust system to toggle between `localhost` and production endpoints without manual code changes, leveraging Vite's environment variable system.
*   **State Persistence**: Ensuring a smooth user experience by maintaining JWT state across browser refreshes and tab closures.

---

## 📈 Future Improvements

The roadmap for TeamSync includes several high-impact features to further enhance team productivity:

*   🔄 **Real-time Collaboration**: Integrating **Socket.io** for live task updates and presence indicators.
*   📋 **Drag-and-Drop Kanban**: Implementing a visual project board for intuitive task management.
*   🔔 **Notification System**: Automated in-app and email alerts for task assignments and deadlines.
*   💬 **Team Chat**: Integrated messaging for project-specific discussions.
*   📜 **Activity Logs**: Comprehensive audit trails for all project and task modifications.

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

----
