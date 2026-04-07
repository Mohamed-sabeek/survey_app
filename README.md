# கருத்துக் கணிப்பு | Community Survey & Admin Dashboard

A Tamil-first mobile-friendly survey application targeting rural and semi-urban communities, paired with a fully secured, analytical Admin Dashboard capable of real-time CRUD operations.

## ✨ Recent Enhancements
- **Dynamic Hybrid Inputs**: Added "Other" custom text box support across all categories (Business, Farming, Labour, etc.).
* **Admin Scaling Optimization**: Dashboard layout refined for a perfect 100% zoom experience.
* **Full Question Mapping**: Inspection reports now display the actual English/Tamil question text instead of raw IDs.
* **Always-On Management**: Improved Admin UX with persistent view and delete actions.

## 🛠 Technology Stack
- **Frontend**: React 19 + Vite + Vanilla CSS + React Router + Chart.js
- **Backend Architecture**: Node.js + Express (MVC Pattern)
- **Database**: MongoDB (Mongoose)
- **Security**: JWT (JSON Web Tokens) Authentication + bcryptjs hashing
- **Deployment**: Configured for Vercel/Render compatibility

## 🌟 Core Features
1. **Bilingual Public Survey**: Responsive Tamil/English survey using rich emoji-based navigation for maximum accessibility.
2. **Secure Admin Portal**: Native JWT-based gateway with session management.
3. **Advanced Visual Analytics**: Real-time data parsing into interactive Pie, Bar, and Line charts.
4. **Data Management Tools**: Full CRUD capability with a robust search/filter system for hundreds of responses.

---

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js 18+
- Active MongoDB Connection String (Atlas recommended)

### 1. Configure Environment Variables
Set up `.env` files in both `client` and `server` folders.

#### `server/.env`
```env
MONGO_URI=mongodb+srv://<user>:<pwd>@cluster...
PORT=5000
JWT_SECRET=yoursecretkey
```

#### `client/.env`
```env
# Point this to your backend runtime URL
VITE_API_URL=http://localhost:5000
```

### 2. Run the Application
You need to run both folders simultaneously.

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 📡 API Architecture

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| **POST** | `/api/survey` | Public | Submit new survey payload |
| **POST** | `/api/admin/login` | Public | Admin authentication gateway |
| **GET** | `/api/admin/responses` | **JWT** | Fetch all dashboard analytics |
| **PUT** | `/api/admin/responses/:id`| **JWT** | Update specific database row |
| **DELETE**| `/api/admin/responses/:id`| **JWT** | Remove response from database |

---

## ☁️ Deployment Guidelines
- **Frontend (Vercel)**: Set `VITE_API_URL` to your live backend URL in Vercel settings.
- **Backend (Render)**: Configure `MONGO_URI` and `JWT_SECRET` as secret environment variables. Render handles the `PORT` automatically.
