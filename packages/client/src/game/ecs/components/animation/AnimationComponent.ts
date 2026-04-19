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
  animations: Record<string, Animation>;
}

export type { AnimationComponent };
