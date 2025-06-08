# 🚀 Deployment Guide

This guide explains how to deploy the Guessify platform with its new multi-app architecture.

## 🏗️ Architecture Overview

The platform consists of four separate deployments:

1. **Marketing Website** → `guessifyapp.com`
2. **Create App** → `create.guessifyapp.com`
3. **Play App** → `play.guessifyapp.com`
4. **Backend API** → `api.guessifyapp.com`

## 🌐 Domain Configuration

### DNS Settings
```
guessifyapp.com           → Marketing Website
create.guessifyapp.com    → Create App
play.guessifyapp.com      → Play App
api.guessifyapp.com       → Backend API
```

### SSL Certificates
Each subdomain needs its own SSL certificate or use a wildcard certificate for `*.guessifyapp.com`.

## 📦 Build Process

### 1. Marketing Website
```bash
cd marketing-website
npm install
npm run build
# Deploy build/ folder to static hosting
```

### 2. Create App
```bash
cd create-app
npm install
npm run build
# Deploy build/ folder to static hosting
```

### 3. Play App
```bash
cd play-app
npm install
npm run build
# Deploy build/ folder to static hosting
```

### 4. Backend API
```bash
cd backend
npm install
# Deploy to Node.js hosting (PM2, Docker, etc.)
```

## 🔧 Environment Variables

### Marketing Website (.env)
```
REACT_APP_NAME=Guessify Marketing Website
```

### Create App (.env)
```
REACT_APP_NAME=Guessify Create App
REACT_APP_API_URL=https://api.guessifyapp.com
```

### Play App (.env)
```
REACT_APP_NAME=Guessify Play App
REACT_APP_API_URL=https://api.guessifyapp.com
```

### Backend (.env)
```
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb://...
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://create.guessifyapp.com,https://play.guessifyapp.com
```

## 🐳 Docker Deployment

### Docker Compose Example
```yaml
version: '3.8'
services:
  marketing:
    build: ./marketing-website
    ports:
      - "3000:80"
    
  create-app:
    build: ./create-app
    ports:
      - "3001:80"
    
  play-app:
    build: ./play-app
    ports:
      - "3002:80"
    
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/guessify
    depends_on:
      - mongo
    
  mongo:
    image: mongo:latest
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Guessify Platform

on:
  push:
    branches: [main]

jobs:
  deploy-marketing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Marketing Website
        run: |
          cd marketing-website
          npm install
          npm run build
          # Deploy to hosting provider
  
  deploy-create:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Create App
        run: |
          cd create-app
          npm install
          npm run build
          # Deploy to hosting provider
  
  deploy-play:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Play App
        run: |
          cd play-app
          npm install
          npm run build
          # Deploy to hosting provider
  
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          # Deploy to server
```

## 📊 Monitoring

### Health Check Endpoints
- Marketing: `https://guessifyapp.com/health`
- Create App: `https://create.guessifyapp.com/health`
- Play App: `https://play.guessifyapp.com/health`
- Backend: `https://api.guessifyapp.com/health`

### Logging
Each application should have centralized logging configured for production monitoring.

## 🔒 Security Considerations

1. **CORS Configuration**: Backend should only allow requests from the three frontend domains
2. **Rate Limiting**: Implement rate limiting on the API
3. **SSL/TLS**: All domains should use HTTPS
4. **Environment Variables**: Never commit sensitive data to version control
5. **Database Security**: Use MongoDB Atlas or secure self-hosted instance

## 🚨 Rollback Strategy

Each application can be rolled back independently:
1. Keep previous build artifacts
2. Use blue-green deployment strategy
3. Database migrations should be backward compatible

## 📈 Scaling

- **Frontend Apps**: Can be served from CDN (Cloudflare, AWS CloudFront)
- **Backend**: Can be horizontally scaled with load balancer
- **Database**: Use MongoDB replica sets for high availability
