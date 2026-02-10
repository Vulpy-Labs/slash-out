import { MovementSystemProp, MovementSystemUpdateProp } from './types.p';

class MovementSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: MovementSystemProp) {
    this.scene = scene;
  }

  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement, character }) => {
      if (!input || !movement || !character?.sprite?.body) return;

      const wantsToMoveHorizontally = input.left || input.right;
      const wantsToJump = input.jump;

      let vx = 0;
      let vy = character.sprite.body.velocity.y;

      if (wantsToMoveHorizontally) {
        if (input.left) {
          vx = -movement.ground.speed;
          character.sprite.setFlipX(true);
        }
        if (input.right) {
          vx = movement.ground.speed;
          character.sprite.setFlipX(false);
        }
      }

      if (wantsToJump) {
        vy = -movement.air.speed;
      }

      this.scene.matter.body.setVelocity(character.sprite.body as MatterJS.BodyType, {
        x: vx,
        y: vy,
      });
    });
  }
}

export { MovementSystem };
