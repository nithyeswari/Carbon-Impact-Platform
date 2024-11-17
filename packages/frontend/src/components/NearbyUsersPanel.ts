mport React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNearbyDiscovery } from '../hooks/useNearbyDiscovery';

const NearbyUsersPanel: React.FC = () => {
  const {
    nearbyUsers,
    isScanning,
    error,
    startBluetoothScan,
    sendDataToNearbyUser
  } = useNearbyDiscovery();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Nearby Users</span>
          <button
            onClick={startBluetoothScan}
            disabled={isScanning}
            className={`px-4 py-2 rounded-full text-sm font-medium text-white
              ${isScanning 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isScanning ? 'Scanning...' : 'Scan for Nearby'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-500 mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {nearbyUsers.map(user => (
            <div 
              key={user.id}
              className="p-4 border rounded-lg flex items-center justify-between bg-white"
            >
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {user.type === 'bluetooth' ? 'Bluetooth' : 'WebRTC'} •{' '}
                  <span className={`
                    ${user.status === 'connected' ? 'text-green-500' :
                      user.status === 'connecting' ? 'text-yellow-500' :
                      'text-red-500'
                    }
                  `}>
                    {user.status}
                  </span>
                </div>
              </div>
              
              {user.status === 'connected' && (
                <button
                  onClick={() => sendDataToNearbyUser(user.id, {
                    type: 'metrics',
                    data: { carbon: 100, water: 200 }
                  })}
                  className="px-4 py-2 rounded bg-green-100 text-green-700 text-sm hover:bg-green-200"
                >
                  Share Metrics
                </button>
              )}
            </div>
          ))}

          {nearbyUsers.length === 0 && !isScanning && (
            <div className="text-center text-gray-500 py-8">
              No nearby users found. Click "Scan for Nearby" to discover users.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyUsersPanel;