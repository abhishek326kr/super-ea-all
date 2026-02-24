---
title: Basics
toc: false
order: 1
---

# Superadmin - Remix Version

# Basic Information

This is the Remix (React Router v7) version of the Superadmin application, migrated from the original React + Vite setup while maintaining the same UI, styling, and functionality.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Edit .env with your backend URL and TinyMCE API key
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
remix-client/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── BlogEdit.tsx    # Blog editing with TinyMCE
│   │   ├── CampaignWizard.tsx
│   │   ├── ConnectedSitesDashboard.tsx
│   │   ├── SiteCMS.tsx
│   │   ├── SiteManager.tsx
│   │   └── Login.tsx
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── styles/             # Styling and theme
│   │   ├── global.css      # Global styles and animations
│   │   └── theme.ts        # Material-UI theme configuration
│   ├── App.tsx             # Main app with routing
│   ├── index.css           # CSS imports
│   └── main.tsx            # App entry point
├── .env                    # Environment variables
├── package.json
└── vite.config.ts
```

## 🎨 UI & Styling

The application maintains the exact same:
- **Dark theme** with cyan accent colors
- **Glassmorphism effects** and animations
- **Typography** (Inter/Outfit fonts)
- **Responsive design** for mobile and desktop
- **Material-UI components** with custom theming

## 🔧 Key Features

- **Authentication** with protected routes
- **Blog management** with TinyMCE rich text editor
- **Site management** and connection handling
- **Dashboard** with statistics and overview
- **Mobile-responsive** navigation drawer

## 🛠 Technologies Used

- **React Router v7** (Remix)
- **Material-UI (MUI)** for components
- **TinyMCE** for rich text editing
- **Axios** for API calls
- **TypeScript** for type safety
- **Vite** for development and building

## 📝 Environment Variables

```env
VITE_BACKEND_URL=http://localhost:8000
VITE_TINYMCE_API_KEY=your-api-key-here
```

## 🔄 Migration Notes

This version maintains 100% UI/UX compatibility with the original React version:
- Same component structure and props
- Identical styling and theme
- Same routing and navigation
- All features preserved including TinyMCE integration

The main difference is the underlying framework migration from React Router v6 to React Router v7 (Remix) for improved performance and developer experience.

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Backend Integration

The frontend connects to the existing FastAPI backend running on `http://localhost:8000`. Make sure the backend server is running for full functionality.
# to run the backend server

# 1. Create the virtual environment
python -m venv venv

# 2. Then activate it
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
uvicorn main:app --reload
# 5. Open http://localhost:8000 in your browser
