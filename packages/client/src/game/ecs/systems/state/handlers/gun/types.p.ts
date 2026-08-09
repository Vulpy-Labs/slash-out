import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type GunStateHandlerUpdateProp = {
  entity: GlobalEntity;
};

type ValidGunEntity = GlobalEntity & {
  state: StateComponent;
  input: InputComponent;
};

export type { GunStateHandlerUpdateProp, ValidGunEntity };
