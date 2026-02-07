import { MovementSystemProp, MovementSystemUpdateProp } from './types.p';

class MovementSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: MovementSystemProp) {
    this.scene = scene;
  }

  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement, animation, character }) => {
      if (!input || !movement || !character?.sprite?.body) return;

      const wantsToMoveHorizontally = input.left || input.right;
      const wantsToJump = input.jump;

      let vx = 0;
      let vy = character.sprite.body.velocity.y;

      if (wantsToMoveHorizontally) {
        if (input.left) {
          vx = -movement.ground.speed;
        }
        if (input.right) {
          vx = movement.ground.speed;
        }
      }

      if (wantsToJump) {
        vy = -movement.air.speed;
      }

      if (animation) {
        animation.flipX = input.left || (!input.right && animation.flipX);
      }

      this.scene.matter.body.setVelocity(character.sprite.body as MatterJS.BodyType, {
        x: vx,
        y: vy,
      });
    });
  }
}

export { MovementSystem };
