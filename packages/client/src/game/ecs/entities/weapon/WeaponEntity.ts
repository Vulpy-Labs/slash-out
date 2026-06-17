import { ENTITY_TYPES } from '@/config/constants';
import { AnimationComponent, DamageComponent } from '@/ecs/components';
import { BaseEntity } from '../base';

interface WeaponEntity extends BaseEntity {
  entityId: string;
  entityType: typeof ENTITY_TYPES.SWORD;
  sprite: Phaser.Physics.Matter.Sprite;
  ownerEntityId: string;
  damage: DamageComponent;
  animation: AnimationComponent;
}

export type { WeaponEntity };
