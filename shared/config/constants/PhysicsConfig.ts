export const PHYSICS_CONFIG = {
  // Movement
  MOVE_SPEED: 3,
  JUMP_FORCE: -8,

  // Gravity
  GRAVITY: 0.01,
  MAX_FALL_SPEED: 10,

  // Player size
  PLAYER: {
    WIDTH: 16,
    HEIGHT: 16,
  },

  // World
  WORLD: {
    WIDTH: 352,
    HEIGHT: 240,
    // Expand collision check slightly to detect "touching"
    COLLISIONS: {
      TOUCH_THRESHOLD: 0.5,

      // Only resolve penetrating collisions
      MIN_OVERLAP: 0.1,
    },
  },
};
