interface MovementComponent {
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
