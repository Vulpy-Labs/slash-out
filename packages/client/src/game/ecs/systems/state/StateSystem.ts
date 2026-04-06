import { ALIVE_STATE, MOBILITY, PLAYER_MOVEMENT } from '@/config/constants';
import {
  StateSystemUpdateProp,
  StateSystemIsPlayerAliveProp,
  StateSystemUpdatePostureProp,
} from './types.p';
import { DeadHandler, GroundedHandler, AirborneHandler } from './handlers';

class StateSystem {
  private deadHandler: DeadHandler;
  private groundedHandler: GroundedHandler;
  private airborneHandler: AirborneHandler;

  constructor() {
    this.deadHandler = new DeadHandler();
    this.groundedHandler = new GroundedHandler();
    this.airborneHandler = new AirborneHandler();
  }

  update({ entities }: StateSystemUpdateProp) {
    entities.forEach(({ state, input, sprite }) => {
      if (!state || !input || !sprite) return;

      if (!this.isPlayerAlive({ state })) {
        this.deadHandler.resolve({ state });
        return;
      }

      this.updatePosture({ state, sprite });

      if (state.mobility === MOBILITY.GROUNDED) {
        this.groundedHandler.resolve({ state, input });
      } else if (state.mobility === MOBILITY.AIRBORNE) {
        this.airborneHandler.resolve({ state, input });
      }
    });
  }

  private isPlayerAlive({ state }: StateSystemIsPlayerAliveProp) {
    return state.aliveState === ALIVE_STATE.ALIVE;
  }

  private updatePosture({ state, sprite }: StateSystemUpdatePostureProp): void {
    const body = sprite.body as MatterJS.BodyType;
    const vy = body.velocity.y;
    const isGrounded = Math.abs(vy) < PLAYER_MOVEMENT.GROUND.GROUNDED_VELOCITY_THRESHOLD;

    if (isGrounded) {
      state.mobility = MOBILITY.GROUNDED;
    } else {
      state.mobility = MOBILITY.AIRBORNE;
    }
  }
}

export { StateSystem };
