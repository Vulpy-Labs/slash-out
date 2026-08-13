import {
  CHARACTER_COMBAT,
  CHARACTER_STATE,
  ENTITY_TYPES,
  GUN_STATE,
  SWORD_STATE,
} from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { CollisionHandleProp, ICollisionSystemHandler } from '../types.i';
import { ValidPlayerCollisionEntity } from './types.p';

class PlayerCollisionHandler implements ICollisionSystemHandler {
  handle({ affected, collider }: CollisionHandleProp): void {
    if (!this.isValidPlayer(affected)) return;
    if (!this.isActiveWeaponFromEnemy({ player: affected, weapon: collider })) return;

    affected.state.current = CHARACTER_STATE.DEAD;
    affected.state.ticker = CHARACTER_COMBAT.DEATH.DURATION_TICKS;
  }

  private isActiveWeaponFromEnemy({
    player,
    weapon,
  }: {
    player: ValidPlayerCollisionEntity;
    weapon: GlobalEntity;
  }): boolean {
    const isEnemyWeapon = weapon.ownerEntityId !== player.entityId;

    const isActiveSword =
      weapon.entityType === ENTITY_TYPES.SWORD && weapon.state?.current === SWORD_STATE.SLASHING;

    const isActiveBullet =
      weapon.entityType === ENTITY_TYPES.GUN && weapon.state?.current === GUN_STATE.IN_FLIGHT;

    return (isEnemyWeapon && isActiveSword) || isActiveBullet;
  }

  private isValidPlayer(entity: GlobalEntity): entity is ValidPlayerCollisionEntity {
    return (
      entity.entityType === ENTITY_TYPES.PLAYER &&
      !!entity.state &&
      !!entity.sprite &&
      !!entity.movement
    );
  }
}

export { PlayerCollisionHandler };
