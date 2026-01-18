import { KeymapComponent } from './types.i';

const defaultKeymapP1 = (): KeymapComponent => ({
  up: 'W',
  down: 'S',
  left: 'A',
  right: 'D',
  jump: 'K',
  dash: 'L',
  sword: 'J',
  gun: 'I',
});

const defaultKeymapP2 = (): KeymapComponent => ({
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
  jump: 'NUMPAD_ONE',
  dash: 'NUMPAD_TWO',
  sword: 'NUMPAD_THREE',
  gun: 'NUMPAD_FOUR',
});

export { defaultKeymapP1, defaultKeymapP2 };
