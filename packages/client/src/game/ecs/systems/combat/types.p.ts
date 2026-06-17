import { GlobalEntityMap } from '@/scenes/game';

type CombatSystemProp = {
  scene: Phaser.Scene;
};

type CombatSystemUpdateProp = {
  entities: GlobalEntityMap;
};

export type { CombatSystemProp, CombatSystemUpdateProp };
