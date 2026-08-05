import { BULLET, ENTITY_TYPES, GUN_STATE } from '@/config/constants';
import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { decrementStateTicker, isTickerActive } from '@/utils/state';
import { IEntityStateHandler } from '../types.i';
import { GunStateHandlerUpdateProp, ValidGunEntity } from './types.p';

class GunStateHandler implements IEntityStateHandler {
  update({ entity, entities }: GunStateHandlerUpdateProp): void {
    if (!this.isValidGun(entity)) return;

    const { state } = entity;

    if (isTickerActive({ state })) {
      decrementStateTicker({ state });
      return;
    }

    const owner = entity.ownerEntityId && entities ? entities.get(entity.ownerEntityId) : undefined;
    const input = owner?.input;

    this.resetExpiredAttackState({ state });
    if (input) {
      this.updateAttackLockState({ state, input });
      this.resolveGunState({ state, input });
    }
  }

  private resetExpiredAttackState({ state }: { state: StateComponent }): void {
    if (state.current === GUN_STATE.FIRING) {
      state.current = GUN_STATE.IDLE;
    }
  }

  private updateAttackLockState({
    state,
    input,
  }: {
    state: StateComponent;
    input: InputComponent;
  }): void {
    if (!input.gun) {
      state.isAttackSpamming = false;
    }
  }

  private resolveGunState({
    state,
    input,
  }: {
    state: StateComponent;
    input: InputComponent;
  }): void {
    if (input.gun && !state.isAttackSpamming) {
      state.current = GUN_STATE.FIRING;
      state.ticker = BULLET.ATTACK.DURATION_TICKS;
      state.isAttackSpamming = true;
    } else {
      state.current = GUN_STATE.IDLE;
    }
  }

  private isValidGun(entity: GlobalEntity): entity is ValidGunEntity {
    return !!entity.state && entity.entityType === ENTITY_TYPES.GUN;
  }
}

export { GunStateHandler };
