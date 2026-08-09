import { ENTITY_TYPES } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';

type OnEntityCreatedCallback = (entity: GlobalEntity) => void;

type WeaponEntityTypes = typeof ENTITY_TYPES.SWORD;

type WeaponBuilderProp = {
  scene: Phaser.Scene;
  onEntityCreated: OnEntityCreatedCallback;
};

type WeaponBuilderBuildProp = {
  x: number;
  y: number;
  ownerEntityId: string;
  entityType: WeaponEntityTypes;
};

export type {
  WeaponBuilderProp,
  WeaponBuilderBuildProp,
  OnEntityCreatedCallback,
  WeaponEntityTypes,
};
