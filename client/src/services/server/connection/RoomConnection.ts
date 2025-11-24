import 'reflect-metadata';
import Phaser from 'phaser';
import { Client, Room } from 'colyseus.js';

import { State } from 'shared/types/room/state';
import { ROOM_STATUS } from 'shared/config/events/room/status';

export class RoomConnection {
  client: Client;
  room: Room<State>;
  roomName: string;
  playerId!: string;
  events: Phaser.Events.EventEmitter;

  constructor() {
    this.client = new Client(import.meta.env.VITE_SERVER_URL);
    this.roomName = 'my_room';
    this.events = new Phaser.Events.EventEmitter();
  }

  async create() {
    console.log(
      `Client - Connected to "${this.roomName}" server via ${import.meta.env.VITE_SERVER_URL}`
    );

    try {
      this.room = await this.client.joinOrCreate<State>(this.roomName);
      this.playerId = this.room.sessionId;

      this.events.emit(ROOM_STATUS.CREATED, this.room);

      return this.room;
    } catch (e: any) {
      throw new Error(`Error while creating room: ${e}`);
    }
  }
}
