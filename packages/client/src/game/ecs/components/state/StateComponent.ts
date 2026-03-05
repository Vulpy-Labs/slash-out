import { InputAction, AliveState, CharacterState, Mobility } from '@/config/constants';

interface StateComponent {
  characterState: CharacterState;
  mobility: Mobility;
  inputAction: InputAction;
  aliveState: AliveState;
}

export type { StateComponent };
