import { ENTITY_TYPES, SWORD, SWORD_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { decrementStateTicker, isTickerActive } from '@/utils/state';
import { IEntityStateHandler } from '../types.i';
import { SwordStateHandlerUpdateProp, ValidSwordEntity } from './types.p';

class SwordStateHandler implements IEntityStateHandler {
  update({ entity }: SwordStateHandlerUpdateProp): void {
    if (!this.isValidSword(entity)) return;

    const { state, input } = entity;

    if (isTickerActive({ state })) {
      decrementStateTicker({ state });
      return;
    }

    if (input.sword) {
      if (state.current !== SWORD_STATE.SLASHING) {
        state.current = SWORD_STATE.SLASHING;
        state.ticker = SWORD.ATTACK.DURATION_TICKS;
      }
    } else {
      state.current = SWORD_STATE.IDLE;
    }
  }

  private isValidSword(entity: GlobalEntity): entity is ValidSwordEntity {
    return !!entity.input && !!entity.state && entity.entityType === ENTITY_TYPES.SWORD;
  }
}

export { SwordStateHandler };
