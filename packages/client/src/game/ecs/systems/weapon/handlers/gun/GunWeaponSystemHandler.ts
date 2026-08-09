import { BULLET, CHARACTER_STATE, DEPTH, ENTITY_TYPES, GUN_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { IWeaponSystemHandler } from '../types.i';
import { GunWeaponSystemHandlerUpdateProp, ValidGunWeaponEntity } from './types.p';

class GunWeaponSystemHandler implements IWeaponSystemHandler {
  private readonly transformTarget = { offsetX: 0, offsetY: 0, angle: 0 };

  update({ entity, entities }: GunWeaponSystemHandlerUpdateProp): void {
    if (!this.isValidGun(entity)) return;

    if (entity.state.current === GUN_STATE.FIRING) {
      this.showAndPositionGun({ entity, entities });
    } else {
      this.hideGun({ entity });
    }
  }

  private showAndPositionGun({
    entity,
    entities,
  }: {
    entity: ValidGunWeaponEntity;
    entities?: GunWeaponSystemHandlerUpdateProp['entities'];
  }): void {
    const { sprite } = entity;

    if (sprite.visible) return;

    sprite.setVisible(true);
    sprite.setDepth(DEPTH.ENTITIES + 1);

    if (!entities) return;

    const ownerId = entity.ownerEntityId;
    if (!ownerId) return;

    const owner = entities.get(ownerId);

    if (owner?.sprite) {
      this.updateTransform({ gun: entity, owner });
    }
  }

  private updateTransform({
    gun,
    owner,
  }: {
    gun: ValidGunWeaponEntity;
    owner: GlobalEntity;
  }): void {
    if (!owner.sprite) return;

    const isFlipped = owner.animation?.flipX ?? owner.sprite.flipX;
    this.populateOffsetAndAngle({
      ownerState: owner.state?.current,
      ownerInput: owner.input,
      isFlipped,
    });

    gun.sprite.setPosition(
      owner.sprite.x + this.transformTarget.offsetX,
      owner.sprite.y + this.transformTarget.offsetY
    );
    gun.sprite.setFlipX(isFlipped);
    gun.sprite.setAngle(this.transformTarget.angle);
  }

  private populateOffsetAndAngle({
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
      return;
    }

    if (isDown) {
      this.transformTarget.offsetX = 0;
      this.transformTarget.offsetY = BULLET.CONFIG.OFFSET;
      this.transformTarget.angle = isFlipped ? -90 : 90;
      return;
    }

    this.transformTarget.offsetX = isFlipped ? -BULLET.CONFIG.OFFSET : BULLET.CONFIG.OFFSET;
    this.transformTarget.offsetY = 0;
    this.transformTarget.angle = 0;
  }

  private hideGun({ entity }: { entity: ValidGunWeaponEntity }): void {
    const { sprite } = entity;

    sprite.setVisible(false);
    sprite.setDepth(DEPTH.ENTITIES);
    sprite.setAngle(0);
    sprite.setPosition(-9999, -9999);
  }

  private isValidGun(entity: GlobalEntity): entity is ValidGunWeaponEntity {
    return !!entity.state && !!entity.sprite && entity.entityType === ENTITY_TYPES.GUN;
  }
}

export { GunWeaponSystemHandler };
