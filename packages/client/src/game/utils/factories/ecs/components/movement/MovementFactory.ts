import { PLAYER_MOVEMENT_CONSTANT } from '@/config/constants';
import { MovementComponent } from '@/ecs/components';

class MovementFactory {
  getDefaultMovement(): MovementComponent {
    return {
      air: {
        speed: PLAYER_MOVEMENT_CONSTANT.AIR.SPEED,
        friction: PLAYER_MOVEMENT_CONSTANT.AIR.FRICTION,
      },
      ground: {
        speed: PLAYER_MOVEMENT_CONSTANT.GROUND.SPEED,
        friction: PLAYER_MOVEMENT_CONSTANT.GROUND.FRICTION,
      },
    };
  }
}

export { MovementFactory };
