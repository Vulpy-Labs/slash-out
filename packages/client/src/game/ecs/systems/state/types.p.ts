import { GlobalEntityMap } from '@/scenes/game';

type StateSystemProp = {
  scene: Phaser.Scene;
};

type StateSystemUpdateProp = {
  entities: GlobalEntityMap;
};

export type { StateSystemProp, StateSystemUpdateProp };
