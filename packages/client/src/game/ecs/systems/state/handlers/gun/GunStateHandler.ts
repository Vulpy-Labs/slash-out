import { ENTITY_TYPES, GUN_STATE } from '@/config/constants';
import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { IEntityStateHandler } from '../types.i';
import { GunStateHandlerUpdateProp, ValidGunEntity } from './types.p';

class GunStateHandler implements IEntityStateHandler {
  update({ entity }: GunStateHandlerUpdateProp): void {
    if (!this.isValidGun(entity)) return;

    const { state, input } = entity;

    this.updateAttackLockState({ state, input });
    this.resolveGunState({ state, input });
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
      state.shouldPosition = true;
      state.isAttackSpamming = true;
    }
  }

  private isValidGun(entity: GlobalEntity): entity is ValidGunEntity {
    return !!entity.input && !!entity.state && entity.entityType === ENTITY_TYPES.GUN;
  }
}

export { GunStateHandler };
