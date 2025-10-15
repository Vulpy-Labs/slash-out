import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { ACTIONS } from 'shared/types/player/events';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { PhysicsBody } from '../physics/PhysicsBody';
import { PhysicsConfig } from '../physics/PhysicsConfig';
import { TiledMapLoader } from '../physics/TiledMapLoader';
import { SERVER_PATCH_RATE } from 'shared/config/constants/connection';

import * as fs from 'fs';
import * as path from 'path';

export class RoomManager extends Room {
  physicsWorld: PhysicsWorld;
  playerBodies: Map<string, PhysicsBody> = new Map();
  fixedTimeStep = 1000 / 60;
  accumulator = 0;

  onCreate() {
    const state = new State();
    this.setState(state);
    this.setPatchRate(SERVER_PATCH_RATE);

    // Load Tiled map and extract platforms
    try {
      const mapPath = path.join(process.cwd(), '../client/public/assets/maps/canyon.json');
      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
      const platforms = TiledMapLoader.extractPlatforms(mapData);

      logger.info(`✅ Loaded ${platforms.length} platforms from canyon.json`);

      // Initialize physics with map platforms
      this.physicsWorld = new PhysicsWorld(platforms);

      console.log('Total platforms:', this.physicsWorld.platforms.length);
      console.log('First 10 platforms:');
      this.physicsWorld.platforms.slice(0, 10).forEach((p, i) => {
        console.log(`  [${i}] x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height}`);
      });
    } catch (error) {
      logger.error('❌ Failed to load map:', error);
      // Fallback: create default ground
      this.physicsWorld = new PhysicsWorld([{ x: 0, y: 220, width: 352, height: 20 }]);
    }

    this.setSimulationInterval(deltaTime => this.update(deltaTime));
    this.setupClientMessagesListeners();
  }

  onJoin(client: Client) {
    console.log('🚀 Server - onJoin called for:', client.sessionId);

    try {
      const playerId = client.sessionId;

      const player = new Player();
      player.x = 176; // Center of map (352 / 2)
      player.y = 100; // High up so they fall

      console.log(`Player spawned at: x=${player.x}, y=${player.y}`);

      this.state.players.set(playerId, player);

      const body = new PhysicsBody(
        player.x,
        player.y,
        PhysicsConfig.player.width,
        PhysicsConfig.player.height
      );
      this.playerBodies.set(playerId, body);

      logger.info(`Player ${playerId} added successfully!`);
    } catch (error) {
      console.error('🚀 Server - Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
    this.playerBodies.delete(client.sessionId);
  }

  update(deltaTime: number) {
    this.accumulator += deltaTime;
    // console.log(`Δt: ${deltaTime.toFixed(2)}ms`);

    while (this.accumulator >= this.fixedTimeStep) {
      this.fixedUpdate();
      this.accumulator -= this.fixedTimeStep;
    }
  }

  fixedUpdate() {
    this.state.players.forEach((player: Player, sessionId: string) => {
      const body = this.playerBodies.get(sessionId);
      if (!body) return;

      const beforeY = body.y;
      const beforeGrounded = body.isGrounded;

      this.physicsWorld.updateBody(body);

      if (Math.abs(body.y - beforeY) > 5 && body.isGrounded) {
        console.log(
          `⚠️ Big jump while grounded! y: ${beforeY.toFixed(2)} → ${body.y.toFixed(
            2
          )}, grounded: ${beforeGrounded} → ${body.isGrounded}`
        );
      }

      player.x = body.x;
      player.y = body.y;
      player.velocityX = body.velocityX;
      player.velocityY = body.velocityY;
      player.isGrounded = body.isGrounded;
    });
  }

  setupClientMessagesListeners() {
    this.onMessage(ACTIONS.PLAYER_MOVED, (client, payload) => {
      const body = this.playerBodies.get(client.sessionId);
      const player = this.state.players.get(client.sessionId);

      if (!body || !player) return;

      console.log(`${new Date().toLocaleTimeString()} payload.left :`, payload.left);
      console.log(`${new Date().toLocaleTimeString()} payload.right:`, payload.right);
      // Handle left/right movement (instant like Samurai Gunn)
      if (payload.left) {
        body.velocityX = -PhysicsConfig.moveSpeed;
        player.facingRight = false;
      } else if (payload.right) {
        body.velocityX = PhysicsConfig.moveSpeed;
        player.facingRight = true;
      } else {
        body.velocityX = 0;
      }

      console.log(`${new Date().toLocaleTimeString()} payload.jump:`, payload.jump);
      if (payload.jump && body.isGrounded) {
        body.velocityY = PhysicsConfig.jumpForce;
      }
    });
  }
}
