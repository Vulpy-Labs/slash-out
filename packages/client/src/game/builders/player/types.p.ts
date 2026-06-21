// PR - 4
import { MatchConfigCharacter, EquipmentComponent } from '@/ecs/components';
import type { EntityManager } from '@/managers/entity/EntityManager';

type PlayerBuilderProp = {
  manager: EntityManager;
};

type PlayerBuilderPayloadProp = {
  character: MatchConfigCharacter;
  equipment?: EquipmentComponent;
};

type CreatePlayerSpriteProp = {
  character: MatchConfigCharacter;
  frame?: string | number;
  options?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};

type MountPlayerEntityProp = {
  character: MatchConfigCharacter;
  equipment?: EquipmentComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

type LoadCharacterSpritesProp = {
  character: MatchConfigCharacter;
};

export type {
  PlayerBuilderProp,
  MountPlayerEntityProp,
  CreatePlayerSpriteProp,
  PlayerBuilderPayloadProp,
  LoadCharacterSpritesProp,
};
