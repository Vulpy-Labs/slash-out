import { MOBILITY, PLAYER_MOVEMENT, Mobility } from '@/config/constants';

function getMobility(sprite: Phaser.Physics.Matter.Sprite): Mobility {
  const body = sprite.body as MatterJS.BodyType;
  const vy = body.velocity.y;
  const isGrounded = Math.abs(vy) < PLAYER_MOVEMENT.GROUND.GROUNDED_VELOCITY_THRESHOLD;

  return isGrounded ? MOBILITY.GROUNDED : MOBILITY.AIRBORNE;
}

export { getMobility };
