import { Client, logger } from 'colyseus';
import { Bodies, Body, World } from 'matter-js';
import { CHARACTER, SCENE } from 'shared/config/constants';
import { Player } from 'shared/types/player/schema';
import { State } from 'shared/types/room/state';

export class PlayerPhysicsManager {
  world: World;
  state: State;
  playerPhysicBodies: Map<string, Body> = new Map();
  private platformBodies: Body[] = [];

  constructor(world: World, state: State, platformBodies: Body[]) {
    this.world = world;
    this.state = state;
    this.platformBodies = platformBodies;
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

      return this.playerPhysicBodies;
    } catch (error: any) {
      logger.error(`Player ${playerId} not created. Error:`, error.message);
      return this.playerPhysicBodies;
    }
  }

  updatePlayersActions() {
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

  updatePlayerBody(client: Client, payload: any) {
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

    console.log(`player x: ${playerBody.position.x} | y: ${playerBody.position.y}`);
  }

  removePlayer(client: Client) {
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
}
