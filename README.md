# 🎵 Guessify - Music Guessing Game Platform

Guessify is a real-time multiplayer music quiz platform split into three separate applications for optimal user experience and scalability.

## 🏗️ New Architecture

The platform is now divided into three separate applications:

### 🌐 Marketing Website (`marketing-website/`)

- Static marketing content and landing pages
- Company information, pricing, contact
- Redirects users to Create and Play apps
- **URL:** `guessifyapp.com` (production) | `localhost:3000` (dev)

### ⚙️ Create App (`create-app/`)

- Game creation and management platform
- User authentication and dashboard
- Analytics and game hosting
- **URL:** `create.guessifyapp.com` (production) | `localhost:3001` (dev)

### 🎮 Play App (`play-app/`)

- Game participation platform
- No authentication required
- Mobile-optimized for players
- **URL:** `play.guessifyapp.com` (production) | `localhost:3002` (dev)

### 🔧 Backend (`backend/`)

- Shared API server for all applications
- MongoDB database and WebSocket server
- **URL:** `api.guessifyapp.com` (production) | `localhost:8000` (dev)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB
- npm or yarn

### Run All Applications

```bash
# Make the script executable
chmod +x start-all-apps.sh

# Start all applications
./start-all-apps.sh
```

This will start:

- Backend server on port 8000
- Marketing website on port 3000
- Create app on port 3001
- Play app on port 3002

### Manual Setup

```bash
# Install dependencies for all apps
cd marketing-website && npm install && cd ..
cd create-app && npm install && cd ..
cd play-app && npm install && cd ..
cd backend && npm install && cd ..

# Start backend
cd backend && npm run dev &

# Start marketing website
cd marketing-website && npm start &

# Start create app
cd create-app && npm start &

# Start play app
cd play-app && npm start &
```

## 🛠 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/guessify.git
   cd guessify
   ```

2. Setup `.env` files in both `frontend` and `backend` folders.

   **In `backend/.env`:**

   ```
   PORT=your_port
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

   _Example:_

   ```
   PORT=8000
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/musicapp?retryWrites=true&w=majority
   JWT_SECRET=my_secret_key
   NODE_ENV=development
   ```

3. Install dependencies:

   ```bash
   # in /frontend
   cd frontend
   npm install

   # in /backend
   cd ../backend
   npm install
   ```

4. Start the development environment from the project root:

   ```bash
   npm run dev
   ```

   > This runs both backend and frontend concurrently using `concurrently`.

## 🧪 Tech Stack

- **Frontend:** React, Redux Toolkit, TailwindCSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT (stored in HTTP-only cookies)
- **Real-time:** WebSocket via socket.io

## 📸 Screenshots

### System Architecture

![Architecture](./screenshots/architecture.png)

### Homepage

![Homepage](./screenshots/homepage.png)

### Register Page

![Register](./screenshots/register.png)

### Login Page

![Login](./screenshots/login.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Create Game

![Create Game](./screenshots/crate.png)

### My Games

![My Games](./screenshots/mygames.png)

### Trello Board

![Trello](./screenshots/trello.png)

### Join Game Page

![Join](./screenshots/join.png)

### Waiting for Players

![Waiting For Players](./screenshots/waitingForPlayers.png)

### Both Waiting Views

![Both Waitings](./screenshots/bothwaitings.png)

### Waiting Screen

![Waiting Screen](./screenshots/waitingscreen.png)

### Players Joined

![Players Joined](./screenshots/playersJoined.png)

### Guess Screen

![Guess Screen](./screenshots/guessScreen.png)

### Right Guess

![Player Guessed](./screenshots/PlayerGuessed.png)

## 📌 Notes

- Songs are uploaded in MP3 format and stored on the server.
- Host and player sync is done in real-time using WebSocket events.
- Authentication is required to create or launch a game.

---

Feel free to contribute or fork this project for your own music games!
