import { CHARACTER_STATE } from '@/config/constants';
import { resolveCombat } from '../combat';
import { AirborneHandlerResolveProp } from './types.p';

class AirborneHandler {
  resolve({ state, input }: AirborneHandlerResolveProp): void {
    const combat = resolveCombat({ input });

    if (combat) {
      state.characterState = combat.characterState;
      return;
    }

    state.characterState = CHARACTER_STATE.JUMP;
  }
}

export { AirborneHandler };
