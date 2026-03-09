import { INPUT_ACTION, CHARACTER_STATE } from '@/config/constants';
import { CombatHelperResolveProp, CombatHelperResolveResult } from './types.p';

function resolveCombat({ input }: CombatHelperResolveProp): CombatHelperResolveResult | null {
  if (input.sword) {
    if (input.up)
      return {
        inputAction: INPUT_ACTION.SWORD_UP,
        characterState: CHARACTER_STATE.SHORT_ATTACK_UP,
      };
    if (input.down)
      return {
        inputAction: INPUT_ACTION.SWORD_DOWN,
        characterState: CHARACTER_STATE.SHORT_ATTACK_DOWN,
      };
    return {
      inputAction: INPUT_ACTION.SWORD_FORWARD,
      characterState: CHARACTER_STATE.SHORT_ATTACK_FORWARD,
    };
  }

  if (input.gun) {
    if (input.up)
      return { inputAction: INPUT_ACTION.GUN_UP, characterState: CHARACTER_STATE.LONG_ATTACK_UP };
    if (input.down)
      return {
        inputAction: INPUT_ACTION.GUN_DOWN,
        characterState: CHARACTER_STATE.LONG_ATTACK_DOWN,
      };
    return {
      inputAction: INPUT_ACTION.GUN_FORWARD,
      characterState: CHARACTER_STATE.LONG_ATTACK_FORWARD,
    };
  }

  if (input.dash) {
    return { inputAction: INPUT_ACTION.DASHING, characterState: CHARACTER_STATE.SLICE };
  }

  return null;
}

export { resolveCombat };
