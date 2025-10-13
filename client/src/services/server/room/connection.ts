import 'reflect-metadata';
import Phaser from 'phaser';

import { Client, Room } from 'colyseus.js';
import { Player } from '@/types/player/schema';
import { State } from '@/types/room/state';
import { CREATION } from '@/types/room/events';

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
      this.setupStateListeners();

      return this.room;
    } catch (e: any) {
      console.error('Client - PlayerRoom ~ create ~ e:', e);
    }
  }

  setupStateListeners() {
    console.log('Client - Attempting to attach onAdd listener...');
    try {
      this.room.state.players.onAdd((player: Player, sessionId: string) => {
        console.log('🎉🎉🎉 CLIENT - onAdd FIRED!!!', sessionId, player);

        player.onChange(() => {
          console.log('🎉🎉🎉 CLIENT - onChange FIRED!!!', sessionId, player);

          this.events.emit(ACTIONS.PLAYER_MOVED, player);
        });

        this.events.emit(CREATION.PLAYER_JOINED, player);
      });
    } catch (e) {
      console.error('Client - Error attaching onAdd:', e);
    }
  }

  send(type: string | number, message: any) {
    if (this.isConnected()) {
      this.room.send(type, message);
    } else {
      console.warn('PlayerRoom - Cannot send message, connection not ready');
    }
  }

  isConnected(): boolean {
    return this.room?.connection?.isOpen ?? false;
  }
}
