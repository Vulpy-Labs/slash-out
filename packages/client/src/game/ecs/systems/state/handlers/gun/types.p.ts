import { StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

type GunStateHandlerUpdateProp = {
  entity: GlobalEntity;
  entities?: GlobalEntityMap;
};

type ValidGunEntity = GlobalEntity & {
  state: StateComponent;
};

export type { GunStateHandlerUpdateProp, ValidGunEntity };
