import {
  CharacterComponent,
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
  character?: CharacterComponent;
}

export type { AllComponentsList };
