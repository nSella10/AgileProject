# 🎵 Guessify - Music Guessing Game

Guessify is a real-time multiplayer music quiz web application, inspired by Kahoot, where a host can create custom games based on song snippets. Players join via mobile and try to guess the song being played.

## 🧠 Features

- 🎧 Custom game creation with MP3 uploads
- 📲 Players join via mobile and guess songs in real-time
- 🕹️ Host controls the game and sees live updates
- 🔒 JWT-based authentication & protected routes
- 🔊 WebSocket communication for synchronization

## 📂 Folder Structure

```
/frontend        → React frontend
/backend         → Node/Express backend
/backend/models  → MongoDB schemas
/backend/uploads → MP3 song uploads
/backend/sockets → WebSocket logic
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

## 📸 Screenshots

### System Architecture

![Architecture](./screenshots/architecture.png)

### Homepage

![Homepage](./screenshots/homepage.png)

### Join Game Page

![Join](./screenshots/join.png)

### Login Page

![Login](./screenshots/login.png)

### Register Page

![Register](./screenshots/register.png)

### Dashboard

![Dashboard](./screenshots/dashboard.png)

### Create Game

![Create Game](./screenshots/crate.png)

### My Games

![My Games](./screenshots/mygames.png)

### Waiting for Players

![Waiting For Players](./screenshots/waitingForPlayers.png)

### Waiting Screen

![Waiting Screen](./screenshots/waitingscreen.png)

### Both Waiting Views

![Both Waitings](./screenshots/bothwaitings.png)

### Players Joined

![Players Joined](./screenshots/playersJoined.png)

### Player Guessed

![Player Guessed](./screenshots/PlayerGuessed.png)

### Guess Screen

![Guess Screen](./screenshots/guessScreen.png)

### Trello Board

![Trello](./screenshots/trello.png)
