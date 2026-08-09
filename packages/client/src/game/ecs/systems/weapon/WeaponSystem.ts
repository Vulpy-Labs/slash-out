import { ENTITY_TYPES, EntityTypes } from '@/config/constants';
import { IWeaponSystemHandler, SwordWeaponSystemHandler } from './handlers';
import { WeaponSystemUpdateProp } from './types.p';

class WeaponSystem {
  private handlers: Map<EntityTypes, IWeaponSystemHandler>;

  constructor() {
    this.handlers = new Map<EntityTypes, IWeaponSystemHandler>([
      [ENTITY_TYPES.SWORD, new SwordWeaponSystemHandler()],
    ]);
  }

  update({ entities }: WeaponSystemUpdateProp): void {
    entities.forEach(entity => {
      this.handlers.get(entity.entityType)?.update({ entity, entities });
    });
  }
}

export { WeaponSystem };
