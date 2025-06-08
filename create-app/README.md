# 🎵 Guessify Create App

This is the game creation and management platform for Guessify - where users can create, edit, and manage their music guessing games.

## 🚀 Features

- User authentication (login/register)
- Game creation and editing
- Song search and management
- Game analytics
- Live game hosting
- My Games dashboard

## 🛠 Tech Stack

- **Frontend:** React, Redux Toolkit, TailwindCSS
- **State Management:** Redux Toolkit
- **Authentication:** JWT (HTTP-only cookies)
- **Real-time:** Socket.io
- **API:** RESTful API

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend server running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will run on `http://localhost:3001`

## 🌐 Deployment

In production, this will be deployed as a subdomain:
- **Production:** `https://create.guessifyapp.com`
- **Development:** `http://localhost:3001`

## 🔐 Authentication

All routes require authentication except login/register. Users are redirected to login page if not authenticated.

## 📁 Structure

```
src/
├── components/
│   ├── GameFlow/             # Game creation components
│   ├── HostFlow/             # Game hosting components
│   └── ...
├── pages/                    # All authenticated pages
├── slices/                   # Redux slices
├── hooks/                    # Custom hooks
└── App.jsx                  # Main app component
```

## 🎮 Game Flow

1. Login/Register
2. Dashboard
3. Create Game
4. My Games
5. Launch Game
6. Analytics
