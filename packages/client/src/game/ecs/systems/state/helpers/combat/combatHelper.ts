import { INPUT_ACTION } from '@/config/constants';
import { CombatHelperResolveProp, CombatHelperResolveResult } from './types.p';

function resolveCombat({ input }: CombatHelperResolveProp): CombatHelperResolveResult | null {
  const ATTACK_MAPPING = {
    // as an external constant to avoid hardcoding the logic
    sword: {
      up: INPUT_ACTION.SHORT_ATTACK_UP,
      down: INPUT_ACTION.SHORT_ATTACK_DOWN,
      forward: INPUT_ACTION.SHORT_ATTACK_FORWARD,
    },
    gun: {
      up: INPUT_ACTION.LONG_ATTACK_UP,
      down: INPUT_ACTION.LONG_ATTACK_DOWN,
      forward: INPUT_ACTION.LONG_ATTACK_FORWARD,
    },
  };

  const shortAttack = input.sword ? 'sword' : null;
  const longAttack = input.gun ? 'gun' : null;
  const weapon = shortAttack || longAttack;

  if (weapon) {
    const upDirection = input.up ? 'up' : null;
    const downDirection = input.down ? 'down' : null;
    const direction = upDirection || downDirection || 'forward';
    const action = ATTACK_MAPPING[weapon][direction];

    return {
      inputAction: action,
      characterState: action,
    };
  }

  return null;
}

export { resolveCombat };
