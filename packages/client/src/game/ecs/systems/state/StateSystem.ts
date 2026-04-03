import { ALIVE_STATE } from '@/config/constants';
import { StateSystemProp, StateSystemUpdateProp, StateSystemIsPlayerAliveProp } from './types.p';
import { DeadHandler } from './handlers';

class StateSystem {
  private deadHandler: DeadHandler;

  constructor({ scene }: StateSystemProp) {
    if (!scene) throw new Error('scene parameter is missing or invalid');
  constructor() {
    this.deadHandler = new DeadHandler();
  }

  update({ entities }: StateSystemUpdateProp) {
    entities.forEach(({ state, input, animation, sprite }) => {
      if (!state || !input || !animation || !sprite?.body) return;

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
