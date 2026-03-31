# கருத்துக் கணிப்பு | Community Survey & Admin Dashboard

A Tamil-first mobile-friendly survey application targeting rural and semi-urban communities, paired with a fully secured, analytical Admin Dashboard capable of real-time CRUD operations.

## Technology Stack
- **Frontend**: React + Vite + Tailwind CSS + React Router + Chart.js
- **Backend Architecture**: Node.js + Express (MVC Pattern)
- **Database**: MongoDB (Mongoose)
- **Security**: JWT (JSON Web Tokens) Authentication + bcryptjs password hashing

## Core Features
1. **Public Survey Portal**: A deeply structured, responsive survey using rich 3D emoji assets in place of standard text formats.
2. **Secure Admin Login**: Gateway built natively with localized token-based tracking.
3. **Data Visualizations**: Dashboard parses MongoDB array documents directly into interactive Pie & Bar graphs natively.
4. **Full CRUD Support**: Admins can edit existing payloads or discard false data safely from the UI.

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- Active MongoDB Connection String (Atlas or Local)

### 1. Configure Environment Variables
You must set up `.env` files in both the `client` and `server` folders!

#### `server/.env`
```env
MONGO_URI=mongodb+srv://<user>:<pwd>@cluster...
PORT=5000
JWT_SECRET=supersecretkey_change_this_in_production
```

#### `client/.env`
```env
# Point this to your backend runtime URL
VITE_API_URL=http://localhost:5000
```

### 2. Start the Backend
```bash
cd server
npm install
npm run dev
# Server spins up on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
# UI accessible on http://localhost:5173
```

---

## 📡 API Architecture

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| **POST** | `/api/survey` | Public | Submit new survey payload |
| **POST** | `/api/admin/login` | Public | Admin authentication gateway |
| **POST** | `/api/admin/register` | Postman | Create initial admin accounts |
| **GET** | `/api/admin/responses` | **JWT** | Fetch all dashboard analytics |
| **PUT** | `/api/admin/responses/:id`| **JWT** | Update specific database row |
| **DELETE**| `/api/admin/responses/:id`| **JWT** | Strip response from database |

---

## ☁️ Deployment Guidelines
- **Frontend (Vercel)**: When pushing your code, explicitly set `VITE_API_URL=https://your-backend.onrender.com` in your Vercel Project Environment Settings. The `axios` configurations are dynamically built to absorb this naturally.
- **Backend (Render)**: Supply `MONGO_URI` and `JWT_SECRET` manually in Render's dashboard. Render automatically provides `PORT`.
