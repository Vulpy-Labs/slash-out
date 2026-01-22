import { MovementSystemProp, MovementSystemUpdateProp } from './types.p';

class MovementSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: MovementSystemProp) {
    this.scene = scene;
  }

  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement, velocity }) => {
      if (!input || !movement || !velocity) return;

      const wantsToMoveHorizontally = input.left || input.right;
      const wantsToMoveVertically = input.jump;

      if (wantsToMoveHorizontally) {
        if (input.left) velocity.vx = -movement.ground.speed;
        if (input.right) velocity.vx = movement.ground.speed;
      } else {
        velocity.vx = 0;
      }

      if (wantsToMoveVertically) velocity.vy = movement.air.speed;
      else {
        velocity.vy = 0;
      }
    });
  }
}

export { MovementSystem };
