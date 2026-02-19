# 🎮 Nexus Gaming Platform

A comprehensive gaming commerce platform featuring a sleek, dark-themed frontend and a powerful real-time backend. 

## 🚀 Features

- **Storefront**: Browse and buy the latest PC games.
- **Library**: Manage your collection and track achievements.
- **Social**: Real-time chat (Socket.io) and friend system.
- **AI Integration**: Smart game recommendations and chatbot assistant.
- **Admin Panel**: Complete control over games, users, and platform data.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Zustand.
- **Backend**: Node.js, Express, MongoDB, Socket.io.
- **Authentication**: JWT-based secure auth system.

## 📂 Project Structure

- `/frontend`: Next.js application (port 3000)
- `/backend`: Express API server (port 5000)

## 🏗️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### Setup

1. **Clone the repository** (if you haven't already extracted the zip).
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables provided in the source
   npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌐 Deployment

- **Frontend**: Recommended for [Vercel](https://vercel.com).
- **Backend**: Recommended for [Render](https://render.com) or [Railway](https://railway.app) due to Socket.io requirements.

---
*Developed as a premium gaming experience.*
