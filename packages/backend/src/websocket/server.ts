import { Server } from 'socket.io';
import { User } from '../models/User';

export const setupWebSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('updateMetrics', async (data) => {
      try {
        await User.findOneAndUpdate(
          { id: data.userId },
          {
            $set: {
              metrics: data.metrics,
              lastSeen: new Date(),
              status: 'online'
            }
          },
          { upsert: true }
        );

        // Broadcast update to other users
        socket.broadcast.emit('userMetricsUpdate', {
          userId: data.userId,
          metrics: data.metrics
        });
      } catch (error) {
        console.error('Error updating metrics:', error);
      }
    });

    socket.on('disconnect', async () => {
      try {
        // Update user status to offline
        await User.findOneAndUpdate(
          { id: socket.id },
          {
            $set: {
              status: 'offline',
              lastSeen: new Date()
            }
          }
        );

        // Notify other users
        socket.broadcast.emit('userOffline', socket.id);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};
