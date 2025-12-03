import { Body, Bodies } from 'matter-js';
import { Player } from 'shared/types/player/schema';
import { CHARACTER, SCENE } from 'shared/config/constants';
import { PhysicsWorldManager } from './PhysicsWorldManager';

/**
 * Manages player physics bodies and their interactions.
 * Handles player body creation, velocity management, ground detection, and state synchronization.
 */
export class PhysicsPlayerManager {
  private playerPhysicBodies: Map<string, Body> = new Map();
  private platformBodies: Body[] = [];
  private physicsWorld: PhysicsWorldManager;

  constructor(physicsWorld: PhysicsWorldManager) {
    this.physicsWorld = physicsWorld;
  }

  /**
   * Create a physics body for a player at the specified position.
   */
  createPlayerBody(sessionId: string, x: number, y: number): Body {
    const playerBody = Bodies.rectangle(x, y, CHARACTER.CONFIG.WIDTH, CHARACTER.CONFIG.HEIGHT, {
      label: 'player',
      friction: CHARACTER.MOVEMENT.GROUND.FRICTION,
      frictionAir: CHARACTER.MOVEMENT.AIR.FRICTION,
      restitution: 0,
      inertia: Infinity, // Prevent rotation
    });

    this.physicsWorld.addBody(playerBody);
    this.playerPhysicBodies.set(sessionId, playerBody);

    console.log(
      `👤 Player body created at: x=${playerBody.position.x}, y=${playerBody.position.y}`
    );

    return playerBody;
  }

  /**
   * Remove a player's physics body from the world.
   */
  removePlayerBody(sessionId: string): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (playerBody) {
      this.physicsWorld.removeBody(playerBody);
      this.playerPhysicBodies.delete(sessionId);
    }
  }

  /**
   * Get a player's physics body by session ID.
   */
  getPlayerBody(sessionId: string): Body | undefined {
    return this.playerPhysicBodies.get(sessionId);
  }

  /**
   * Set platform bodies for ground detection.
   */
  setPlatformBodies(platforms: Body[]): void {
    this.platformBodies = platforms;
  }

  /**
   * Update all player physics bodies and sync with their state.
   */
  updateAllPlayers(players: Map<string, Player>): void {
    players.forEach((playerState: Player, sessionId: string) => {
      const playerBody = this.playerPhysicBodies.get(sessionId);
      if (!playerBody) return;

      // Clamp horizontal velocity
      if (Math.abs(playerBody.velocity.x) > CHARACTER.MOVEMENT.GROUND.SPEED) {
        Body.setVelocity(playerBody, {
          x: Math.sign(playerBody.velocity.x) * CHARACTER.MOVEMENT.GROUND.SPEED,
          y: playerBody.velocity.y,
        });
      }

      // Clamp vertical velocity
      if (Math.abs(playerBody.velocity.y) > CHARACTER.MOVEMENT.AIR.SPEED) {
        Body.setVelocity(playerBody, {
          x: playerBody.velocity.x,
          y: Math.sign(playerBody.velocity.y) * CHARACTER.MOVEMENT.AIR.SPEED,
        });
      }

      // Update ground state
      playerState.isGrounded = this.isBodyGrounded(playerBody);

      // Sync physics body to state
      this.syncPlayerStateWithPlayerBody(playerState, playerBody);
    });
  }

  /**
   * Handle player movement input.
   */
  handleMovement(
    sessionId: string,
    payload: { left?: boolean; right?: boolean; jump?: boolean }
  ): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (!playerBody) return;

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
      // Stop horizontal movement
      Body.setVelocity(playerBody, {
        x: 0,
        y: playerBody.velocity.y,
      });
    }
  }

  /**
   * Handle player jump input.
   */
  handleJump(sessionId: string, playerState: Player): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (!playerBody || !playerState.isGrounded) return;

    Body.setVelocity(playerBody, {
      x: playerBody.velocity.x,
      y: -CHARACTER.MOVEMENT.AIR.SPEED,
    });

    playerState.isGrounded = false; // Immediately set false to prevent double jump
  }

  /**
   * Check if a body is grounded (on a platform).
   */
  private isBodyGrounded(physicalBody: Body): boolean {
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

  /**
   * Sync player state from physics body.
   */
  private syncPlayerStateWithPlayerBody(playerState: Player, playerBody: Body): void {
    playerState.x = playerBody.position.x;
    playerState.y = playerBody.position.y;
    playerState.velocityX = playerBody.velocity.x;
    playerState.velocityY = playerBody.velocity.y;
  }

  /**
   * Generate a random spawn position within the map bounds.
   */
  static generateSpawnPosition(): { x: number; y: number } {
    const mapWidth = SCENE.WIDTH;
    return {
      x: Math.random() * (mapWidth - CHARACTER.CONFIG.WIDTH),
      y: 100, // Spawn in air
    };
  }
}
