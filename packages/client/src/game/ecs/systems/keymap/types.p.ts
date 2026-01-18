import { Entities } from 'ecs/entities';

type KeymapSystemProp = {
  scene: Phaser.Scene;
};

type AddPhaserListenersToKeymapProp = {
  entities: Entities;
};

export type { KeymapSystemProp, AddPhaserListenersToKeymapProp };
