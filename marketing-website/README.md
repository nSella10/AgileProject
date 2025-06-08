# 🎵 Guessify Marketing Website

This is the marketing website for Guessify - a static React application containing all the marketing content, landing pages, and information about the platform.

## 🚀 Features

- Static marketing content
- Landing pages
- About, Pricing, Contact pages
- Blog and news
- Redirects to Create and Play apps

## 🛠 Tech Stack

- **Frontend:** React, TailwindCSS
- **Routing:** React Router
- **Styling:** TailwindCSS

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will run on `http://localhost:3000`

## 🌐 Deployment

In production, this will be deployed to the main domain:
- **Production:** `https://guessifyapp.com`
- **Development:** `http://localhost:3000`

## 📁 Structure

```
src/
├── components/
│   ├── MarketingNavbar.jsx    # Navigation with Create/Play buttons
│   └── PageLayout.jsx         # Layout wrapper
├── pages/                     # All marketing pages
└── App.jsx                   # Main app component
```

## 🔗 Navigation

The navbar contains two main action buttons:
- **Create** - Redirects to create app (localhost:3001 in dev)
- **Play** - Redirects to play app (localhost:3002 in dev)
