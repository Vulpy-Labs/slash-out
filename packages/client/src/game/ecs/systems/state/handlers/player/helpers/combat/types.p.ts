import { InputComponent } from '@/ecs/components';

type CombatHelperResolveProp = {
  input: InputComponent;
};

type CombatHelperResolveResult = {
  characterState: string;
};

export type { CombatHelperResolveProp, CombatHelperResolveResult };
