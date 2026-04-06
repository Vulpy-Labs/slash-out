import { INPUT_ACTION, ALIVE_STATE, CHARACTER_STATE } from '@/config/constants';
import { DeadHandlerResolveProp } from './types.p';

class DeadHandler {
  resolve({ state }: DeadHandlerResolveProp): void {
    state.inputAction = INPUT_ACTION.NONE;

    if (state.aliveState === ALIVE_STATE.DEAD) {
      state.characterState = CHARACTER_STATE.DEAD;
    } else if (state.aliveState === ALIVE_STATE.DEAD_NO_HEAD) {
      state.characterState = CHARACTER_STATE.DEAD_NO_HEAD;
    }
  }
}

export { DeadHandler };
