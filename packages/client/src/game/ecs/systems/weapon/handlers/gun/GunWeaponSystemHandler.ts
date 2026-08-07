import { BULLET, CHARACTER_STATE, DEPTH, ENTITY_TYPES, GUN_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { IWeaponSystemHandler } from '../types.i';
import { GunWeaponSystemHandlerUpdateProp, ValidGunWeaponEntity } from './types.p';

class GunWeaponSystemHandler implements IWeaponSystemHandler {
  private readonly transformTarget: {
    offsetX: number;
    offsetY: number;
    angle: number;
    moveX: 0 | 1 | -1;
    moveY: 0 | 1 | -1;
  } = {
    offsetX: 0,
    offsetY: 0,
    angle: 0,
    moveX: 0,
    moveY: 0,
  };

  update({ entity, entities }: GunWeaponSystemHandlerUpdateProp): void {
    if (!this.isValidGun(entity)) return;

    if (entity.state.current === GUN_STATE.FIRING) {
      this.fireBullet({ entity, entities });
    }
  }

  private fireBullet({
    entity,
    entities,
  }: {
    entity: ValidGunWeaponEntity;
    entities?: GunWeaponSystemHandlerUpdateProp['entities'];
  }): void {
    if (!entities) return;

    const ownerId = entity.ownerEntityId;
    if (!ownerId) return;

    const owner = entities.get(ownerId);
    if (!owner?.sprite) return;

    const isFlipped = owner.animation?.flipX ?? owner.sprite.flipX;
    this.populateFireTransform({
      ownerState: owner.state?.current,
      ownerInput: owner.input,
      isFlipped,
    });

    const { sprite } = entity;
    sprite.setPosition(
      owner.sprite.x + this.transformTarget.offsetX,
      owner.sprite.y + this.transformTarget.offsetY
    );
    sprite.setFlipX(isFlipped);
    sprite.setAngle(this.transformTarget.angle);
    sprite.setVisible(true);
    sprite.setDepth(DEPTH.ENTITIES + 1);

    if (entity.movement) {
      entity.movement.intent.moveX = this.transformTarget.moveX;
      entity.movement.intent.moveY = this.transformTarget.moveY;
    }

    entity.state.current = GUN_STATE.IN_FLIGHT;
  }

  private populateFireTransform({
    ownerState,
    ownerInput,
    isFlipped,
  }: {
    ownerState?: string;
    ownerInput?: GlobalEntity['input'];
    isFlipped: boolean;
  }): void {
    const isUp = ownerState === CHARACTER_STATE.LONG_ATTACK_UP || !!ownerInput?.up;
    const isDown = ownerState === CHARACTER_STATE.LONG_ATTACK_DOWN || !!ownerInput?.down;

    if (isUp) {
      this.transformTarget.offsetX = 0;
      this.transformTarget.offsetY = -BULLET.CONFIG.OFFSET;
      this.transformTarget.angle = isFlipped ? 90 : -90;
      this.transformTarget.moveX = 0;
      this.transformTarget.moveY = -1;
      return;
    }

    if (isDown) {
      this.transformTarget.offsetX = 0;
      this.transformTarget.offsetY = BULLET.CONFIG.OFFSET;
      this.transformTarget.angle = isFlipped ? -90 : 90;
      this.transformTarget.moveX = 0;
      this.transformTarget.moveY = 1;
      return;
    }

    if (isFlipped) {
      this.transformTarget.offsetX = -BULLET.CONFIG.OFFSET;
      this.transformTarget.offsetY = 0;
      this.transformTarget.angle = 0;
      this.transformTarget.moveX = -1;
      this.transformTarget.moveY = 0;
      return;
    }

    this.transformTarget.offsetX = BULLET.CONFIG.OFFSET;
    this.transformTarget.offsetY = 0;
    this.transformTarget.angle = 0;
    this.transformTarget.moveX = 1;
    this.transformTarget.moveY = 0;
  }

  private isValidGun(entity: GlobalEntity): entity is ValidGunWeaponEntity {
    return !!entity.state && !!entity.sprite && entity.entityType === ENTITY_TYPES.GUN;
  }
}

export { GunWeaponSystemHandler };
