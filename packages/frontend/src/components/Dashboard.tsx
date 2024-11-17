import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useP2P } from '../hooks/useP2P';
import { useWebRTC } from '../hooks/useWebRTC';
import { useBluetooth } from '../hooks/useBluetooth';

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'nearby';
  lastSeen?: string;
  metrics: {
    carbon: number;
    water: number;
  };
}

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [localMetrics, setLocalMetrics] = useState({ carbon: 0, water: 0 });
  const { nearbyUsers, sendToNearby } = useP2P();
  const { webrtcUsers, connectWebRTC } = useWebRTC();
  const { bluetoothUsers, connectBluetooth } = useBluetooth();

  const [connectionType, setConnectionType] = useState<'internet' | 'p2p' | 'bluetooth'>('internet');

  useEffect(() => {
    // Merge users from different sources
    const allUsers = [
      ...nearbyUsers,
      ...webrtcUsers,
      ...bluetoothUsers
    ].reduce((unique: User[], user) => {
      const exists = unique.find(u => u.id === user.id);
      if (!exists) unique.push(user);
      return unique;
    }, []);

    setUsers(allUsers);
  }, [nearbyUsers, webrtcUsers, bluetoothUsers]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Connection Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setConnectionType('internet')}
              className={`px-4 py-2 rounded ${
                connectionType === 'internet' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              Internet
            </button>
            <button
              onClick={() => setConnectionType('p2p')}
              className={`px-4 py-2 rounded ${
                connectionType === 'p2p' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              Local Network
            </button>
            <button
              onClick={() => setConnectionType('bluetooth')}
              className={`px-4 py-2 rounded ${
                connectionType === 'bluetooth' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              Bluetooth
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Your Impact */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Carbon Footprint</div>
              <div className="text-2xl font-bold text-green-600">
                {localMetrics.carbon.toFixed(1)} kg
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Water Usage</div>
              <div className="text-2xl font-bold text-blue-600">
                {localMetrics.water.toFixed(1)} L
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Users */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Challengers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">
                    {user.status === 'online' ? (
                      <span className="text-green-500">●</span>
                    ) : user.status === 'nearby' ? (
                      <span className="text-blue-500">●</span>
                    ) : (
                      <span className="text-gray-500">●</span>
                    )}
                    {' '}
                    {user.status === 'offline' 
                      ? `Last seen ${new Date(user.lastSeen!).toLocaleString()}`
                      : user.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Carbon: {user.metrics.carbon.toFixed(1)} kg</div>
                  <div className="text-sm text-gray-600">Water: {user.metrics.water.toFixed(1)} L</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};