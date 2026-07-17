import { EntityTypes } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';

type OnEntityCreatedCallback = (entity: GlobalEntity) => void;

type WeaponBuilderProp = {
  scene: Phaser.Scene;
  onEntityCreated: OnEntityCreatedCallback;
};

type WeaponBuilderBuildProp = {
  x: number;
  y: number;
  ownerEntityId: string;
  entityType: EntityTypes;
};

export type { WeaponBuilderProp, WeaponBuilderBuildProp, OnEntityCreatedCallback };
