import { CHARACTER_STATE } from '@/config/constants';
import { StateComponent } from '@/ecs/components';

function defaultState(): StateComponent {
  return {
    current: CHARACTER_STATE.IDLE,
  };
}

export { defaultState };
