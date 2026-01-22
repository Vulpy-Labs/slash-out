import { possibleActions } from '@/config/constants';
import { InputComponent } from '@/ecs/components';

function defaultInput(): InputComponent {
  return possibleActions.reduce((defaultInput, actionString) => {
    defaultInput[actionString] = false;

    return defaultInput;
  }, {} as InputComponent);
}

export { defaultInput };
