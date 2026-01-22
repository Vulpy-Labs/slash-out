import { GlobalEntityMap } from '@/scenes/game';

type MovementSystemProp = {
  scene: Phaser.Scene;
};

type MovementSystemUpdateProp = {
  entities: GlobalEntityMap;
};

export type { MovementSystemProp, MovementSystemUpdateProp };
