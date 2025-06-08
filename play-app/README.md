# 🎵 Guessify Play App

This is the game participation platform for Guessify - where players join and play music guessing games using game codes.

## 🚀 Features

- Join games with 5-digit codes
- Real-time gameplay
- No authentication required
- Mobile-optimized interface
- Reconnection support

## 🛠 Tech Stack

- **Frontend:** React, TailwindCSS
- **Real-time:** Socket.io
- **Styling:** TailwindCSS

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

The app will run on `http://localhost:3002`

## 🌐 Deployment

In production, this will be deployed as a subdomain:
- **Production:** `https://play.guessifyapp.com`
- **Development:** `http://localhost:3002`

## 🎮 Player Flow

1. Enter game code
2. Enter nickname
3. Wait for game to start
4. Play and guess songs
5. View results

## 📁 Structure

```
src/
├── components/
│   └── GameFlow/             # Game participation components
├── pages/
│   └── JoinGamePage.jsx     # Main game page
└── App.jsx                  # Main app component
```

## 📱 Mobile Optimized

This app is specifically designed for mobile players joining games on their phones.
