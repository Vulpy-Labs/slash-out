import { GlobalEntityMap } from '@/scenes/game';
import { MatchConfig } from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';
import { MatchConfigCharacter } from '@/ecs/components/match/character-config';

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
