import { PhysicsBody } from './PhysicsBody';
import { PhysicsConfig } from './PhysicsConfig';

export class PhysicsWorld {
  groundY: number;
  worldWidth: number;

  constructor() {
    this.groundY = 220; // Ground level
    this.worldWidth = PhysicsConfig.world.width;
  }

  /**
   * Update physics for one frame
   */
  updateBody(body: PhysicsBody) {
    // Apply gravity
    if (!body.isGrounded) {
      body.velocityY += PhysicsConfig.gravity;

      // Cap fall speed
      if (body.velocityY > PhysicsConfig.maxFallSpeed) {
        body.velocityY = PhysicsConfig.maxFallSpeed;
      }
    }

    // Update position
    body.x += body.velocityX;
    body.y += body.velocityY;

    // Ground collision
    if (body.y + body.height >= this.groundY) {
      body.y = this.groundY - body.height;
      body.velocityY = 0;
      body.isGrounded = true;
    } else {
      body.isGrounded = false;
    }

    // Keep within world bounds
    if (body.x < 0) {
      body.x = 0;
      body.velocityX = 0;
    }
    if (body.x + body.width > this.worldWidth) {
      body.x = this.worldWidth - body.width;
      body.velocityX = 0;
    }
  }
}
