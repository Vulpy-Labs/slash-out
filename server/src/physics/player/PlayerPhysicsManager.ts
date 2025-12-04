import { Body, Bodies } from 'matter-js';
import { Player } from 'shared/types/player/schema';
import { CHARACTER, SCENE } from 'shared/config/constants';
import { WorldPhysicsManager } from '../world/WorldPhysicsManager';

export class PlayerPhysicsManager {
  private playerPhysicBodies: Map<string, Body> = new Map();
  private platformBodies: Body[] = [];
  private physicsWorld: WorldPhysicsManager;

  constructor(physicsWorld: WorldPhysicsManager) {
    this.physicsWorld = physicsWorld;
  }

  createPlayerBody(sessionId: string, x: number, y: number): Body {
    const playerBody = Bodies.rectangle(x, y, CHARACTER.CONFIG.WIDTH, CHARACTER.CONFIG.HEIGHT, {
      label: `player_${sessionId}`,
      friction: CHARACTER.MOVEMENT.GROUND.FRICTION,
      frictionAir: CHARACTER.MOVEMENT.AIR.FRICTION,
      restitution: 0,
      inertia: Infinity,
    });

    this.physicsWorld.addBody(playerBody);
    this.playerPhysicBodies.set(sessionId, playerBody);

    return playerBody;
  }

  removePlayerBody(sessionId: string): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (playerBody) {
      this.physicsWorld.removeBody(playerBody);
      this.playerPhysicBodies.delete(sessionId);
    }
  }

  getPlayerBody(sessionId: string): Body | undefined {
    return this.playerPhysicBodies.get(sessionId);
  }

  setPlatformBodies(platforms: Body[]): void {
    this.platformBodies = platforms;
  }

  updateAllPlayers(players: Map<string, Player>): void {
    players.forEach((playerState: Player, sessionId: string) => {
      const playerBody = this.playerPhysicBodies.get(sessionId);
      if (!playerBody) return;

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

      playerState.isGrounded = this.isBodyGrounded(playerBody);

      this.syncPlayerStateWithPlayerBody(playerState, playerBody);
    });
  }

  handleMovement(
    sessionId: string,
    payload: { left?: boolean; right?: boolean; jump?: boolean }
  ): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (!playerBody) return;

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
      Body.setVelocity(playerBody, {
        x: 0,
        y: playerBody.velocity.y,
      });
    }
  }

  handleJump(sessionId: string, playerState: Player): void {
    const playerBody = this.playerPhysicBodies.get(sessionId);
    if (!playerBody || !playerState.isGrounded) return;

    Body.setVelocity(playerBody, {
      x: playerBody.velocity.x,
      y: -CHARACTER.MOVEMENT.AIR.SPEED,
    });

    playerState.isGrounded = false;
  }

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

  private syncPlayerStateWithPlayerBody(playerState: Player, playerBody: Body): void {
    playerState.x = playerBody.position.x;
    playerState.y = playerBody.position.y;
  }

  static generateSpawnPosition(): { x: number; y: number } {
    const mapWidth = SCENE.WIDTH;
    return {
      x: Math.random() * (mapWidth - CHARACTER.CONFIG.WIDTH),
      y: 100,
    };
  }
}
