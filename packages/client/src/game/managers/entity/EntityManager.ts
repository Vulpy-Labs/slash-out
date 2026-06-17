import { PlayerBuilder, WeaponBuilder } from '@/builders';
import type { EntityBuilder } from '@/builders/types';
import type { GlobalEntityMap } from '@/scenes/game';
import type { MatchConfig } from '@/ecs/components';
import { ENTITY_TYPES } from '@/config/constants';
import type {
  DestroyEntityProp,
  EntityManagerProp,
  RegisterEntityProp,
  GetBuilderByTypeProp,
  GetEntityByIdProp,
} from './types.p';

class EntityManager {
  public readonly scene: Phaser.Scene;
  public readonly matchConfig: MatchConfig;

  private readonly entities: GlobalEntityMap = new Map();
  private readonly builders: Map<string, EntityBuilder> = new Map();

  constructor({ scene, matchConfig }: EntityManagerProp) {
    this.scene = scene;
    this.matchConfig = matchConfig;

    this.initializeInstances();
  }

  load() {
    this.builders.forEach(EntityBuilder => EntityBuilder.load());
  }

  build() {
    this.builders.forEach(EntityBuilder => EntityBuilder.build());
  }

  getAll() {
    return this.entities;
  }

  getEntityById({ id }: GetEntityByIdProp) {
    return this.entities.get(id);
  }

  destroyEntityById({ id }: DestroyEntityProp) {
    const entity = this.entities.get(id);

    if (!entity) {
      console.warn(`Entity with id ${id} not found to destroy.`);
      return;
    }

    const entityBuilder = this.getBuilderByType({ entityType: entity.entityType });
    if (!entityBuilder) {
      throw new Error(`Builder not found for entity type: ${entity.entityType}`);
    }

    entityBuilder.destroy(entity);
  }

  registerEntity({ entity }: RegisterEntityProp) {
    const entityBuilder = this.getBuilderByType({ entityType: entity.entityType });
    if (!entityBuilder) {
      throw new Error(`Builder not found for entity type: ${entity.entityType}`);
    }

    entity.entityId = entityBuilder.generateId();

    if (entity.sprite) {
      entity.sprite.setData('entityId', entity.entityId);
    }

    this.entities.set(entity.entityId, entity);
  }

  getBuilderByType({ entityType }: GetBuilderByTypeProp): EntityBuilder | undefined {
    return this.builders.get(entityType);
  }

  private initializeInstances() {
    this.initializeBuilders();
  }

  private initializeBuilders() {
    this.builders.set(ENTITY_TYPES.PLAYER, new PlayerBuilder({ manager: this }));
    this.builders.set(ENTITY_TYPES.SWORD, new WeaponBuilder({ manager: this }));
  }
}

export { EntityManager };
