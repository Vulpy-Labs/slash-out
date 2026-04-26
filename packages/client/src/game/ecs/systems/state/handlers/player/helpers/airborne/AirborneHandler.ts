import { CHARACTER_STATE } from '@/config/constants';
import { AirborneHandlerResolveProp } from './types.p';

class AirborneHandler {
  resolve({ state }: AirborneHandlerResolveProp): void {
    state.current = CHARACTER_STATE.JUMP;
  }
}

export { AirborneHandler };
