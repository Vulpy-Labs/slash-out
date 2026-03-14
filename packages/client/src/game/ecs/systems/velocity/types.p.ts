import { GlobalEntityMap } from '@/scenes/game';

type VelocitySystemProp = {
  scene: Phaser.Scene;
};

type VelocitySystemUpdateProp = {
  entities: GlobalEntityMap;
};

export type { VelocitySystemProp, VelocitySystemUpdateProp };
