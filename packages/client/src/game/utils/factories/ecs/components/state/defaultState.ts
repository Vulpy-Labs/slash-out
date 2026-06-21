import { CHARACTER_STATE, SWORD_STATES } from '@/config/constants';
import { StateComponent } from '@/ecs/components';
import { defaultStateProp } from './types.p';


// Todo: () => create prop type here
function defaultState({ entityType }: defaultStateProp): StateComponent {
  const entityTypesDefaultStates = {
    PLAYER: CHARACTER_STATE.IDLE,
    SWORD: SWORD_STATES.IDLE,
  }

  return {
    current: entityTypesDefaultStates[entityType],
  };
}

export { defaultState };
