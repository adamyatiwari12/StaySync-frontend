# 🏠 StaySync – PG / Hostel Management System

StaySync is a full-stack, multi-tenant PG/Hostel management web application designed to streamline property operations for admins and improve the living experience for tenants. The platform provides secure role-based access, room allocation, complaint handling, and rent payment tracking through a modern and responsive UI.

---

## 🚀 Live Demo
Frontend: https://stay-sync-frontend.vercel.app
Backend: https://staysync-backend-pr02.onrender.com

Note: The backend is hosted on Render (free tier) and may take a few seconds to wake up on the first request.

---

## 🛠️ Tech Stack

Frontend:
- HTML
- Tailwind CSS
- JavaScript
- React
- Next.js

Backend:
- Node.js
- Express.js

Database:
- MongoDB (MongoDB Atlas)

Authentication & Security:
- JWT (JSON Web Tokens)
- Role-based access control
- Backend-enforced multi-tenant isolation

Deployment:
- Frontend: Vercel
- Backend: Render

---

## ✨ Features

Authentication & Roles:
- Secure login and signup using JWT
- Role-based access for Admin and Tenant
- Backend-controlled stay-level data isolation

Admin Features:
- Create and manage stays (PG/Hostel)
- Add and manage rooms with capacity tracking
- Assign and remove tenants from rooms
- View real-time dashboard with occupancy statistics
- Track tenant complaints and update their status
- Monitor rent payments and pending dues

Tenant Features:
- View assigned room details
- Raise and track complaints
- View complaint resolution status
- Access rent payment history
- Manage personal profile

Payments Module:
- Monthly rent tracking per tenant
- Payment status management (paid / unpaid)
- Admin overview of pending and completed payments
- Historical payment records for transparency
- Scalable design for future online payment integration

Dashboard & Insights:
- Occupancy rate calculation
- Room availability insights
- Structured data flow for future analytics

---

## 🧠 Technical Highlights

- Multi-tenant architecture using JWT-based context propagation
- Strict backend filtering to prevent cross-stay data leakage
- Stay-specific database indexing for data consistency
- RESTful API design following MVC architecture
- Secure environment-based configuration
- Production-ready deployment pipeline with GitHub auto-deploy

---

## 📁 Project Structure

Backend:
pg-management-backend/
- src/
  - controllers/
  - models/
  - routes/
  - middleware/
  - utils/
- server.js
- package.json
- .env (ignored)

Frontend:
pg-management-frontend/
- app/
- components/
- services/
- context/
- types/
- tailwind.config.js

---

## ⚙️ Environment Variables

Backend (.env):
Mongo_URI=your_mongodb_atlas_uri  
JWT_SECRET=your_jwt_secret  
ENABLE_BOOTSTRAP=false  
NODE_ENV=production  

Frontend (Vercel):
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api  

---

## 🧪 Bootstrap (One-Time Setup)

To initialize the first Stay and Admin:
1. Set ENABLE_BOOTSTRAP=true
2. Call POST /api/bootstrap
3. Disable ENABLE_BOOTSTRAP after success

---

## 🏁 How to Run Locally

Backend:
- npm install
- npm start

Frontend:
- npm install
- npm run dev

---

## 📌 Future Enhancements
- Online payment gateway integration
- Email & SMS notifications
- Super Admin dashboard for multiple properties
- Advanced analytics and reports
- Mobile app support

---

## 👨‍💻 Author
StaySync – Internship Project  
Built with a focus on scalability, security, and real-world backend architecture.

---

## 📄 License
This project is licensed for educational and internship purposes.
