import 'reflect-metadata';
import Phaser from 'phaser';
import { Client, Room } from 'colyseus.js';

import { State } from 'shared/types/room/state';

export class RoomConnection {
  client: Client;
  serverRoom: Room<State>;
  roomName: string;
  playerId!: string;
  events: Phaser.Events.EventEmitter;

  constructor() {
    this.client = new Client(import.meta.env.VITE_SERVER_URL);
    this.roomName = 'my_room';
    this.events = new Phaser.Events.EventEmitter();
  }

  async create() {
    try {
      this.serverRoom = await this.client.joinOrCreate<State>(this.roomName);
      this.playerId = this.serverRoom.sessionId;

      return this;
    } catch (e: any) {
      throw new Error(`Error while creating room: ${e}`);
    }
  }
}
