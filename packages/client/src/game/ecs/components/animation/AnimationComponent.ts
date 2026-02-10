type Animation = {
  key: string;
  end: number;
  start: number;
  repeat: boolean;
  frameRate: number;
  frames?: Phaser.Types.Animations.AnimationFrame[];
}

interface AnimationComponent {
  flipX: boolean;
  currentState: string;
  animations: Record<string, Animation>;
}

export type { AnimationComponent };
