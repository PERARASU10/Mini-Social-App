# Mini Social App

A TaskPlanet-inspired social feed: signup/login, public posts (text and/or image), likes, and comments.

## Project structure

- `frontend/` — React + Vite + Material UI
- `backend/` — Node.js + Express + MongoDB (two collections only: `users` and `posts`)

## Local setup

### 1. MongoDB

Start MongoDB locally **or** use a MongoDB Atlas connection string.

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

API: `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

Flow: **Sign up → Log in → Create a post → Like / comment on the feed.**

## Environment variables

Backend `.env`:

- `PORT` — default `5000`
- `MONGODB_URI` — local or Atlas URI
- `JWT_SECRET` — long random string
- `CLIENT_ORIGIN` — frontend URL (comma-separated if several)

Frontend production build should call the hosted API. Create `frontend/.env.production`:

```
VITE_API_URL=https://your-backend.onrender.com
```

Then prefix API calls if you add that later, or keep the Vite proxy for local work.

## Deployment (assignment)

- **Database:** MongoDB Atlas
- **Backend:** Render (`backend/`, start command `npm start`)
- **Frontend:** Vercel or Netlify (`frontend/`, build `npm run build`, output `dist`)
