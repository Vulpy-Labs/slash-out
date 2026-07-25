import { CHARACTER_STATE, DEPTH, ENTITY_TYPES, SWORD, SWORD_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { IWeaponSystemHandler } from '../types.i';
import { SwordWeaponSystemHandlerUpdateProp, ValidSwordWeaponEntity } from './types.p';

class SwordWeaponSystemHandler implements IWeaponSystemHandler {
  update({ entity, entities }: SwordWeaponSystemHandlerUpdateProp): void {
    if (!this.isValidSword(entity)) return;

    if (entity.state.current === SWORD_STATE.SLASHING) {
      this.showAndPositionSword({ entity, entities });
    } else {
      this.hideSword({ entity });
    }
  }

  private showAndPositionSword({
    entity,
    entities,
  }: {
    entity: ValidSwordWeaponEntity;
    entities?: SwordWeaponSystemHandlerUpdateProp['entities'];
  }): void {
    const { sprite } = entity;

    sprite.setVisible(true);
    sprite.setDepth(DEPTH.ENTITIES + 1);

    if (!entities) return;

    const ownerId = entity.entityId.replace('sword_', '');
    const owner = entities.get(ownerId);

    if (owner?.sprite) {
      this.updateTransform({ sword: entity, owner });
    }
  }

  private updateTransform({
    sword,
    owner,
  }: {
    sword: ValidSwordWeaponEntity;
    owner: GlobalEntity;
  }): void {
    if (!owner.sprite) return;

    const isFlipped = owner.animation?.flipX ?? owner.sprite.flipX;
    const { offsetX, offsetY, angle } = this.calculateOffsetAndAngle({
      ownerState: owner.state?.current,
      ownerInput: owner.input,
      isFlipped,
    });

    sword.sprite.setPosition(owner.sprite.x + offsetX, owner.sprite.y + offsetY);
    sword.sprite.setFlipX(isFlipped);
    sword.sprite.setAngle(angle);

    if (sword.animation) {
      sword.animation.flipX = isFlipped;
    }
  }

  private calculateOffsetAndAngle({
    ownerState,
    ownerInput,
    isFlipped,
  }: {
    ownerState?: string;
    ownerInput?: GlobalEntity['input'];
    isFlipped: boolean;
  }): { offsetX: number; offsetY: number; angle: number } {
    const isUp = ownerState === CHARACTER_STATE.SHORT_ATTACK_UP || !!ownerInput?.up;
    const isDown = ownerState === CHARACTER_STATE.SHORT_ATTACK_DOWN || !!ownerInput?.down;

    if (isUp) {
      return {
        offsetX: 0,
        offsetY: -SWORD.CONFIG.OFFSET,
        angle: isFlipped ? 90 : -90,
      };
    }

    if (isDown) {
      return {
        offsetX: 0,
        offsetY: SWORD.CONFIG.OFFSET,
        angle: isFlipped ? -90 : 90,
      };
    }

    return {
      offsetX: isFlipped ? -SWORD.CONFIG.OFFSET : SWORD.CONFIG.OFFSET,
      offsetY: 0,
      angle: 0,
    };
  }

  private hideSword({ entity }: { entity: ValidSwordWeaponEntity }): void {
    const { sprite } = entity;

    sprite.setVisible(false);
    sprite.setDepth(DEPTH.ENTITIES);
    sprite.setAngle(0);
    sprite.setPosition(-9999, -9999);
  }

  private isValidSword(entity: GlobalEntity): entity is ValidSwordWeaponEntity {
    return !!entity.state && !!entity.sprite && entity.entityType === ENTITY_TYPES.SWORD;
  }
}

export { SwordWeaponSystemHandler };
