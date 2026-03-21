import { MatchConfigPlayers, MatchConfigCharacter } from '@/ecs/components';
import { BaseEntity, GlobalEntity } from '@/ecs/entities';

type PlayerIds = Set<string>;

type OnEntityCreatedCallback = (entity: GlobalEntity) => void;

type PlayerBuilderProp = {
  scene: Phaser.Scene;
  playersConfig: MatchConfigPlayers;
  onEntityCreated: OnEntityCreatedCallback;
};

type CreatePlayerSpriteProp = {
  character: MatchConfigCharacter;
  frame?: string | number;
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};

type MountPlayerEntityProp = BaseEntity & {
  character: MatchConfigCharacter;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type {
  PlayerIds,
  PlayerBuilderProp,
  MountPlayerEntityProp,
  CreatePlayerSpriteProp,
  OnEntityCreatedCallback,
};
