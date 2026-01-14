import { InputComponent } from './type.i';
import { CreateInputComponentProp } from './type.p';

export function createInputComponent({ entityId }: CreateInputComponentProp): InputComponent {
  return {
    entityId,
    left: false,
    rigth: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    sword: false,
    gun: false,
  };
}
