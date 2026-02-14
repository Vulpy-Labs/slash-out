import { AnimationComponent } from '@/ecs/components';
import { CharacterState } from '../states';

type AnimationConfig = AnimationComponent['animations'][CharacterState];

type SpriteConfig = AnimationConfig & {
  spriteName: string;
  key: CharacterState;
};

export type { SpriteConfig };
