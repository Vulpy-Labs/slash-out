import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type PlayerStateHandlerUpdateProp = {
  entity: GlobalEntity;
};

type ValidPlayerEntity = GlobalEntity & {
  state: StateComponent;
  input: InputComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type { PlayerStateHandlerUpdateProp, ValidPlayerEntity };
