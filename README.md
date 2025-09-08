# PTime - Gig Worker Platform

A modern **monorepo** gig worker platform that connects part-time workers with local businesses. Built with React, TypeScript, NestJS, and Supabase.

## 🏗️ **Monorepo Structure**

```
ptime-monorepo/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vercel.json        # Vercel deployment config
├── backend/               # NestJS + TypeScript
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── jobs/          # Jobs module
│   │   └── common/        # Common utilities
│   ├── package.json
│   ├── Dockerfile         # Docker configuration
│   └── railway.json       # Railway deployment config
├── package.json           # Root workspace configuration
├── supabase-setup.sql     # Database schema
└── env.example            # Environment variables template
```

## 🚀 **Tech Stack**

### **Frontend** (Deployed to **Vercel**)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **TanStack Query** for data fetching
- **Supabase Auth** for authentication

### **Backend** (Deployed to **Railway**)
- **NestJS** with TypeScript
- **Node.js 18 LTS**
- **JWT Authentication** with Passport.js
- **Swagger/OpenAPI** for API documentation
- **Supabase** as database and auth provider

### **Database & Services**
- **PostgreSQL** via Supabase
- **Supabase Auth** for OAuth and user management
- **Supabase Realtime** for live updates

## 🛠️ **Quick Start**

### **1. Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account

### **2. Clone & Install**
```bash
git clone <your-repo-url>
cd ptime-monorepo

# Install all dependencies (root + frontend + backend)
npm run install:all
```

### **3. Environment Setup**
```bash
# Copy environment template
cp env.example .env

# Create frontend environment file
cp env.example frontend/.env

# Create backend environment file  
cp env.example backend/.env
```

**Edit each `.env` file with your Supabase credentials:**
```bash
# Frontend (.env or frontend/.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api/v1

# Backend (backend/.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### **4. Database Setup**
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and execute the SQL from `supabase-setup.sql`

### **5. Development**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend: http://localhost:3000
npm run dev:backend   # Backend: http://localhost:3001
```

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Docs**: http://localhost:3001/api/docs

## 📦 **Available Scripts**

### **Root Level Commands**
```bash
npm run dev              # Start both frontend & backend
npm run build            # Build both applications
npm run install:all      # Install all dependencies
npm run clean            # Clean all build files and node_modules
npm run lint             # Lint both frontend & backend
npm run test             # Test both applications
```

### **Frontend Only**
```bash
npm run dev:frontend     # Start development server
npm run build:frontend   # Build for production
npm run lint:frontend    # Lint frontend code
```

### **Backend Only**
```bash
npm run dev:backend      # Start development server
npm run build:backend    # Build for production  
npm run lint:backend     # Lint backend code
```

## 🚀 **Deployment**

### **Frontend → Vercel**
1. **Connect Repository**:
   - Connect your GitHub repo to Vercel
   - Set **Root Directory** to `frontend`
   - Framework will be auto-detected as **Vite**

2. **Environment Variables** in Vercel Dashboard:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```

3. **Deploy**: Push to main branch for automatic deployment

### **Backend → Railway**
1. **Connect Repository**:
   - Connect your GitHub repo to Railway
   - Set **Root Directory** to `backend`
   - Railway will detect the Dockerfile automatically

2. **Environment Variables** in Railway Dashboard:
   ```
   DATABASE_URL=your-supabase-db-url
   JWT_SECRET=your-jwt-secret
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   FRONTEND_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**: Push to main branch for automatic deployment

## 🎯 **User Flows**

### **For Gig Workers**
1. Visit landing page → Click **"Get Started"**
2. Sign up/sign in as worker
3. Redirected to user dashboard
4. Browse jobs, apply, track earnings

### **For Employers**
1. Visit landing page → Click **"Employer / Business Owner"**
2. Sign up/sign in as employer
3. Redirected to employer dashboard
4. Post jobs, review applications, manage workers

## 🔒 **Security Features**

- **Row Level Security** on all Supabase tables
- **Role-based access control** for frontend routes
- **JWT authentication** with secure token handling
- **CORS configuration** for secure API access
- **Input validation** on all API endpoints
- **Environment variable isolation** per environment

## 🛠️ **Development Guidelines**

### **Adding New Features**
1. **Frontend**: Add components in `frontend/src/components/`
2. **Backend**: Create modules in `backend/src/`
3. **Database**: Update schema in Supabase + `supabase-setup.sql`
4. **Types**: Keep TypeScript types in sync between frontend/backend

### **Code Organization**
- **Frontend**: Component-based architecture with contexts
- **Backend**: Module-based NestJS architecture
- **Shared**: Types and constants should be defined clearly
- **Testing**: Add tests in respective `test/` directories

## 📝 **API Documentation**

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes in appropriate `frontend/` or `backend/` directory
4. Test both applications: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

- **Issues**: Create GitHub issues for bugs/features
- **Documentation**: Check `/api/docs` for API reference
- **Email**: support@ptime.com

---

## ⚡ **What's Next?**

1. **Set up Supabase** and configure environment variables
2. **Deploy frontend** to Vercel
3. **Deploy backend** to Railway  
4. **Implement authentication** flows in backend
5. **Add job posting** and application features
6. **Implement real-time** notifications
7. **Add payment** processing

Built with ❤️ using modern web technologies for scalable deployment.