import { InputAction, CharacterState } from '@/config/constants';
import { InputComponent } from '@/ecs/components';

type CombatHelperResolveProp = {
  input: InputComponent;
};

type CombatHelperResolveResult = {
  inputAction: InputAction;
  characterState: CharacterState;
};

export type { CombatHelperResolveProp, CombatHelperResolveResult };
