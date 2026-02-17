import { GlobalEntityMap } from '@/scenes/game';

type AnimationSystemProp = {
  scene: Phaser.Scene;
};

type AnimationSystemPayloadProp = {
  entities: GlobalEntityMap;
};

export type { AnimationSystemProp, AnimationSystemPayloadProp };
