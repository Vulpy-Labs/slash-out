import { CharacterComponent } from '../character';
import type { InputComponent } from '../input';
import type { KeymapComponent } from '../keymap';
import type { MatchConfig } from '../match';
import type { MovementComponent } from '../movement';
import type { VelocityComponent } from '../velocity';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
  input?: InputComponent;
  movement?: MovementComponent;
  velocity?: VelocityComponent;
  character?: CharacterComponent;
}

export type { AllComponentsList };
