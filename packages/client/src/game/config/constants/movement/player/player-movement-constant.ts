const PLAYER_MOVEMENT_CONSTANT = {
  AIR: {
    FRICTION: 0.05,
    SPEED: 5,
  },
  GROUND: {
    FRICTION: 0.21,
    SPEED: 2,
  },
} as const;

export { PLAYER_MOVEMENT_CONSTANT };
