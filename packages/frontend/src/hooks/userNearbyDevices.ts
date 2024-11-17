import { useState, useEffect } from 'react';

interface NearbyUser {
  id: string;
  name: string;
  type: 'bluetooth' | 'webrtc';
  status: 'connecting' | 'connected' | 'disconnected';
  metrics?: {
    carbon: number;
    water: number;
  };
}

export const useNearbyDiscovery = () => {
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startBluetoothScan = async () => {
    if (!navigator.bluetooth) {
      setError('Bluetooth not supported');
      return;
    }

    try {
      setIsScanning(true);
      setError(null);

      const device = await navigator.bluetooth.requestDevice({
        filters: [{
          // Custom service UUID for our application
          services: ['00000000-0000-1000-8000-00805f9b34fb']
        }],
        optionalServices: ['battery_service']
      });

      const newUser: NearbyUser = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: 'bluetooth',
        status: 'connecting'
      };

      setNearbyUsers(prev => [...prev, newUser]);

      // Connect to device
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to device');
      }

      // Update connection status
      setNearbyUsers(prev => 
        prev.map(user => 
          user.id === device.id 
            ? { ...user, status: 'connected' }
            : user
        )
      );

      // Listen for disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setNearbyUsers(prev => 
          prev.map(user => 
            user.id === device.id 
              ? { ...user, status: 'disconnected' }
              : user
          )
        );
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  };

  const sendDataToNearbyUser = async (userId: string, data: any) => {
    const user = nearbyUsers.find(u => u.id === userId);
    if (!user) return;

    try {
      if (user.type === 'bluetooth') {
        await sendBluetoothData(userId, data);
      } else if (user.type === 'webrtc') {
        await sendWebRTCData(userId, data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send data');
    }
  };

  const sendBluetoothData = async (deviceId: string, data: any) => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['00000000-0000-1000-8000-00805f9b34fb'] }]
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to device');

      const service = await server.getPrimaryService('00000000-0000-1000-8000-00805f9b34fb');
      const characteristic = await service.getCharacteristic('00000000-0000-1000-8000-00805f9b34fb');

      const encoder = new TextEncoder();
      const dataArray = encoder.encode(JSON.stringify(data));
      await characteristic.writeValue(dataArray);
    } catch (err) {
      throw new Error('Failed to send Bluetooth data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const sendWebRTCData = async (peerId: string, data: any) => {
    // WebRTC implementation
  };

  return {
    nearbyUsers,
    isScanning,
    error,
    startBluetoothScan,
    sendDataToNearbyUser
  };
};
