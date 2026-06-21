import { StateSystemUpdateProp } from './types.p';
import { IEntityStateHandler, PlayerStateHandler, SwordStateHandler } from './handlers';
import { ENTITY_TYPES, EntityTypes } from '@/config/constants';;

class StateSystem {
  private handlers: Map<EntityTypes, IEntityStateHandler>;

  constructor() {
    this.handlers = new Map<EntityTypes, IEntityStateHandler>([
      [ENTITY_TYPES.PLAYER, new PlayerStateHandler()],
      [ENTITY_TYPES.SWORD, new SwordStateHandler()],
    ]);
  }

  update({ entities }: StateSystemUpdateProp): void {
    entities.forEach(entity => {
      if (!entity.state) return;

      this.handlers.get(entity.entityType)?.update({ entity });
    });
  }
}

export { StateSystem };
