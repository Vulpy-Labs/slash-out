import { MovementSystemUpdateProp } from './types.p';

class MovementSystem {
  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement }) => {
      if (!input || !movement) return;

      movement.intent.moveX = 0;
      movement.intent.moveY = 0;

      if (input.jump) movement.intent.moveY = -1;
      if (input.left) movement.intent.moveX = -1;
      if (input.right) movement.intent.moveX = 1;
    });
  }
}

export { MovementSystem };
