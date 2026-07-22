import { StateComponent } from '@/ecs/components';

type IsTickerActiveProp = {
  state: StateComponent;
};

type DecrementStateTickerProp = {
  state: StateComponent;
};

export type { IsTickerActiveProp, DecrementStateTickerProp };
