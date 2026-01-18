import { GlobalEntityMap } from '@/scenes/game/match';

type KeymapSystemProp = {
  scene: Phaser.Scene;
};

type AddPhaserListenersToKeymapProp = {
  entities: GlobalEntityMap;
};

export type { KeymapSystemProp, AddPhaserListenersToKeymapProp };
