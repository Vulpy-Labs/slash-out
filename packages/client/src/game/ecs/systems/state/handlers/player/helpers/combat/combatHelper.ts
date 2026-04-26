import { CHARACTER_STATE } from '@/config/constants';
import { CombatHelperResolveProp, CombatHelperResolveResult } from './types.p';

function resolveCombat({ input }: CombatHelperResolveProp): CombatHelperResolveResult | null {
  if (input.sword) {
    if (input.up) return { characterState: CHARACTER_STATE.SHORT_ATTACK_UP };
    if (input.down) return { characterState: CHARACTER_STATE.SHORT_ATTACK_DOWN };
    return { characterState: CHARACTER_STATE.SHORT_ATTACK_FORWARD };
  }

  if (input.gun) {
    if (input.up) return { characterState: CHARACTER_STATE.LONG_ATTACK_UP };
    if (input.down) return { characterState: CHARACTER_STATE.LONG_ATTACK_DOWN };
    return { characterState: CHARACTER_STATE.LONG_ATTACK_FORWARD };
  }

  if (input.dash) {
    return { characterState: CHARACTER_STATE.SLICE };
  }

  return null;
}

export { resolveCombat };
