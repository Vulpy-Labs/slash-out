import { GlobalEntity } from '@/ecs/entities';
import { MatchConfig } from '@/ecs/components';

type RegisterEntityOptionsProp = {
  isPlayer?: boolean;
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

export type { EntityManagerProp, RegisterEntityProp, DestroyEntityProp };
