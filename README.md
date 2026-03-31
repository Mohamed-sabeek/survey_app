# கருத்துக் கணிப்பு | Community Survey

A Tamil-first mobile-friendly survey app for rural/semi-urban areas (Pudukottai, Tamil Nadu).

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Start the Backend
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start the Frontend (dev)
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

### 3. Production Build
```bash
cd client
npm run build
# Serve dist/ with any static server
```

## API Endpoints

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | /api/survey     | Submit survey response   |
| GET    | /api/survey     | Get all responses        |
| GET    | /api/analytics  | Get counts per option    |

## Environment Variables (server/.env)
```
MONGO_URI=mongodb://localhost:27017/surveydb
PORT=5000
```
