<div align="center">

**English | [简体中文](./README.md)**

# ⚙️ NexMotor

**Next-Generation Online Electric Motor Selection Platform**

Turning tedious motor selection catalogs into a truly usable interactive tool — smart filtering, 3D visualization, bilingual UI, and a complete admin dashboard.

![License](https://img.shields.io/github/license/riceshowerX/NexMotor?style=for-the-badge&color=1d4ed8)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-0.160-000000?style=for-the-badge&logo=three.js)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)

[Quick Start](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [API Overview](#-api-overview) • [Project Structure](#-project-structure) • [Contributing](#-contributing) • [License](#-license--copyright)

---

**Smart Filtering · 3D Visualization · Bilingual UI · Fully Responsive · Complete Admin Dashboard**

</div>

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 📊 **Multi-Dimensional Smart Filtering** | Real-time combined filtering across 16 parameters including power, voltage, RPM, frame size, efficiency, rated current, power factor, and noise — with range matching, fuzzy search, and multi-field sorting |
| 🧊 **Interactive 3D Viewer** | Three.js-based 3D motor model with rotate, zoom, cross-section view, and part highlighting (demo model) |
| 🌐 **Internationalization** | Seamless Chinese/English switching powered by i18next, with persisted language preference and automatic antd locale sync |
| 📱 **Fully Responsive** | Perfectly adapted for desktop, tablet, and mobile devices |
| 🛠 **Enterprise Admin Dashboard** | Complete motor data CRUD (create, read, update, delete) with password change support |
| 🔐 **JWT Authentication** | Admin-only backend with bcrypt password hashing, token expiration control, and login rate limiting |

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend Framework | React 18 + Vite 5 + JavaScript (JSX) |
| UI Components | Ant Design 5 + Tailwind CSS 3 |
| 3D Rendering | Three.js + React Three Fiber + drei |
| Routing | React Router 6 |
| State Management | Context API + Custom Hooks |
| i18n | i18next + react-i18next |
| Backend | Node.js + Express |
| Database | SQLite (raw SQL with parameterized queries) |
| Security & Auth | JWT + bcrypt + helmet + rate limiting |

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 18** (20+ recommended)
- npm ≥ 9 (bundled with Node.js)

### Install & Run (≈ 3 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/riceshowerX/NexMotor.git
cd NexMotor

# 2. Start the backend (port 5000)
cd backend
npm install
cp .env.example .env    # Configure JWT_SECRET and other settings as needed
npm start               # → http://localhost:5000

# 3. Start the frontend (new terminal, port 3000)
cd ../frontend
npm install
npm run dev             # → http://localhost:3000
```

### Admin Login

- Username: `admin`
- Password: **auto-generated random password on first launch** — check the backend startup logs
- ⚠️ **Change the default password immediately after logging in**

> 💡 The frontend dev server proxies `/api` to `http://localhost:5000`, so no extra CORS configuration is needed in development.

## 📡 API Overview

### Endpoints

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/health` | Health check | No |
| GET | `/api/motors` | Motor list + multi-dimensional filtering | No |
| GET | `/api/motors/:id` | Motor details | No |
| POST | `/api/motors` | Create a motor | ✅ |
| PUT | `/api/motors/:id` | Update a motor | ✅ |
| DELETE | `/api/motors/:id` | Delete a motor | ✅ |
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/me` | Current user info | ✅ |
| POST | `/api/auth/change-password` | Change password | ✅ |
| POST | `/api/auth/logout` | Logout | ✅ |

### Filter Parameters (GET `/api/motors`)

| Type | Parameters |
| --- | --- |
| Exact match | `voltage`, `frameSize`, `poles`, `ip`, `insulation`, `frequency`, `mounting`, `connection` |
| Range match | `power_min/power_max`, `rpm_min/rpm_max`, `efficiency_min/efficiency_max`, `current_min/current_max`, `powerFactor_min`, `noise_max` |
| Fuzzy search | `model`, `description` |
| Sorting | `sortBy` (e.g. `power_desc`, `rpm_asc`, `efficiency_desc`) |

## 📁 Project Structure

```
NexMotor/
├── backend/                # Node.js + Express + SQLite backend
│   ├── src/
│   │   ├── server.js       # Entry point: CORS / HTTPS / graceful shutdown / global error handling
│   │   ├── routes/         # Route layer (auth / motors)
│   │   ├── controllers/    # Controller layer (validation + business logic)
│   │   ├── middleware/     # JWT authentication + login rate limiting
│   │   └── models/         # Data access layer (db / motorModel / user)
│   └── test/               # Smoke tests (node:test + supertest, 13 cases)
└── frontend/               # Vite + React frontend
    └── src/
        ├── pages/          # Pages (home / catalog / detail / 3D viewer / login / admin)
        ├── components/     # Components (layout / motor / 3D viewer / common)
        ├── api/            # Axios wrapper and interceptors
        ├── context/        # AuthContext for session state
        ├── hooks/          # Custom hooks (useMotors, etc.)
        ├── i18n/           # Chinese/English translation resources
        └── utils/          # Constants and formatting utilities
```

## 💻 Common Commands

```bash
# ── Backend ───────────────────────────
cd backend
npm start        # Start production server (:5000)
npm run dev      # Dev mode (nodemon hot reload)
npm test         # Run smoke tests

# ── Frontend ──────────────────────────
cd frontend
npm run dev      # Start dev server (:3000)
npm run build    # Production build (outputs dist/)
```

## 🤝 Contributing

Contributions are welcome in the following ways:

1. **Report issues**: [GitHub Issues](https://github.com/riceshowerX/NexMotor/issues) — bug reports, feature suggestions, or documentation improvements
2. **Submit code**: [Pull Requests](https://github.com/riceshowerX/NexMotor/pulls) — fork the repo and make changes. Before submitting, please ensure:
   - Backend changes pass `npm test`
   - Frontend changes pass `npm run build`
   - Code style stays consistent with the existing codebase

## ⚠️ Disclaimer

- This is an open-source project developed and maintained by an individual in their spare time. **All motor parameters, 3D models, and images are for demonstration purposes only and do not represent the performance or technical specifications of any real product.**
- The project is fully functional but still under active iteration and may contain undiscovered defects.
- The security mechanisms are implemented at a learning level; **please perform complete security hardening, load testing, and compliance review before production deployment.**
- This project is provided **"AS IS" without warranty of any kind, express or implied**. The author shall not be liable for any consequences arising from direct or indirect use of this project (including but not limited to data loss, business damage, or legal risks).
- You are welcome to study, reference, fork, or deploy this project for internal enterprise use and secondary development.

## 📄 License & Copyright

This project is open-sourced under the [MIT License](LICENSE), permitting **free use, modification, distribution, and commercial use**, provided that the copyright notice and license text are retained.

**Copyright © 2026 riceshowerX**

### Trademark Notice

This project is an independent open-source work and has no affiliation, sponsorship, or endorsement relationship with any brand. Names mentioned in this documentation — React, Vite, Three.js, Ant Design, Tailwind CSS, i18next, Node.js, Express, SQLite, etc. — are trademarks or registered trademarks of their respective owners and are used solely for technical description purposes.

---

<div align="center">

**One person can still achieve excellence**

NexMotor — built with passion, striving for perfection.

[⭐ Star this repo if you like it](https://github.com/riceshowerX/NexMotor)

</div>
