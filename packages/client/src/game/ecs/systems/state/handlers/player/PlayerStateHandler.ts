import { MOBILITY } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { getMobility } from '@/utils/physics';
import { GroundedHandler, AirborneHandler } from './helpers';

import { IEntityStateHandler } from '../types.i';
import { PlayerStateHandlerUpdateProp, ValidPlayerEntity } from './types.p';

class PlayerStateHandler implements IEntityStateHandler {
  private groundedHandler: GroundedHandler;
  private airborneHandler: AirborneHandler;

  constructor() {
    this.groundedHandler = new GroundedHandler();
    this.airborneHandler = new AirborneHandler();
  }

  update({ entity }: PlayerStateHandlerUpdateProp): void {
    if (!this.isValidPlayer(entity)) return;

    const { state, input, sprite } = entity;
    const mobility = getMobility(sprite);

    if (mobility === MOBILITY.GROUNDED) {
      this.groundedHandler.resolve({ state, input });
    } else if (mobility === MOBILITY.AIRBORNE) {
      this.airborneHandler.resolve({ state, input });
    }
  }

  private isValidPlayer(entity: GlobalEntity): entity is ValidPlayerEntity {
    return !!entity.input && !!entity.state && !!entity.sprite;
  }
}

export { PlayerStateHandler };
