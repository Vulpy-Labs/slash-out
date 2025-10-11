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
    // console.log(`Client - Connected to server via ${import.meta.env.VITE_SERVER_URL}`);
    // console.log(`Client - Joining room: ${this.roomName}...`);

    try {
      this.room = await this.client.joinOrCreate<State>(this.roomName);
      this.playerId = this.room.sessionId;
      this.setupStateListeners();

      // console.log(`Client - Joined successfully with ID ${this.playerId}!`);

      // Now log what happens
      // console.log('Client - Listeners set up, waiting for state updates...');
    } catch (e: any) {
      console.error('Client - PlayerRoom ~ create ~ e:', e);
    }
  }

  setupStateListeners() {
    console.log('Client - Setting up state listeners...');
    // console.log('Client - Current players in state:', this.room.state.players.size);

    this.room.onMessage(
      CREATION.PLAYER_JOINED,
      ({ sessionId, player }: { sessionId: string; player: Player }) => {
        console.log('Client - Received player_joined message:', { sessionId, ...player });

        // Now check the state
        // const player = this.room.state.players.get(sessionId);
        // console.log('Client - Player in state:', player);

        // console.log(
        //   `Client - sessionId [${sessionId}] !== this.playerId [${this.playerId}]:`,
        //   sessionId !== this.playerId
        // );

        if (sessionId === this.playerId) {
          // Todo: () => transformar em enum
          this.events.emit('local-player-ready', player);
        } else {
          this.events.emit('remote-player-ready', player);
        }
      }
    );

    // 2. Process existing players in state RIGHT NOW
    this.room.state.players.forEach((player: Player, sessionId: string) => {
      console.log(`🔍 Client - Processing existing player in state: ${sessionId}`);

      // Set up onChange listener for this existing player
      player.onChange(() => {
        console.log(`🔄 Player ${sessionId} moved:`, player.x, player.y);
        this.events.emit('player-moved', sessionId, player.x, player.y);
      });
    });

    // 3. Handle FUTURE players (who join AFTER you)
    this.room.state.players.onAdd((player: Player, sessionId: string) => {
      console.log(`✅ Client - onAdd fired for NEW player: ${sessionId}`);

      // Set up onChange listener for this new player
      player.onChange(() => {
        console.log(`🔄 Player ${sessionId} moved:`, player.x, player.y);
        this.events.emit('player-moved', sessionId, player.x, player.y);
      });
    });
  }

  createRemotePlayer(sessionId: string, player: Player) {
    console.log(`Client - createRemotePlayer:`, sessionId, player);
  }

  getRoomState() {
    return this.room.state;
  }

  getPlayerId() {
    return this.playerId;
  }

  send(type: string | number, message: any) {
    if (this.room?.connection?.isOpen) {
      this.room.send(type, message);
    } else {
      console.warn('PlayerRoom - Cannot send message, connection not ready');
    }
  }

  isConnected(): boolean {
    return this.room?.connection?.isOpen ?? false;
  }
}
