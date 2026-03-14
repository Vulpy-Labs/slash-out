import { INPUT_ACTION, ALIVE_STATE, CHARACTER_STATE, MOBILITY } from '@/config/constants';
import { StateComponent } from '@/ecs/components';

function defaultState(): StateComponent {
  return {
    characterState: CHARACTER_STATE.IDLE,
    mobility: MOBILITY.GROUNDED,
    inputAction: INPUT_ACTION.NONE,
    aliveState: ALIVE_STATE.ALIVE,
  };
}

export { defaultState };
