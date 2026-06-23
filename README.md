# Saas-noti-test
Saas-noti-test (Social Proof SaaS)
A lightweight SaaS platform that allows business owners to display social proof notifications (e.g., "Rahul from Mumbai bought this!") on their websites.

🚀 Project Status
Backend: PostgreSQL (Neon/Supabase) connected, Auth (JWT) implemented.

Frontend: React + Zustand + Vite setup.

Database: users and widget_configs tables active.

📋 Roadmap (Phases)
Phase 1 & 2: Infrastructure & Auth (Done ✅)
[x] Initial Vite React Setup.

[x] Node.js/Express Backend Setup.

[x] PostgreSQL connection with pg pool.

[x] JWT-based Authentication (Register/Login).

[x] State management with Zustand.

Phase 3: Dashboard & Settings (Done ✅)
[x] API for GET and PUT widget settings.

[x] Dashboard UI with dynamic form binding.

[x] Data persistence logic for widget customization (color, text, delay).

Phase 4: Embed System (Next Step 🔜)
[ ] Create generator API to serve the JS script.

[ ] Develop the lightweight Vanilla JS widget (The "Public" snippet).

[ ] Logic to fetch user-specific settings from the backend based on an API key/Domain.

Phase 5: Polish & Analytics (Future 🚀)
[ ] CSS Refinement (Tailwind integration fix).

[ ] Click tracking & Analytics Dashboard.

[ ] Subscription/Trial period logic (Optional).

🛠 Tech Stack
Frontend: React, Vite, Zustand, Axios

Backend: Node.js, Express, PostgreSQL (Raw SQL)

Auth: JWT (JSON Web Tokens), Bcrypt