import { ENTITY_TYPES, EntityTypes } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { WeaponBuilderProp, WeaponBuilderBuildProp } from './types.p';
import { IWeaponHandler, SwordWeaponHandler, GunWeaponHandler } from './handlers';

class WeaponBuilder {
  private readonly scene: Phaser.Scene;
  private readonly onEntityCreated: (entity: GlobalEntity) => void;
  private readonly handlers: Map<EntityTypes, IWeaponHandler>;

  constructor({ scene, onEntityCreated }: WeaponBuilderProp) {
    this.scene = scene;
    this.onEntityCreated = onEntityCreated;

    this.handlers = new Map<EntityTypes, IWeaponHandler>([
      [ENTITY_TYPES.SWORD, new SwordWeaponHandler()],
      [ENTITY_TYPES.GUN, new GunWeaponHandler()],
    ]);
  }

  load({ entityType }: { entityType: EntityTypes }) {
    const handler = this.handlers.get(entityType);

    if (!handler) {
      throw new Error(`No weapon builder handler found for entity type: ${entityType}`);
    }

    handler.load({ scene: this.scene });
  }

  build({ x, y, ownerEntityId, entityType }: WeaponBuilderBuildProp) {
    const handler = this.handlers.get(entityType);

    if (!handler) {
      throw new Error(`No weapon builder handler found for entity type: ${entityType}`);
    }

    const weaponEntity = handler.build({ scene: this.scene, x, y, ownerEntityId });

    this.onEntityCreated(weaponEntity);
  }
}

export { WeaponBuilder };
