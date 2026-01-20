import { GlobalEntityMap } from '@/scenes/game/match';

type KeymapSystemProp = {
  scene: Phaser.Scene;
};

type CreatePhaserListenersProp = {
  entities: GlobalEntityMap;
};

export type { KeymapSystemProp, CreatePhaserListenersProp };
