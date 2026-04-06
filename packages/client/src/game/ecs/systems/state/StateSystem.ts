import { ALIVE_STATE } from '@/config/constants';
import { StateSystemUpdateProp, StateSystemIsPlayerAliveProp } from './types.p';
import { DeadHandler } from './handlers';

class StateSystem {
  private deadHandler: DeadHandler;

  constructor() {
    this.deadHandler = new DeadHandler();
  }

  update({ entities }: StateSystemUpdateProp) {
    entities.forEach(({ state, input }) => {
      if (!state || !input) return;

      if (!this.isPlayerAlive({ state })) {
        this.deadHandler.resolve({ state });
        return;
      }
    });
  }

  private isPlayerAlive({ state }: StateSystemIsPlayerAliveProp) {
    return state.aliveState === ALIVE_STATE.ALIVE;
  }
}

export { StateSystem };
