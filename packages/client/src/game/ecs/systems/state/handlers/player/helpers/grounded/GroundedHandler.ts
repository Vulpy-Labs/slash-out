import { CHARACTER_STATE } from '@/config/constants';
import { GroundedHandlerResolveProp } from './types.p';

class GroundedHandler {
  resolve({ state, input }: GroundedHandlerResolveProp): void {
    if (input.left || input.right) {
      state.current = CHARACTER_STATE.RUN;
      return;
    }

    if (input.up) {
      state.current = CHARACTER_STATE.LOOK_UP;
      return;
    }

    if (input.down) {
      state.current = CHARACTER_STATE.LOOK_DOWN;
      return;
    }

    state.current = CHARACTER_STATE.IDLE;
  }
}

export { GroundedHandler };
