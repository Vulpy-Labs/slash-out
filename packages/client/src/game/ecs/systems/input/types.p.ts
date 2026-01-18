import { GlobalEntityMap } from '@/scenes/game';

type InputSystemProps = {
  scene: Phaser.Scene;
};

type CreateDefaultInputsProps = {
  entities: GlobalEntityMap;
};

type InputSystemUpdateProps = {
  entities: GlobalEntityMap;
};

export type { InputSystemProps, CreateDefaultInputsProps, InputSystemUpdateProps };
