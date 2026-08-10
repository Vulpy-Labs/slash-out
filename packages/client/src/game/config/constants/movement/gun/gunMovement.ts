import { BULLET } from '../../weapon';

const GUN_MOVEMENT = {
  AIR: {
    FRICTION: 0,
    SPEED: BULLET.ATTACK.VELOCITY,
  },
  GROUND: {
    FRICTION: 0,
    SPEED: BULLET.ATTACK.VELOCITY,
  },
} as const;

export { GUN_MOVEMENT };
