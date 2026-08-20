interface MovementComponent {
  intent: {
    moveX: 0 | 1 | -1;
    moveY: 0 | 1 | -1;
  };
  externalForce?: {
    x: number;
    y: number;
  };
  air: {
    friction: number;
    speed: number;
  };
  ground: {
    friction: number;
    speed: number;
  };
}

export type { MovementComponent };
