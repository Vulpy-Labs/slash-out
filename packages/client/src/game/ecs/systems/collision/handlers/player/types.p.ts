import { MovementComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type PlayerCollisionHandleProp = {
  affected: GlobalEntity;
  collider: GlobalEntity;
};

type ValidPlayerCollisionEntity = GlobalEntity & {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
  movement: MovementComponent;
};

export type { PlayerCollisionHandleProp, ValidPlayerCollisionEntity };
