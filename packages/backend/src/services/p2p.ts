import dgram from 'dgram';
import { EventEmitter } from 'events';

export class P2PService extends EventEmitter {
  private socket: dgram.Socket;
  private users: Map<string, any> = new Map();

  constructor(private port: number) {
    super();
    this.socket = dgram.createSocket('udp4');
    this.setupSocket();
  }

  private setupSocket() {
    this.socket.bind(this.port);

    this.socket.on('message', (msg, rinfo) => {
      const data = JSON.parse(msg.toString());
      this.handleMessage(data, rinfo);
    });
  }

  private handleMessage(data: any, rinfo: dgram.RemoteInfo) {
    switch (data.type) {
      case 'presence':
        this.handlePresence(data, rinfo);
        break;
      case 'metrics':
        this.handleMetrics(data);
        break;
      // Add other message types
    }
  }

  broadcast(data: any) {
    const message = Buffer.from(JSON.stringify(data));
    this.socket.setBroadcast(true);
    this.socket.send(message, this.port, '255.255.255.255');
  }
}