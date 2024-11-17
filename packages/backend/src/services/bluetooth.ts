import noble from '@abandonware/noble';

export class BluetoothService {
  private isScanning = false;
  private discoveredDevices = new Map();

  constructor() {
    this.setupNoble();
  }

  private setupNoble() {
    noble.on('stateChange', (state) => {
      if (state === 'poweredOn' && !this.isScanning) {
        this.startScanning();
      }
    });

    noble.on('discover', (peripheral) => {
      this.handleDiscoveredDevice(peripheral);
    });
  }

  private startScanning() {
    this.isScanning = true;
    noble.startScanning([], true);
  }

  private async handleDiscoveredDevice(peripheral: any) {
    if (this.isCarbonImpactDevice(peripheral)) {
      this.discoveredDevices.set(peripheral.id, {
        id: peripheral.id,
        name: peripheral.advertisement.localName,
        rssi: peripheral.rssi
      });

      try {
        await this.connectToDevice(peripheral);
      } catch (error) {
        console.error('Failed to connect to device:', error);
      }
    }
  }

  private isCarbonImpactDevice(peripheral: any) {
    // Check if device is running our application
    const manufacturerData = peripheral.advertisement.manufacturerData;
    if (!manufacturerData) return false;

    // Look for our application's identifier
    return manufacturerData.toString('hex').startsWith('C4RB0N');
  }

  private async connectToDevice(peripheral: any) {
    await peripheral.connectAsync();
    const services = await peripheral.discoverServicesAsync();
    
    for (const service of services) {
      if (service.uuid === 'carbon-impact-service') {
        const characteristics = await service.discoverCharacteristicsAsync();
        for (const characteristic of characteristics) {
          // Handle different characteristic types
          switch (characteristic.uuid) {
            case 'metrics-characteristic':
              await this.handleMetricsCharacteristic(characteristic);
              break;
            case 'challenge-characteristic':
              await this.handleChallengeCharacteristic(characteristic);
              break;
          }
        }
      }
    }
  }

  private async handleMetricsCharacteristic(characteristic: any) {
    // Subscribe to metrics updates
    await characteristic.subscribeAsync();
    characteristic.on('data', (data: Buffer) => {
      const metrics = JSON.parse(data.toString());
      // Handle received metrics
      console.log('Received metrics:', metrics);
    });
  }

  private async handleChallengeCharacteristic(characteristic: any) {
    // Subscribe to challenge updates
    await characteristic.subscribeAsync();
    characteristic.on('data', (data: Buffer) => {
      const challenge = JSON.parse(data.toString());
      // Handle received challenge
      console.log('Received challenge:', challenge);
    });
  }

  async broadcastMetrics(metrics: any) {
    const data = Buffer.from(JSON.stringify(metrics));
    for (const device of this.discoveredDevices.values()) {
      try {
        await this.sendData(device.id, 'metrics-characteristic', data);
      } catch (error) {
        console.error(`Failed to send metrics to device ${device.id}:`, error);
      }
    }
  }

  private async sendData(deviceId: string, characteristicUuid: string, data: Buffer) {
    const device = this.discoveredDevices.get(deviceId);
    if (!device) return;

    const peripheral = noble.peripherals[deviceId];
    if (!peripheral) return;

    try {
      await peripheral.connectAsync();
      const services = await peripheral.discoverServicesAsync();
      const service = services.find(s => s.uuid === 'carbon-impact-service');
      if (!service) return;

      const characteristics = await service.discoverCharacteristicsAsync();
      const characteristic = characteristics.find(c => c.uuid === characteristicUuid);
      if (!characteristic) return;

      await characteristic.writeAsync(data, false);
    } catch (error) {
      console.error(`Failed to send data to device ${deviceId}:`, error);
      throw error;
    }
  }
}