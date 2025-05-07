# 🎵 Guessify

**Guessify** is a real-time multiplayer music quiz game built with React, Node.js, and WebSockets. Inspired by Kahoot, this app allows a host to create a custom quiz using short MP3 clips. Players join with a room code and try to guess the song as fast as possible.

---

## 🚀 Features

- 🎧 Create your own music quiz with uploaded MP3s  
- 🔗 Real-time gameplay using WebSockets  
- 👥 Host-player structure with unique room codes  
- 🎮 Multi-round song guessing & live score updates  
- ✅ Secure authentication with JWT in HTTP-only cookies  
- 📦 File upload (MP3s) via `multipart/form-data`  
- ⚙️ State management with Redux Toolkit + RTK Query  
- 📱 Fully responsive design for desktop and mobile

---

## 🔧 Tech Stack

### Frontend
- React
- React Router
- Redux Toolkit
- Redux Toolkit Query (RTK Query)
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- Multer (file uploads)

---

## 🧠 Architecture Highlights

- Authentication via JWT stored in HTTP-only cookies
- WebSocket handshake includes user ID for authorization context
- REST APIs for CRUD operations (e.g., creating & fetching games)
- WebSocket for real-time game events and updates

---

## 📡 Real-Time Events

| Event             | Description                          |
|------------------|--------------------------------------|
| `createRoom`     | Host creates a game room             |
| `joinRoom`       | Player joins a room by code          |
| `startGame`      | Host starts the game                 |
| `nextRound`      | Server plays the next song round     |
| `submitAnswer`   | Player submits a guess               |
| `correctAnswer`  | Server broadcasts correct answer     |
| `roundFailed`    | No correct answer – next round       |
| `gameOver`       | End of game                          |

---

## 📂 Folder Structure

```
/client        → React frontend  
/server        → Node/Express backend  
/models        → MongoDB schemas  
/uploads       → MP3 song uploads  
/sockets       → WebSocket logic  
```

---

## 🛠 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/guessify.git
   cd guessify
   ```

2. Setup `.env` files in both `client` and `server` folders.

3. Install dependencies:
   ```bash
   npm install           # in both /client and /server
   ```

4. Start the dev environment:
   ```bash
   npm run dev           # Runs backend + frontend concurrently
   ```

---

## 🧪 API Overview

| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| POST   | `/api/users/login` | Log in user               |
| POST   | `/api/users/logout`| Log out user              |
| POST   | `/api/games`       | Create a new game         |
| GET    | `/api/games/mine`  | Get games created by user |

---

## 🧩 Future Ideas

- 🏆 Public leaderboard

---

## 👨‍💻 Developed By

- Omri Peer  
- Robert Yefrayimov  
- Uri Katz  
- Noam Sela  

---

## 📄 License

MIT
