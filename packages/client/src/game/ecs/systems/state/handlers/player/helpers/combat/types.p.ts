import { CharacterState } from '@/config/constants';
import { InputComponent } from '@/ecs/components';

type CombatHelperResolveProp = {
  input: InputComponent;
};

type CombatHelperResolveResult = {
  characterState: CharacterState;
};

export type { CombatHelperResolveProp, CombatHelperResolveResult };
