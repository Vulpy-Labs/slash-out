import { StateComponent } from '@/ecs/components';
import { BaseEntity } from '../base';

interface GunEntity extends BaseEntity {
  ownerEntityId: string;
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
}

export type { GunEntity };
