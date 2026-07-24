import { CHARACTER_COMBAT, CHARACTER_STATE, MOBILITY } from '@/config/constants';
import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { getMobility } from '@/utils/physics';
import { decrementStateTicker, isTickerActive } from '@/utils/state';
import { GroundedHandler, AirborneHandler } from './helpers';

import { IEntityStateHandler } from '../types.i';
import { PlayerStateHandlerUpdateProp, ValidPlayerEntity } from './types.p';

class PlayerStateHandler implements IEntityStateHandler {
  private groundedHandler: GroundedHandler;
  private airborneHandler: AirborneHandler;

  constructor() {
    this.groundedHandler = new GroundedHandler();
    this.airborneHandler = new AirborneHandler();
  }

  update({ entity }: PlayerStateHandlerUpdateProp): void {
    if (!this.isValidPlayer(entity)) return;

    const { state, input, sprite } = entity;

    if (isTickerActive({ state })) {
      decrementStateTicker({ state });
      return;
    }

    this.resetExpiredAttackState({ state });
    this.updateAttackLockState({ state, input });

    const effectiveInput = this.getEffectiveInput({ state, input });

    this.resolvePlayerMobilityState({ state, sprite, input: effectiveInput });
  }

  private resetExpiredAttackState({ state }: { state: StateComponent }): void {
    const isAttackingState =
      state.current === CHARACTER_STATE.SHORT_ATTACK_FORWARD ||
      state.current === CHARACTER_STATE.SHORT_ATTACK_UP ||
      state.current === CHARACTER_STATE.SHORT_ATTACK_DOWN;

    if (isAttackingState) {
      state.current = CHARACTER_STATE.IDLE;
    }
  }

  private updateAttackLockState({
    state,
    input,
  }: {
    state: StateComponent;
    input: InputComponent;
  }): void {
    if (!input.sword) {
      state.isAttackSpamming = false;
    }

    if (input.sword && !state.isAttackSpamming) {
      state.ticker = CHARACTER_COMBAT.ATTACK.DURATION_TICKS;
      state.isAttackSpamming = true;
    }
  }

  private getEffectiveInput({
    state,
    input,
  }: {
    state: StateComponent;
    input: InputComponent;
  }): InputComponent {
    if (state.isAttackSpamming && !isTickerActive({ state })) {
      return { ...input, sword: false };
    }
    return input;
  }

  private resolvePlayerMobilityState({
    state,
    sprite,
    input,
  }: {
    state: StateComponent;
    sprite: Phaser.Physics.Matter.Sprite;
    input: InputComponent;
  }): void {
    const mobility = getMobility(sprite);

    if (mobility === MOBILITY.GROUNDED) {
      this.groundedHandler.resolve({ state, input });
    } else if (mobility === MOBILITY.AIRBORNE) {
      this.airborneHandler.resolve({ state, input });
    }
  }

  private isValidPlayer(entity: GlobalEntity): entity is ValidPlayerEntity {
    return !!entity.input && !!entity.state && !!entity.sprite;
  }
}

export { PlayerStateHandler };
