import { GlobalEntityMap } from '@/scenes/game';
import { MatchConfig, MatchConfigCharacter } from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';

type PlayerBuilderProp = {
  scene: Phaser.Scene;
  matchConfig: MatchConfig;
  entities: GlobalEntityMap;
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

export type { PlayerBuilderProp, CreatePlayerSpriteProp, MountPlayerEntityProp };
