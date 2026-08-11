import { GlobalEntityMap } from '@/scenes/game';

type CollisionSystemCreateProp = {
  scene: Phaser.Scene;
  entities: GlobalEntityMap;
};

export type { CollisionSystemCreateProp };
