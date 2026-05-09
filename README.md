# ⚡ JobSphere – Full-Stack Job Portal

A complete, production-ready job portal built with **React + Node.js + MongoDB**.

---

## 🗂️ Project Structure

```
job-portal/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (jobseeker & employer)
│   │   ├── Job.js           # Job listing schema
│   │   └── Application.js   # Application schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, /me
│   │   ├── jobs.js          # CRUD for jobs
│   │   ├── applications.js  # Apply, view, update status
│   │   └── profile.js       # Get/update user profile
│   ├── middleware/
│   │   └── auth.js          # JWT protect, role guards
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js     # Global auth state
    │   ├── components/
    │   │   ├── Navbar.js          # Responsive navbar
    │   │   └── JobCard.js         # Reusable job card
    │   ├── pages/
    │   │   ├── Home.js            # Landing page with search
    │   │   ├── Login.js           # Login form
    │   │   ├── Register.js        # Register with role toggle
    │   │   ├── Jobs.js            # Browse + filter jobs
    │   │   ├── JobDetail.js       # Job detail + apply form
    │   │   ├── Dashboard.js       # Role-based dashboard
    │   │   ├── PostJob.js         # Employer: post new job
    │   │   ├── EditJob.js         # Employer: edit job
    │   │   ├── MyApplications.js  # Seeker: track applications
    │   │   ├── JobApplicants.js   # Employer: manage applicants
    │   │   └── Profile.js         # Edit profile
    │   ├── App.js                 # Routes + PrivateRoute
    │   └── App.css                # Global design system
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or MongoDB Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔑 Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key_here
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (with filters) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create job (employer) |
| PUT | `/api/jobs/:id` | Update job (employer) |
| DELETE | `/api/jobs/:id` | Delete job (employer) |
| GET | `/api/jobs/employer/myjobs` | Get employer's jobs |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:jobId` | Apply for job |
| GET | `/api/applications/my/applications` | Seeker's applications |
| GET | `/api/applications/job/:jobId` | Job applicants (employer) |
| PUT | `/api/applications/:id/status` | Update status |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get own profile |
| PUT | `/api/profile` | Update profile |

---

## ✅ Features

### Job Seekers
- ✅ Register & Login
- ✅ Browse & search jobs (by keyword, location, category, type)
- ✅ View full job details
- ✅ Apply with cover letter + resume URL
- ✅ Track application status (pending/reviewed/shortlisted/rejected/hired)
- ✅ Update profile with skills, experience, education

### Employers
- ✅ Register & Login
- ✅ Post new jobs with full details
- ✅ Edit & delete job postings
- ✅ Toggle job active/inactive
- ✅ View all applicants per job
- ✅ Update application statuses
- ✅ Leave notes for applicants

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| State | Context API + localStorage |
| Styling | Custom CSS Design System |
| HTTP | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (7-day expiry) |
| Security | bcryptjs password hashing |

---

## 🔮 Suggested Enhancements

- File upload for resumes (Multer + Cloudinary)
- Email notifications (Nodemailer)
- Saved/bookmarked jobs
- Admin panel
- Real-time chat (Socket.io)
- Advanced search with Elasticsearch
- Pagination improvements
- OAuth (Google login)
