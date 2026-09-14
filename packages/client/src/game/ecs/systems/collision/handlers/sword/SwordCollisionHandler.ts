import { CHARACTER_STATE, ENTITY_TYPES, SWORD, SWORD_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { CollisionHandleProp, ICollisionSystemHandler } from '../types.i';
import { ValidSwordCollisionEntity } from './types.p';

class SwordCollisionHandler implements ICollisionSystemHandler {
  handle({ affected, collider, entities }: CollisionHandleProp): void {
    if (!this.isValidSword(affected)) return;
    if (!this.isValidSword(collider)) return;

    if (affected.ownerEntityId === collider.ownerEntityId) return;

    if (
      affected.state.current === SWORD_STATE.SLASHING &&
      collider.state.current === SWORD_STATE.SLASHING
    ) {
      this.applyRecoilToOwner({ affectedSword: affected, entities });
    }
  }

  private applyRecoilToOwner({
    affectedSword,
    entities,
  }: {
    affectedSword: ValidSwordCollisionEntity;
    entities: CollisionHandleProp['entities'];
  }): void {
    const owner = entities.get(affectedSword.ownerEntityId);
    if (!owner?.movement || !owner.sprite) return;

    const { x, y } = this.resolveKnockbackDirection({ owner });

    const magnitudeX = SWORD.COLLISION.KNOCKBACK_FORCE.X;
    const magnitudeY = SWORD.COLLISION.KNOCKBACK_FORCE.Y;

    owner.movement.externalForce = {
      x: x * magnitudeX,
      y: y !== 0 ? y * magnitudeX : magnitudeY,
    };
  }

  private resolveKnockbackDirection({ owner }: { owner: GlobalEntity }): { x: number; y: number } {
    const isFlipped = owner.animation?.flipX ?? false;
    const ownerState = owner.state?.current;

    const isAttackingUp = ownerState === CHARACTER_STATE.SHORT_ATTACK_UP || !!owner.input?.up;
    const isAttackingDown = ownerState === CHARACTER_STATE.SHORT_ATTACK_DOWN || !!owner.input?.down;

    if (isAttackingUp) {
      return { x: 0, y: 1 };
    }

    if (isAttackingDown) {
      return { x: 0, y: -1 };
    }

    return { x: isFlipped ? 1 : -1, y: 0 };
  }

  private isValidSword(entity: GlobalEntity): entity is ValidSwordCollisionEntity {
    return (
      entity.entityType === ENTITY_TYPES.SWORD &&
      !!entity.state &&
      !!entity.sprite &&
      !!entity.ownerEntityId
    );
  }
}

export { SwordCollisionHandler };
