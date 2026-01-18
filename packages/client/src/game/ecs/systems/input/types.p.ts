import { Entities } from 'ecs/entities';

type InputSystemProps = {
  scene: Phaser.Scene;
};

type CreateDefaultInputsProps = {
  entities: Entities;
};

type InputSystemUpdateProps = {
  entities: Entities;
};

export type { InputSystemProps, CreateDefaultInputsProps, InputSystemUpdateProps };
