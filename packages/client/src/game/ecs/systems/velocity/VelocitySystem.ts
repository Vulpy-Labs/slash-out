import { VelocitySystemProp, VelocitySystemUpdateProp } from './types.p';

class VelocitySystem {
  private readonly scene: Phaser.Scene;

  constructor({ scene }: VelocitySystemProp) {
    this.scene = scene;
  }

  update({ entities }: VelocitySystemUpdateProp) {
    entities.forEach(({ movement, sprite, animation }) => {
      if (!movement || !sprite?.body) return;

      let vy = sprite.body.velocity.y;
      const vx = movement.intent.moveX * movement.ground.speed;

      if (movement.intent.moveY) {
        vy = movement.intent.moveY * movement.air.speed;
      }

      if (animation && movement.intent.moveX) {
        animation.flipX = movement.intent.moveX < 0;
      }

      this.scene.matter.body.setVelocity(sprite.body as MatterJS.BodyType, {
        x: vx,
        y: vy,
      });
    });
  }
}

export { VelocitySystem };
