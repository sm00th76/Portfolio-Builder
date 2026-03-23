<div align="center">
<img width="1200" height="475" alt="Portfolio Architect Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Portfolio Architect

A powerful web application that generates complete, customizable portfolio websites from your resume. Built by **Baladitya**.

## 📋 Project Overview

Portfolio Architect is an intelligent portfolio generation platform that transforms your professional resume into a fully-functional, production-ready portfolio website. Users can:

- **Create an Account** - Sign up securely with MongoDB Atlas backend
- **Input Resume Data** - Fill out a comprehensive resume form
- **Generate Portfolios** - Choose from multiple tech stacks (HTML/CSS/JS, React, Next.js)
- **Live Preview** - View generated code in real-time using WebContainer sandbox
- **View & Edit Code** - Syntax-highlighted code viewer with file browser
- **Download Projects** - Export entire projects as ZIP files
- **Persist Sessions** - Stay logged in with JWT authentication

### 🛠 Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite 6.2 for lightning-fast builds
- Tailwind CSS 4.1 for styling
- Framer Motion for animations
- Prism React Renderer for code highlighting

**Backend:**
- Express.js with Node.js (ES modules)
- MongoDB Atlas for cloud database
- Mongoose ODM for data validation
- JWT for secure authentication
- bcryptjs for password hashing

**Sandbox & Preview:**
- WebContainer API for in-browser execution
- Supports HTML, React, and framework projects
- Real-time dev server with hot reload

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sm00th76/Portfolio-Builder.git
   cd Portfolio-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` in the project root
   - Follow the [AUTH_SETUP.md](./AUTH_SETUP.md) guide for MongoDB Atlas setup
   - Add your credentials to `.env`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Create an account to get started

## 📁 Project Structure

```
/src
  ├── components/
  │   ├── ResumeForm.tsx          # Resume input form
  │   ├── ProjectWorkspace.tsx    # Code editor & live preview
  │   └── LoginSignup.tsx         # Authentication UI
  ├── services/
  │   ├── gemini.ts              # AI portfolio generation
  │   └── auth.ts                # Authentication API client
  ├── test/
  │   └── fixtures/              # Mock project data for testing
  └── App.tsx                    # Main application entry
  
/server
  ├── models/
  │   └── User.ts                # MongoDB user schema
  ├── routes/
  │   └── auth.ts                # Authentication endpoints
  ├── middleware/
  │   └── auth.ts                # JWT verification middleware
  └── server.ts                  # Express server configuration
```

## 🔐 Authentication

The app uses JWT-based authentication with the following flow:

1. **Sign Up** - Create account with email, password, and name
2. **Login** - Authenticate with existing credentials
3. **Token Storage** - JWT stored in browser localStorage
4. **Auto-Session** - Token verified on app load for persistent sessions
5. **Logout** - Clear token and return to login

See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed MongoDB Atlas configuration.

## 🎨 Key Features

### Resume to Portfolio Generation
- Input professional resume details
- Generate complete portfolio code automatically
- Choose from multiple modern tech stacks

### Live Code Preview
- Real-time sandbox environment powered by WebContainer
- Supports HTML, React, and Next.js projects
- Instant visual feedback on generated code

### Code Viewer & Editor
- Syntax highlighting for all file types
- File browser navigation
- One-click copy functionality

### Project Export
- Download complete projects as ZIP files
- Includes all source code and assets
- Ready for deployment

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐞 Troubleshooting

**Issue:** "MongoDB connection failed"
- Ensure `.env` has valid `MONGO_URI` from MongoDB Atlas
- Check network access list includes your IP

**Issue:** "WebContainer boot failed"
- Clear browser cache and restart
- Check browser console for detailed error messages

**Issue:** "Sandbox not loading"
- Ensure project has valid `package.json` or `index.html`
- Check network tab for any failed requests

## 📄 License

Created by **Baladitya** - Portfolio Architect Project

## 🤝 Contributing

Feel free to open issues and submit pull requests to improve Portfolio Architect.
