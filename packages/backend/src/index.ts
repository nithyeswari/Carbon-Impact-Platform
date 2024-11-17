# packages/backend/src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { P2PService } from './services/p2p';
import { setupWebSocketHandlers } from './websocket/server';
import { initDatabase } from './db';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const p2pService = new P2PService(Number(process.env.P2P_PORT) || 4001);

// Setup WebSocket handlers
setupWebSocketHandlers(io);

// Database initialization
initDatabase();

// Basic routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
