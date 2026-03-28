import { MovementSystemUpdateProp } from './types.p';
import { ALIVE_STATE } from '@/config/constants';

class MovementSystem {
  update({ entities }: MovementSystemUpdateProp) {
    entities.forEach(({ input, movement, state }) => {
      if (!input || !movement || !state || state.aliveState !== ALIVE_STATE.ALIVE) return;

      movement.intent.moveX = 0;
      movement.intent.moveY = 0;

      if (input.jump) movement.intent.moveY = -1;
      if (input.left) movement.intent.moveX = -1;
      if (input.right) movement.intent.moveX = 1;
    });
  }
}

export { MovementSystem };
