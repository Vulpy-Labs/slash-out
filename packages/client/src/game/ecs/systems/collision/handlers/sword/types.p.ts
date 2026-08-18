import { StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type ValidSwordCollisionEntity = GlobalEntity & {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
  ownerEntityId: string;
};

export type { ValidSwordCollisionEntity };
