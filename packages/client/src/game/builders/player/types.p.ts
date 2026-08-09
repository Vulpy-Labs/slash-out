import { MatchConfigCharacter } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type OnEntityCreatedCallback = (entity: GlobalEntity) => void;

type PlayerBuilderProp = {
  scene: Phaser.Scene;
  onEntityCreated: OnEntityCreatedCallback;
};

type PlayerBuilderPayloadProp = {
  character: MatchConfigCharacter;
  spawnPoint?: { x: number; y: number };
};

type CreatePlayerSpriteProp = {
  character: MatchConfigCharacter;
  frame?: string | number;
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
  spawnPoint?: { x: number; y: number };
};

type MountPlayerEntityProp = {
  character: MatchConfigCharacter;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type {
  PlayerBuilderProp,
  MountPlayerEntityProp,
  CreatePlayerSpriteProp,
  OnEntityCreatedCallback,
  PlayerBuilderPayloadProp,
};
