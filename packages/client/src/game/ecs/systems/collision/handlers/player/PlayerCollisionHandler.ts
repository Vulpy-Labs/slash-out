import {
  CHARACTER_COMBAT,
  CHARACTER_STATE,
  ENTITY_TYPES,
  GUN_STATE,
  SWORD_STATE,
} from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { CollisionHandleProp, ICollisionSystemHandler } from '../types.i';

class PlayerCollisionHandler implements ICollisionSystemHandler {
  handle({ affected, collider }: CollisionHandleProp): void {
    if (!this.isValidPlayer({ entity: affected })) return;
    if (!this.isActiveWeaponFromEnemy({ player: affected, weapon: collider })) return;
    if (!affected.state) return;

    affected.state.current = CHARACTER_STATE.DEAD;
    affected.state.ticker = CHARACTER_COMBAT.DEATH.DURATION_TICKS;
  }

  private isActiveWeaponFromEnemy({
    player,
    weapon,
  }: {
    player: GlobalEntity;
    weapon: GlobalEntity;
  }): boolean {
    const isEnemyWeapon = weapon.ownerEntityId !== player.entityId;

    const isActiveSword =
      weapon.entityType === ENTITY_TYPES.SWORD && weapon.state?.current === SWORD_STATE.SLASHING;

    const isActiveBullet =
      weapon.entityType === ENTITY_TYPES.GUN && weapon.state?.current === GUN_STATE.IN_FLIGHT;

    return (isEnemyWeapon && isActiveSword) || isActiveBullet;
  }

  private isValidPlayer({ entity }: { entity: GlobalEntity }): boolean {
    return (
      entity.entityType === ENTITY_TYPES.PLAYER &&
      !!entity.state &&
      !!entity.sprite &&
      !!entity.movement
    );
  }
}

export { PlayerCollisionHandler };
