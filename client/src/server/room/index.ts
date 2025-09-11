// import { logger } from 'colyseus';
import { Client, Room } from 'colyseus.js';

/**
 * Todo: () => learn when its better to use constructor
 * Todo: () => learn when its better to use private
 * Todo: () => learn about hierarchy
 * Todo: () => learn about inheritance
 *  */
export class PlayerRoom extends Phaser.Scene {
  client: Client;
  room: Room;
  roomName: string;

  constructor() {
    super();
    this.client = new Client(import.meta.env.VITE_SERVER_URL);
    this.roomName = 'my_room';
  }

  async create() {
    console.log(`Connected to server via ${import.meta.env.VITE_SERVER_URL}`);
    console.log(`Joining room: ${this.roomName}...`);

    try {
      this.room = await this.client.joinOrCreate(this.roomName);
      console.log('Joined successfully!');
    } catch (e: any) {
      console.error('🚀 ~ PlayerRoom ~ create ~ e:', e);

      throw new Error(e.message);
    }
  }
}
