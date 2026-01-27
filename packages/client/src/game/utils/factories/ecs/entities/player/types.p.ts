import { GlobalEntityMap } from '@/scenes/game';

type PlayerFactoryProp = {
  scene: Phaser.Scene;
  entities: GlobalEntityMap;
  x: number;
  y: number;
  defaultSprite: string;
  keymapFor: '01' | '02';
};

type GetPlayerIdProp = {
  entities: GlobalEntityMap;
};

export type { PlayerFactoryProp, GetPlayerIdProp };
