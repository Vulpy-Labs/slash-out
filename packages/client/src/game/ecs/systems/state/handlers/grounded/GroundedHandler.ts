import { INPUT_ACTION, CHARACTER_STATE } from '@/config/constants';
import { resolveCombat } from '../../helpers';
import { GroundedHandlerResolveProp } from './types.p';

class GroundedHandler {
  resolve({ state, input }: GroundedHandlerResolveProp): void {
    const combat = resolveCombat({ input });

    if (combat) {
      state.inputAction = combat.inputAction;
      state.characterState = combat.characterState;
      return;
    }

    if (input.dash) {
      state.inputAction = INPUT_ACTION.DASH;
      state.characterState = CHARACTER_STATE.SLICE;
      return;
    }

    if (input.left || input.right) {
      state.inputAction = INPUT_ACTION.RUN;
      state.characterState = CHARACTER_STATE.RUN;
      return;
    }

    if (input.up) {
      state.inputAction = INPUT_ACTION.LOOK_UP;
      state.characterState = CHARACTER_STATE.LOOK_UP;
      return;
    }

    if (input.down) {
      state.inputAction = INPUT_ACTION.LOOK_DOWN;
      state.characterState = CHARACTER_STATE.LOOK_DOWN;
      return;
    }

    state.inputAction = INPUT_ACTION.NONE;
    state.characterState = CHARACTER_STATE.IDLE;
  }
}

export { GroundedHandler };
