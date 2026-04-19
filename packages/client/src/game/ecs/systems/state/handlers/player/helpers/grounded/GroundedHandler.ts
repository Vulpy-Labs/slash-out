import { CHARACTER_STATE } from '@/config/constants';
import { resolveCombat } from '../combat';
import { GroundedHandlerResolveProp } from './types.p';

class GroundedHandler {
  resolve({ state, input }: GroundedHandlerResolveProp): void {
    const combat = resolveCombat({ input });

    if (combat) {
      state.characterState = combat.characterState;
      return;
    }

    if (input.left || input.right) {
      state.characterState = CHARACTER_STATE.RUN;
      return;
    }

    if (input.up) {
      state.characterState = CHARACTER_STATE.LOOK_UP;
      return;
    }

    if (input.down) {
      state.characterState = CHARACTER_STATE.LOOK_DOWN;
      return;
    }

    state.characterState = CHARACTER_STATE.IDLE;
  }
}

export { GroundedHandler };
