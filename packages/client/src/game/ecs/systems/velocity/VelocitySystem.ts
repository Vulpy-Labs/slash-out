import { MovementComponent } from '@/ecs/components';
import { VelocitySystemProp, VelocitySystemUpdateProp } from './types.p';

class VelocitySystem {
  private readonly scene: Phaser.Scene;

  constructor({ scene }: VelocitySystemProp) {
    this.scene = scene;
  }

  update({ entities }: VelocitySystemUpdateProp) {
    entities.forEach(({ animation, movement, sprite }) => {
      if (!movement || !sprite?.body) return;

      const body = sprite.body as MatterJS.BodyType;
      let vx = 0;
      let vy = 0;

      if (movement.externalForce) {
        vx = movement.externalForce.x;
        vy = movement.externalForce.y;
        this.applyExternalForceDecay({ movement });
      } else {
        vx = this.resolveHorizontalVelocity({ movement });
        vy = this.resolveVerticalVelocity({ body, movement });
      }

      if (animation && movement.intent.moveX) {
        animation.flipX = movement.intent.moveX < 0;
      }

      this.scene.matter.body.setVelocity(body, {
        x: vx,
        y: vy,
      });
    });
  }

  private resolveHorizontalVelocity({ movement }: { movement: MovementComponent }): number {
    return movement.intent.moveX * movement.ground.speed;
  }

  private resolveVerticalVelocity({
    body,
    movement,
  }: {
    body: MatterJS.BodyType;
    movement: MovementComponent;
  }): number {
    if (movement.intent.moveY) {
      return movement.intent.moveY * movement.air.speed;
    }

    if (body.ignoreGravity) {
      return 0;
    }

    return body.velocity.y;
  }

  private applyExternalForceDecay({ movement }: { movement: MovementComponent }): void {
    if (!movement.externalForce) return;

    movement.externalForce.x *= 0.85;
    movement.externalForce.y *= 0.85;

    if (Math.abs(movement.externalForce.x) < 0.5 && Math.abs(movement.externalForce.y) < 0.5) {
      movement.externalForce = undefined;
    }
  }
}

export { VelocitySystem };
