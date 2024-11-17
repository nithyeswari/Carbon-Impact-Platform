import { useState, useEffect } from 'react';

interface BluetoothDevice {
  id: string;
  name: string;
  metrics?: any;
}

export const useBluetooth = () => {
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (!navigator.bluetooth) {
      console.error('Web Bluetooth API is not available');
      return;
    }

    try {
      setIsScanning(true);
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            services: ['carbon-impact-service']
          }
        ]
      });

      const server = await device.gatt?.connect();
      if (!server) return;

      const service = await server.getPrimaryService('carbon-impact-service');
      const metricsCharacteristic = await service.getCharacteristic('metrics-characteristic');
      
      // Subscribe to metrics updates
      await metricsCharacteristic.startNotifications();
      metricsCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const metrics = JSON.parse(new TextDecoder().decode(value));
        
        setBluetoothDevices(prev => {
          const deviceIndex = prev.findIndex(d => d.id === device.id);
          if (deviceIndex >= 0) {
            const newDevices = [...prev];
            newDevices[deviceIndex] = {
              ...newDevices[deviceIndex],
              metrics
            };
            return newDevices;
          }
          return [...prev, { id: device.id, name: device.name || 'Unknown Device', metrics }];
        });
      });

    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const sendMetrics = async (deviceId: string, metrics: any) => {
    const device = bluetoothDevices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      const server = await device.gatt?.connect();
      if (!server) return;

      const service = await server.getPrimaryService('carbon-impact-service');
      const characteristic = await service.getCharacteristic('metrics-characteristic');
      
      const data = new TextEncoder().encode(JSON.stringify(metrics));
      await characteristic.writeValue(data);
    } catch (error) {
      console.error('Error sending metrics:', error);
    }
  };

  return {
    bluetoothDevices,
    isScanning,
    startScanning,
    sendMetrics
  };
};