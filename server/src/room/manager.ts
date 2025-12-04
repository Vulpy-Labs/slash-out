import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { GAME, PHYSICS, CHARACTER, SCENE } from 'shared/config/constants';
import { Engine, World, Bodies, Body } from 'matter-js';
import Matter = require('matter-js');

import { MapPhysicsManager } from '@/physics/managers/map/MapPhysicsManager';

export class RoomManager extends Room {
  // Matter.js physics
  private engine: Engine;
  private world: World;

  // Map players to their Matter.js bodies
  private playerPhysicBodies: Map<string, Body> = new Map();

  // Platform bodies
  private platformBodies: Body[] = [];

  // Fixed timestep accumulator
  private accumulator: number = 0;

  private physicsMapManager: MapPhysicsManager;

  onCreate() {
    console.log('Trying to initiate room connection with client');
    // Todo: () => Extract each section to functions;

    const state = new State();
    this.setState(state);
    this.setPatchRate(2);

    // Initialize Matter.js
    this.initiatePhysicsWorld();

    // Load platforms from Tiled map
    this.physicsMapManager = new MapPhysicsManager();
    this.physicsMapManager.loadPlatforms();
    this.platformBodies = this.physicsMapManager.getPlatformBodies();

    // Start physics simulation
    this.setSimulationInterval(deltaTime => this.update(deltaTime));

    // Setup message handlers
    this.setupClientMessagesListeners();
  }

  initiatePhysicsWorld() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;
  }

  onJoin(client: Client) {
    logger.info('Player joined:', client.sessionId);

    try {
      this.createPlayer({ sessionId: client.sessionId });
    } catch (error) {
      logger.error('Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');

    // Remove Matter.js physicalBody
    const physicalBody = this.playerPhysicBodies.get(client.sessionId);
    if (physicalBody) {
      World.remove(this.world, physicalBody);
      this.playerPhysicBodies.delete(client.sessionId);
    }

    // Remove from state
    this.state.players.delete(client.sessionId);
  }

  update(deltaTime: number) {
    // Accumulate time since last frame
    this.accumulator += deltaTime;

    // Run physics in fixed timesteps (e.g., 16.67ms for 60fps)
    // Purpose: Fixed timestep physics (prevents physics from running faster/slower based on framerate)
    while (this.accumulator >= GAME.CONFIG.FIXED_TIME_STEP) {
      this.fixedUpdate();
      this.accumulator -= GAME.CONFIG.FIXED_TIME_STEP;
    }
  }

  fixedUpdate() {
    // Step Matter.js physics
    Engine.update(this.engine, GAME.CONFIG.FIXED_TIME_STEP);

    // Sync Matter.js bodies → Colyseus state
    this.state.players.forEach((playerState: Player, sessionId: string) => {
      const playerBody = this.playerPhysicBodies.get(sessionId);
      if (!playerBody) return;

      // Clamp velocities
      if (Math.abs(playerBody.velocity.x) > CHARACTER.MOVEMENT.GROUND.SPEED) {
        Body.setVelocity(playerBody, {
          x: Math.sign(playerBody.velocity.x) * CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      }

      if (Math.abs(playerBody.velocity.y) > CHARACTER.MOVEMENT.AIR.SPEED) {
        Body.setVelocity(playerBody, {
          x: playerBody.velocity.x,
          y: Math.sign(playerBody.velocity.y) * CHARACTER.MOVEMENT.AIR.SPEED,
        });
      }

      // Check if grounded (simple check - you can improve this)
      playerState.isGrounded = this.isBodyGrounded(playerBody);
      // Update player state from Matter.js physicalBody (convert from center to top-left)
      this.syncPlayerStateWithPlayerBody({ playerState, playerBody });
    });
  }

  createPlayer({ sessionId }: { sessionId: string }) {
    const mapWidth = SCENE.WIDTH;
    const playerId = sessionId;
    try {
      // Create Colyseus player state
      const player = new Player();
      player.x = Math.random() * (mapWidth - CHARACTER.CONFIG.WIDTH);
      player.y = 100; // Spawn in air

      console.log(`👤 Player spawned at: x=${player.x}, y=${player.y}`);

      this.state.players.set(playerId, player);

      const playerBody = Bodies.rectangle(
        player.x,
        player.y,
        CHARACTER.CONFIG.WIDTH,
        CHARACTER.CONFIG.HEIGHT,
        {
          label: 'player',
          friction: CHARACTER.MOVEMENT.GROUND.FRICTION,
          frictionAir: CHARACTER.MOVEMENT.AIR.FRICTION,
          restitution: 0,
          inertia: Infinity, // Prevent rotation
        }
      );
      console.log(
        `👤 Player playerBody created at: x=${playerBody.position.x}, y=${playerBody.position.y}`
      );

      World.add(this.world, playerBody);
      this.playerPhysicBodies.set(playerId, playerBody);

      logger.info(`Player ${playerId} added with Matter.js physicalBody`);
    } catch (error: any) {
      logger.error(`Player ${playerId} not created. Error:`, error.message);
    }
  }

  syncPlayerStateWithPlayerBody({
    playerState,
    playerBody,
  }: {
    playerState: Player;
    playerBody: Matter.Body;
  }) {
    playerState.x = playerBody.position.x;
    playerState.y = playerBody.position.y;
    playerState.velocityX = playerBody.velocity.x;
    playerState.velocityY = playerBody.velocity.y;
  }

  isBodyGrounded(physicalBody: Body): boolean {
    const groundThresholdPixels = 2;

    for (const platform of this.platformBodies) {
      const bodyBottom = physicalBody.position.y + CHARACTER.CONFIG.HEIGHT / 2;
      const platformTop = platform.bounds.min.y;

      if (
        Math.abs(bodyBottom - platformTop) < groundThresholdPixels &&
        physicalBody.position.x + CHARACTER.CONFIG.WIDTH / 2 > platform.bounds.min.x &&
        physicalBody.position.x - CHARACTER.CONFIG.WIDTH / 2 < platform.bounds.max.x
      ) {
        return true;
      }
    }

    return false;
  }

  setupClientMessagesListeners() {
    this.onMessage(PLAYER_ACTIONS.MOVED, (client, payload) => {
      const playerBody = this.playerPhysicBodies.get(client.sessionId);
      const playerState = this.state.players.get(client.sessionId);

      if (!playerBody || !playerState) return;

      // Handle horizontal movement
      if (payload.left) {
        Body.setVelocity(playerBody, {
          x: -CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      } else if (payload.right) {
        Body.setVelocity(playerBody, {
          x: CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      } else {
        // ✅ Stop horizontal movement
        Body.setVelocity(playerBody, {
          x: 0,
          y: playerBody.velocity.y,
        });
      }

      // Handle jump (independent)
      if (payload.jump && playerState.isGrounded) {
        Body.setVelocity(playerBody, {
          x: playerBody.velocity.x,
          y: -CHARACTER.MOVEMENT.AIR.SPEED,
        });

        playerState.isGrounded = false; // Immediately set false to prevent double jump
      }
    });
  }
}
