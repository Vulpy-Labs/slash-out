import { InputComponent, StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type SwordStateHandlerUpdateProp = {
  entity: GlobalEntity;
};

type ValidSwordEntity = GlobalEntity & {
  state: StateComponent;
  input: InputComponent;
};

export type { SwordStateHandlerUpdateProp, ValidSwordEntity };
