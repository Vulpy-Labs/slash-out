import { MOVEMENT_MAPPING } from '@/config/constants';
import { MovementComponent } from '@/ecs/components';
import { DefaultMovementProp } from './type.p';

function defaultMovement({ entityType }: DefaultMovementProp): MovementComponent {
  const config = MOVEMENT_MAPPING[entityType];
  const entityMovement = config ?? MOVEMENT_MAPPING.fallback;

  if (!config) {
    console.warn(
      `No config was found to build the default movement for the entity: ${entityType}. Using fallback...`
    );
  }

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
