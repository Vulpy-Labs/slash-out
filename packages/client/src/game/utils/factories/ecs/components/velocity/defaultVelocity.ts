import { VelocityComponent } from '@/ecs/components';

function defaultVelocity(): VelocityComponent {
  return {
    vx: 0,
    vy: 0,
  };
}

export { defaultVelocity };
