import { PLAYER_MOVEMENT_CONSTANT } from '@/config/constants';
import { MovementComponent } from '@/ecs/components';
import { DefaultMovementProp } from './type.p';

function defaultMovement({ entityType }: DefaultMovementProp): MovementComponent {
  const MOVEMENT_CONSTANT = {
    player: PLAYER_MOVEMENT_CONSTANT,
  };

  return {
    air: {
      speed: MOVEMENT_CONSTANT[entityType].AIR.SPEED,
      friction: MOVEMENT_CONSTANT[entityType].AIR.FRICTION,
    },
    ground: {
      speed: MOVEMENT_CONSTANT[entityType].GROUND.SPEED / 2,
      friction: MOVEMENT_CONSTANT[entityType].GROUND.FRICTION,
    },
  };
}

export { defaultMovement };
