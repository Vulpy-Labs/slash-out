import { CHARACTER_STATE, ENTITY_TYPES, GUN_STATE, SWORD_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { CollisionHandleProp, ICollisionSystemHandler } from '../types.i';
import {
  GunCollisionDeactivateProp,
  GunCollisionDeflectProp,
  IsActiveSwordProp,
  IsBulletClashProp,
  IsPlayerProp,
  PopulateDeflectDirectionProp,
  ValidGunCollisionEntity,
} from './types.p';

class GunCollisionHandler implements ICollisionSystemHandler {
  private readonly deflectDirection: {
    moveX: 0 | 1 | -1;
    moveY: 0 | 1 | -1;
    angle: number;
    flipX: boolean;
  } = { moveX: 0, moveY: 0, angle: 0, flipX: false };

  handle({ affected, collider, entities }: CollisionHandleProp): void {
    if (!this.isValidGun(affected)) return;
    if (affected.state.current !== GUN_STATE.IN_FLIGHT) return;

    if (this.isActiveSword({ collider })) {
      if (!collider.ownerEntityId) return;
      const owner = entities.get(collider.ownerEntityId);
      if (!owner) return;

      this.deflectBullet({ bullet: affected, owner });
      return;
    }

    if (this.isBulletClash({ affected, collider }) || this.isPlayer({ collider })) {
      this.deactivateBullet({ bullet: affected });
    }
  }

  private deflectBullet({ bullet, owner }: GunCollisionDeflectProp): void {
    this.populateDeflectDirection({ owner });

    bullet.movement.intent.moveX = this.deflectDirection.moveX;
    bullet.movement.intent.moveY = this.deflectDirection.moveY;

    bullet.sprite.setFlipX(this.deflectDirection.flipX);
    bullet.sprite.setAngle(this.deflectDirection.angle);

    if (bullet.animation) {
      bullet.animation.flipX = this.deflectDirection.flipX;
    }

    const vx = this.deflectDirection.moveX * bullet.movement.speed;
    const vy = this.deflectDirection.moveY * bullet.movement.speed;
    bullet.sprite.setVelocity(vx, vy);
  }

  private populateDeflectDirection({ owner }: PopulateDeflectDirectionProp): void {
    const isFlipped = owner.animation?.flipX ?? owner.sprite?.flipX ?? false;
    const ownerState = owner.state?.current;
    const ownerInput = owner.input;

    const isAttackingUp = ownerState === CHARACTER_STATE.SHORT_ATTACK_UP || !!ownerInput?.up;
    const isAttackingDown = ownerState === CHARACTER_STATE.SHORT_ATTACK_DOWN || !!ownerInput?.down;

    if (isAttackingUp) {
      this.deflectDirection.moveX = 0;
      this.deflectDirection.moveY = -1;
      this.deflectDirection.angle = isFlipped ? 90 : -90;
      this.deflectDirection.flipX = isFlipped;
      return;
    }

    if (isAttackingDown) {
      this.deflectDirection.moveX = 0;
      this.deflectDirection.moveY = 1;
      this.deflectDirection.angle = isFlipped ? -90 : 90;
      this.deflectDirection.flipX = isFlipped;
      return;
    }

    this.deflectDirection.moveX = isFlipped ? -1 : 1;
    this.deflectDirection.moveY = 0;
    this.deflectDirection.angle = 0;
    this.deflectDirection.flipX = isFlipped;
  }

  private deactivateBullet({ bullet }: GunCollisionDeactivateProp): void {
    bullet.state.current = GUN_STATE.IDLE;
    bullet.movement.intent.moveX = 0;
    bullet.movement.intent.moveY = 0;

    if (bullet.velocity) {
      bullet.velocity.vx = 0;
      bullet.velocity.vy = 0;
    }

    bullet.sprite.setVisible(false);
    bullet.sprite.setPosition(-9999, -9999);
    bullet.sprite.setVelocity(0, 0);
  }

  private isActiveSword({ collider }: IsActiveSwordProp): boolean {
    return (
      collider.entityType === ENTITY_TYPES.SWORD && collider.state?.current === SWORD_STATE.SLASHING
    );
  }

  private isBulletClash({ affected, collider }: IsBulletClashProp): boolean {
    return (
      collider.entityId !== affected.entityId &&
      collider.entityType === ENTITY_TYPES.GUN &&
      collider.state?.current === GUN_STATE.IN_FLIGHT
    );
  }

  private isPlayer({ collider }: IsPlayerProp): boolean {
    return collider.entityType === ENTITY_TYPES.PLAYER;
  }

  private isValidGun(entity: GlobalEntity): entity is ValidGunCollisionEntity {
    return (
      entity.entityType === ENTITY_TYPES.GUN &&
      !!entity.state &&
      !!entity.sprite &&
      !!entity.movement
    );
  }
}

export { GunCollisionHandler };
