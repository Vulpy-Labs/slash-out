import {
  InputComponent,
  KeymapComponent,
  MatchConfig,
  MovementComponent,
  VelocityComponent,
} from '../';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
  input?: InputComponent;
  movement?: MovementComponent;
  velocity?: VelocityComponent;
}

export type { AllComponentsList };
