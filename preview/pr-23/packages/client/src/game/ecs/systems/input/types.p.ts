import { GlobalEntityMap } from '@/scenes/game';

type InputSystemProps = {
  scene: Phaser.Scene;
};

type InputSystemUpdateProps = {
  entities: GlobalEntityMap;
};

export type { InputSystemProps, InputSystemUpdateProps };
