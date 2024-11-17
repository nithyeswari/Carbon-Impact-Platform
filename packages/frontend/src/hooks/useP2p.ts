import { useState, useEffect } from 'react';
import Peer from 'peerjs';

export const useP2P = () => {
  const [peer, setPeer] = useState<Peer>();
  const [nearbyUsers, setNearbyUsers] = useState([]);
  
  useEffect(() => {
    const newPeer = new Peer();
    
    newPeer.on('open', (id) => {
      console.log('My peer ID is:', id);
      // Broadcast presence on local network
      broadcastPresence(id);
    });

    newPeer.on('connection', (conn) => {
      conn.on('data', (data) => {
        // Handle incoming data
        handleIncomingData(data);
      });
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const sendToNearby = (data: any) => {
    // Implementation
  };

  return { nearbyUsers, sendToNearby };
};