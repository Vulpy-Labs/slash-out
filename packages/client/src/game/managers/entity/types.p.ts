import { GlobalEntity } from '@/ecs/entities';
import { MatchConfig } from '@/ecs/components';

type RegisterEntityOptionsProp = {
  isPlayer?: boolean;
  type?: string;
};

type EntityManagerProp = {
  scene: Phaser.Scene;
  matchConfig: MatchConfig;
};

type RegisterEntityProp = {
  entity: GlobalEntity;
  options?: RegisterEntityOptionsProp;
};

type DestroyEntityProp = {
  id: string;
};

type GetBuilderByTypeProp = {
  entityType: string;
};

type GetEntityByIdProp = {
  id: string;
};

export type {
  EntityManagerProp,
  RegisterEntityProp,
  DestroyEntityProp,
  GetBuilderByTypeProp,
  GetEntityByIdProp,
};
