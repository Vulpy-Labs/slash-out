import { CHARACTER_STATE } from '@/config/constants';
import { resolveCombat } from '../combat';
import { AirborneHandlerResolveProp } from './types.p';

class AirborneHandler {
  resolve({ state, input }: AirborneHandlerResolveProp): void {
    const combat = resolveCombat({ input });

    if (combat) {
      state.current = combat.characterState;
      return;
    }

    state.current = CHARACTER_STATE.JUMP;
  }
}

export { AirborneHandler };
