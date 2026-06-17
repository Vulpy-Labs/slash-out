import { DamageComponent } from '@/ecs/components';
import type { EntityManager } from '@/managers/entity/EntityManager';

type WeaponBuilderProp = {
  manager: EntityManager;
};

type WeaponBuilderBuildProp = {
  ownerEntityId: string;
  damage?: DamageComponent;
};

export type { WeaponBuilderProp, WeaponBuilderBuildProp };
