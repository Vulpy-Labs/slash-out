import { Action, AliveState, CharacterState, Mobility } from '@/config/constants';

interface StateComponent {
  characterState: CharacterState;
  mobility: Mobility;
  action: Action;
  aliveState: AliveState;
}

export type { StateComponent };
