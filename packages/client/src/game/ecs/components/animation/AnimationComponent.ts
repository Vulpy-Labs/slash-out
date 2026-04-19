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
  animations: Partial<Record<string, Animation>>;
}

export type { AnimationComponent };
