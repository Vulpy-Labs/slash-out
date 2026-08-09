import { ENTITY_TYPES } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { WeaponBuilderProp, WeaponBuilderBuildProp, WeaponEntityTypes } from './types.p';
import { IWeaponHandler, SwordWeaponHandler } from './handlers';

class WeaponBuilder {
  private readonly scene: Phaser.Scene;
  private readonly onEntityCreated: (entity: GlobalEntity) => void;
  private readonly handlers: Map<WeaponEntityTypes, IWeaponHandler>;

  constructor({ scene, onEntityCreated }: WeaponBuilderProp) {
    this.scene = scene;
    this.onEntityCreated = onEntityCreated;

    this.handlers = new Map<WeaponEntityTypes, IWeaponHandler>([
      [ENTITY_TYPES.SWORD, new SwordWeaponHandler()],
    ]);
  }

  load({ entityType }: { entityType: WeaponEntityTypes }) {
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
