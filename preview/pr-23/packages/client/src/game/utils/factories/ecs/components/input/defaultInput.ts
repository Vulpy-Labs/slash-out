import { POSSIBLE_ACTIONS } from '@/config/constants';
import { InputComponent } from '@/ecs/components';

function defaultInput(): InputComponent {
  return POSSIBLE_ACTIONS.reduce((defaultInput, actionString) => {
    defaultInput[actionString] = false;

    return defaultInput;
  }, {} as InputComponent);
}

export { defaultInput };
