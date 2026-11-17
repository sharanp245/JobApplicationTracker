# Job Application Tracker

A full-stack app to track job applications, with an AI coach.

Stack: React (Vite), Node.js, Express, SQLite, bcrypt, sessions, OpenAI API.

## Features
- Register, log in, log out (bcrypt-hashed passwords, server-side sessions)
- Add, view and delete job applications (each user only sees their own)
- Settings: profile picture, edit username/email, delete account
- AI coach that suggests what to learn from your applications

## Run it locally
1. Backend
       cd my-backend
       npm install
       cp .env.example .env     (then fill in the values)
       node server.js
2. Frontend (second terminal)
       cd frontend
       npm install
       npm run dev
3. Open http://localhost:5173

## Known limitations
- Sessions are in memory, so restarting the server logs everyone out
- No HTTPS or login rate limiting yet
- Development setup only (React is not built and served by Express)
