import { AnimationComponent } from '@/ecs/components';
import { CharacterState } from '../states';

type AnimationConfig = NonNullable<AnimationComponent['animations'][CharacterState]>;

type SpriteConfig = AnimationConfig & {
  spriteName: string;
  key: CharacterState;
};

export type { SpriteConfig };
