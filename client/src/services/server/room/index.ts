import { Client, Room } from 'colyseus.js';

import { Player, State } from '../../../../../shared/types';

export class PlayerRoom extends Phaser.Scene {
  client: Client;
  room: Room<State>;
  roomName: string;
  playerId!: string;

  constructor() {
    super({ key: 'PlayerRoom' });
    this.client = new Client(import.meta.env.VITE_SERVER_URL);
    this.roomName = 'my_room';
  }

  async create() {
    console.log(`Client - Connected to server via ${import.meta.env.VITE_SERVER_URL}`);
    console.log(`Client - Joining room: ${this.roomName}...`);

    try {
      this.room = await this.client.joinOrCreate<State>(this.roomName);
      this.playerId = this.room.sessionId;

      console.log(`Client - Joined successfully with ID ${this.playerId}!`);
    } catch (e: any) {
      console.error('Client - PlayerRoom ~ create ~ e:', e);
    }
  }

  setupStateListeners() {
    console.log('Client - Setting up state listeners...');

    this.room.state.players.onAdd((player: Player, sessionId: string) => {
      console.log(`Client - Player ${sessionId} joined at position:`, player.x, player.y);

      if (sessionId !== this.room.sessionId) {
        this.createRemotePlayer(sessionId, player);
      }
    });

    this.room.state.players.onRemove((player: Player, sessionId: string) => {
      console.log(`Client - Player ${sessionId} left`);
    });
  }

  createRemotePlayer(sessionId: string, player: Player) {
    console.log(`Client - createRemotePlayer:`, sessionId, player);
  }
}
