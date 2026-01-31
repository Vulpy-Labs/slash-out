import { KeymapComponent } from '@/ecs/components';
import { DefaultKeymapProp } from './type.p';
import { PossibleActions, POSSIBLE_ACTIONS } from '@/config/constants';

const defaultListeners = () => {
  return POSSIBLE_ACTIONS.reduce(
    (obj, actionString) => {
      obj[actionString as PossibleActions] = null;

      return obj;
    },
    {} as KeymapComponent['listeners']
  );
};

const defaultKeymapP1 = (): KeymapComponent => ({
  codes: {
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
    jump: 'K',
    dash: 'L',
    sword: 'J',
    gun: 'I',
  },
  listeners: defaultListeners(),
});

const defaultKeymapP2 = (): KeymapComponent => ({
  codes: {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    jump: 'NUMPAD_ONE',
    dash: 'NUMPAD_TWO',
    sword: 'NUMPAD_THREE',
    gun: 'NUMPAD_FOUR',
  },
  listeners: defaultListeners(),
});

const defaultKeymap = ({ player }: DefaultKeymapProp) => {
  if (player === '02') return defaultKeymapP2();

  return defaultKeymapP1();
};

export { defaultKeymap, defaultKeymapP1, defaultKeymapP2 };
