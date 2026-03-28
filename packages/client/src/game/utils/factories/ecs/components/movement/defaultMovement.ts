import { MOVEMENT_MAPPING } from '@/config/constants';
import { MovementComponent } from '@/ecs/components';
import { DefaultMovementProp } from './type.p';

function defaultMovement({ entityType }: DefaultMovementProp): MovementComponent {
  const entityMovement = MOVEMENT_MAPPING[entityType];

  return {
    intent: {
      moveX: 0,
      moveY: 0,
    },
    air: {
      speed: entityMovement.AIR.SPEED,
      friction: entityMovement.AIR.FRICTION,
    },
    ground: {
      speed: entityMovement.GROUND.SPEED,
      friction: entityMovement.GROUND.FRICTION,
    },
  };
}

export { defaultMovement };
