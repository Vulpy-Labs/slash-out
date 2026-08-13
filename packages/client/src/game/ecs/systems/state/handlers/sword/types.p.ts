import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

type SwordStateHandlerUpdateProp = {
  entity: GlobalEntity;
  entities?: GlobalEntityMap;
};

type ValidSwordEntity = GlobalEntity & {
  state: StateComponent;
  input: InputComponent;
};

export type { SwordStateHandlerUpdateProp, ValidSwordEntity };
