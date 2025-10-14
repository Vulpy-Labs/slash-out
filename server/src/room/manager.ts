import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { ACTIONS } from 'shared/types/player/events';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { PhysicsBody } from '../physics/PhysicsBody';
import { PhysicsConfig } from '../physics/PhysicsConfig';

export class RoomManager extends Room {
  physicsWorld: PhysicsWorld;
  playerBodies: Map<string, PhysicsBody> = new Map();
  fixedTimeStep = 1000 / 60; // 60 FPS
  accumulator = 0;

  onCreate() {
    const state = new State();
    this.setState(state);
    this.setPatchRate(8); // Send updates every 50ms (20 times per second)

    // Initialize physics
    this.physicsWorld = new PhysicsWorld();

    // Start physics simulation loop
    this.setSimulationInterval(deltaTime => this.update(deltaTime));

    // Setup input handling
    this.setupClientMessagesListeners();
  }

  onJoin(client: Client) {
    console.log('🚀 Server - onJoin called for:', client.sessionId);

    try {
      const playerId = client.sessionId;

      // Create player schema
      const player = new Player();
      player.x = Math.random() * 300;
      player.y = 50; // Spawn in air so they fall to ground

      this.state.players.set(playerId, player);

      // Create physics body for this player
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

  /**
   * Main update loop - runs physics at fixed timestep
   */
  update(deltaTime: number) {
    this.accumulator += deltaTime;

    // Run physics at fixed 60 FPS
    while (this.accumulator >= this.fixedTimeStep) {
      this.fixedUpdate();
      this.accumulator -= this.fixedTimeStep;
    }
  }

  /**
   * Fixed timestep physics update
   */
  fixedUpdate() {
    // Update all players
    this.state.players.forEach((player: Player, sessionId: string) => {
      const body = this.playerBodies.get(sessionId);
      // console.log('🚀 ~ fixedUpdate ~ body:', body);
      if (!body) return;

      // Run physics
      this.physicsWorld.updateBody(body);

      // Sync state with physics body
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
        // Instant stop when no input
        body.velocityX = 0;
        console.log(
          '🚀 ~ RoomManager ~ setupClientMessagesListeners ~ body.velocityX:',
          body.velocityX
        );
      }

      // Handle jump (only if on ground)
      if (payload.jump && body.isGrounded) {
        body.velocityY = PhysicsConfig.jumpForce;
      }
    });
  }
}
