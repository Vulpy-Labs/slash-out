import { StateComponent } from '@/ecs/components';
import { GlobalEntityMap } from '@/scenes/game';

type StateSystemProp = {
  scene: Phaser.Scene;
};

type StateSystemUpdateProp = {
  entities: GlobalEntityMap;
};

type StateSystemIsPlayerAliveProp = {
  state: StateComponent;
};

type StateSystemUpdatePostureProp = {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type {
  StateSystemProp,
  StateSystemUpdateProp,
  StateSystemIsPlayerAliveProp,
  StateSystemUpdatePostureProp,
};
