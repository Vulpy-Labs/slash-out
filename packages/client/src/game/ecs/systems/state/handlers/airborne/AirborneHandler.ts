import { INPUT_ACTION, CHARACTER_STATE } from '@/config/constants';
import { resolveCombat } from '../../helpers';
import { AirborneHandlerResolveProp } from './types.p';

class AirborneHandler {
  resolve({ state, input }: AirborneHandlerResolveProp): void {
    const combat = resolveCombat({ input });

    if (combat) {
      state.inputAction = combat.inputAction;
      state.characterState = combat.characterState;
      return;
    }

    state.inputAction = INPUT_ACTION.NONE;
    state.characterState = CHARACTER_STATE.JUMP;
  }
}

export { AirborneHandler };
