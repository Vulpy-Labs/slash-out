import { ENTITY_TYPES } from '@/config/constants';
import { AnimationComponent, DamageComponent, InputComponent, KeymapComponent, StateComponent } from '@/ecs/components';
import { BaseEntity } from '../../base';

interface SwordEntity extends BaseEntity {
  entityType: typeof ENTITY_TYPES.SWORD;
  animation: AnimationComponent;
  damage: DamageComponent;
  keymap: KeymapComponent;
  input: InputComponent;
  ownerEntityId: string;
  sprite: Phaser.Physics.Matter.Sprite;
  state: StateComponent;
}

export type { SwordEntity };
