import { GlobalEntityMap } from '@/scenes/game';

type KeymapSystemProp = {
  scene: Phaser.Scene;
};

type CreatePhaserListenersProp = {
  entities: GlobalEntityMap;
};

export type { KeymapSystemProp, CreatePhaserListenersProp };
