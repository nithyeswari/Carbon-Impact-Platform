import { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface NearbyUser {
  id: string;
  name: string;
  metrics?: {
    carbon: number;
    water: number;
  };
}

export function useNearby() {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('nearbyUser', (user: NearbyUser) => {
      setNearbyUsers(prev => [...prev, user]);
    });

    newSocket.on('userLeft', (userId: string) => {
      setNearbyUsers(prev => prev.filter(u => u.id !== userId));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const startScanning = async () => {
    setIsScanning(true);
    try {
      socket?.emit('startScanning');
      // Simulate scanning time
      await new Promise(resolve => setTimeout(resolve, 3000));
    } finally {
      setIsScanning(false);
    }
  };

  return {
    nearbyUsers,
    isScanning,
    startScanning
  };
}