export const SWORD = {
  CONFIG: {
    WIDTH: 36,
    HEIGHT: 18,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
    OFFSET: 18,
  },
  ATTACK: {
    DAMAGE: {
      BASE: 100,
      MULTIPLIER: 1,
    },
  },
} as const;

export const BULLET = {
  CONFIG: {
    WIDTH: 16,
    HEIGHT: 16,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
    ANGLE: 0,
  },
  ATTACK: {
    CLIP_SIZE: 3,
    VELOCITY: 4,
    DAMAGE: {
      BASE: 100,
      MULTIPLIER: 1,
    },
  },
} as const;
