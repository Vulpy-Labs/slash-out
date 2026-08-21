import { ENTITY_TYPES, EntityTypes } from '@/config/constants';
import { ICollisionSystemHandler, PlayerCollisionHandler, SwordCollisionHandler } from './handlers';
import { CollisionSystemCreateProp } from './types.p';
import { GunCollisionHandler } from './handlers/gun';

class CollisionSystem {
  private readonly handlers: Map<EntityTypes, ICollisionSystemHandler>;

  constructor() {
    this.handlers = new Map<EntityTypes, ICollisionSystemHandler>([
      [ENTITY_TYPES.PLAYER, new PlayerCollisionHandler()],
      [ENTITY_TYPES.SWORD, new SwordCollisionHandler()],
      [ENTITY_TYPES.GUN, new GunCollisionHandler()],
    ]);
  }

  registerHandler({
    entityType,
    handler,
  }: {
    entityType: EntityTypes;
    handler: ICollisionSystemHandler;
  }): void {
    this.handlers.set(entityType, handler);
  }

  createMatterListeners({ scene, entities }: CollisionSystemCreateProp): void {
    const handleCollision = (event: {
      pairs: Array<{ bodyA: MatterJS.BodyType; bodyB: MatterJS.BodyType }>;
    }) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const entityA = bodyA.label ? entities.get(bodyA.label) : undefined;
        const entityB = bodyB.label ? entities.get(bodyB.label) : undefined;

        if (!entityA || !entityB) return;

        this.handlers.get(entityA.entityType)?.handle({
          affected: entityA,
          collider: entityB,
          entities,
        });

        this.handlers.get(entityB.entityType)?.handle({
          affected: entityB,
          collider: entityA,
          entities,
        });
      });
    };

    scene.matter.world.on('collisionstart', handleCollision);
  }
}

export { CollisionSystem };
