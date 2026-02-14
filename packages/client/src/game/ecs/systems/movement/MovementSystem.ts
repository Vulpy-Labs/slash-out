import { MovementSystemProp, MovementSystemUpdateProp } from './types.p';

class MovementSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: MovementSystemProp) {
    this.scene = scene;
  }

  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement, sprite }) => {
      if (!input || !movement || !sprite?.body) return;

      const wantsToMoveHorizontally = input.left || input.right;
      const wantsToJump = input.jump;

      let vx = 0;
      let vy = sprite.body.velocity.y;

      if (wantsToMoveHorizontally) {
        if (input.left) {
          vx = -movement.ground.speed;
          sprite.setFlipX(true);
        }
        if (input.right) {
          vx = movement.ground.speed;
          sprite.setFlipX(false);
        }
      }

      if (wantsToJump) {
        vy = -movement.air.speed;
      }

      this.scene.matter.body.setVelocity(sprite.body as MatterJS.BodyType, {
        x: vx,
        y: vy,
      });
    });
  }
}

export { MovementSystem };
