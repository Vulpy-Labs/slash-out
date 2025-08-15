import { Client, Room } from 'colyseus.js';

export class NetworkManager {
  private static instance: NetworkManager;
  private client: Client;
  private room: Room | null = null;

  private constructor() {
    // Connect to Colyseus server (adjust URL as needed)
    this.client = new Client(
      process.env.NODE_ENV === 'development'
        ? 'ws://localhost:2567'
        : 'wss://your-production-server.com'
    );
  }

  public static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  public async joinRoom(roomName: string = 'my_room'): Promise<Room> {
    try {
      this.room = await this.client.joinOrCreate(roomName);
      console.log('Successfully joined room:', this.room.roomId);
      return this.room;
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  public getRoom(): Room | null {
    return this.room;
  }

  public async leaveRoom(): Promise<void> {
    if (this.room) {
      await this.room.leave();
      this.room = null;
    }
  }

  public isConnected(): boolean {
    return this.room !== null;
  }
}
