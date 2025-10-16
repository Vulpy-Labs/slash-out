import { PhysicsBody } from './PhysicsBody';
import { PHYSICS_CONFIG } from 'shared/config/constants/PhysicsConfig';
import { Platform } from './Platform.type';

export class PhysicsWorld {
  platforms: Platform[] = [];
  worldWidth: number;
  worldHeight: number;

  constructor(platforms: Platform[] = []) {
    this.worldWidth = PHYSICS_CONFIG.WORLD.WIDTH;
    this.worldHeight = PHYSICS_CONFIG.WORLD.HEIGHT;
    this.platforms = platforms;
  }

  updateBody(body: PhysicsBody) {
    const startY = body.y;
    const startVelY = body.velocityY;
    const startGrounded = body.isGrounded;

    // Apply gravity ONLY if not grounded
    if (!body.isGrounded) {
      body.velocityY += PHYSICS_CONFIG.GRAVITY;

      if (body.velocityY > PHYSICS_CONFIG.MAX_FALL_SPEED) {
        body.velocityY = PHYSICS_CONFIG.MAX_FALL_SPEED;
      }
    }
    console.log(
      `\n=== FRAME START === y=${startY.toFixed(2)}, velY=${startVelY.toFixed(
        2
      )}, grounded=${startGrounded}`
    );

    // Update position
    body.x += body.velocityX;
    body.y += body.velocityY;

    console.log(`After move: y=${body.y.toFixed(2)}`);

    // Reset grounded
    body.isGrounded = false;

    // Check collision with ALL platforms
    for (const platform of this.platforms) {
      this.resolvePlatformCollision(body, platform);
    }

    console.log(
      `After collision: y=${body.y.toFixed(2)}, velY=${body.velocityY.toFixed(2)}, grounded=${
        body.isGrounded
      }`
    );

    // World bounds
    if (body.x < 0) {
      body.x = 0;
      body.velocityX = 0;
    }
    if (body.x + body.width > this.worldWidth) {
      body.x = this.worldWidth - body.width;
      body.velocityX = 0;
    }
  }

  private resolvePlatformCollision(body: PhysicsBody, platform: Platform) {
    // Check if bodies overlap OR are touching
    if (
      !(
        body.x < platform.x + platform.width + PHYSICS_CONFIG.WORLD.COLLISIONS.TOUCH_THRESHOLD &&
        body.x + body.width > platform.x - PHYSICS_CONFIG.WORLD.COLLISIONS.TOUCH_THRESHOLD &&
        body.y < platform.y + platform.height + PHYSICS_CONFIG.WORLD.COLLISIONS.TOUCH_THRESHOLD &&
        body.y + body.height > platform.y - PHYSICS_CONFIG.WORLD.COLLISIONS.TOUCH_THRESHOLD
      )
    ) {
      return;
    }

    // Calculate overlaps (can be negative if just touching)
    const overlapLeft = body.x + body.width - platform.x;
    const overlapRight = platform.x + platform.width - body.x;
    const overlapTop = body.y + body.height - platform.y;
    const overlapBottom = platform.y + platform.height - body.y;

    // Find smallest overlap
    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    // If standing on top (overlap between -0.5 and 1.0), stay grounded
    if (
      minOverlap === overlapTop &&
      overlapTop >= -PHYSICS_CONFIG.WORLD.COLLISIONS.TOUCH_THRESHOLD &&
      overlapTop <= 1.0
    ) {
      // Snap to exact position
      body.y = platform.y - body.height;
      body.velocityY = 0;
      body.isGrounded = true;
      return;
    }

    if (
      minOverlap === overlapBottom &&
      overlapBottom >= PHYSICS_CONFIG.WORLD.COLLISIONS.MIN_OVERLAP
    ) {
      body.y = platform.y + platform.height;
      if (body.velocityY < 0) {
        body.velocityY = 0;
      }
    } else if (
      minOverlap === overlapLeft &&
      overlapLeft >= PHYSICS_CONFIG.WORLD.COLLISIONS.MIN_OVERLAP
    ) {
      body.x = platform.x - body.width;
      body.velocityX = 0;
    } else if (
      minOverlap === overlapRight &&
      overlapRight >= PHYSICS_CONFIG.WORLD.COLLISIONS.MIN_OVERLAP
    ) {
      body.x = platform.x + platform.width;
      body.velocityX = 0;
    }
  }
}
