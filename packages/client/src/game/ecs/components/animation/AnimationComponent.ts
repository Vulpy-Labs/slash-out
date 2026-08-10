import { CharacterState, GunState, SwordState } from '@/config/constants';

type AnimationState = CharacterState | SwordState | GunState;

type Animation = {
  key: string;
  end: number;
  start: number;
  repeat: boolean;
  frameRate: number;
  frames?: Phaser.Types.Animations.AnimationFrame[];
};

interface AnimationComponent {
  flipX?: boolean;
  animations: Partial<Record<AnimationState, Animation>>;
}

export type { AnimationComponent };
