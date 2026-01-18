import { InputComponent } from './types.i';

function defaultInput(): InputComponent {
  return {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    sword: false,
    gun: false,
  };
}

export { defaultInput };
