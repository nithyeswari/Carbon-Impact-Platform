import { Server } from 'socket.io';

export function setupWebSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('startScanning', () => {
      // Simulate finding nearby users
      setTimeout(() => {
        socket.emit('nearbyUser', {
          id: 'user1',
          name: 'John Doe',
          metrics: { carbon: 150, water: 200 }
        });
      }, 1000);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}