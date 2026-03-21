import { PlayerBuilder } from '@/builders';

import { GlobalEntityMap } from '@/scenes/game';
import { MatchConfig } from '@/ecs/components';
import { DestroyEntityProp, EntityManagerProp, RegisterEntityProp } from './types.p';

class EntityManager {
  private readonly scene: Phaser.Scene;
  private readonly matchConfig: MatchConfig;

  private readonly entities: GlobalEntityMap = new Map();
  private readonly players: GlobalEntityMap = new Map();

  private playerBuilder: PlayerBuilder;

  constructor({ scene, matchConfig }: EntityManagerProp) {
    this.scene = scene;
    this.matchConfig = matchConfig;

    this.initializeInstances();
  }

  load() {
    this.playerBuilder.load();
  }

  createPlayers() {
    this.playerBuilder.build();
  }

  getAll() {
    return this.entities;
  }

  getPlayers() {
    return this.players;
  }

  destroyEntity({ id }: DestroyEntityProp) {
    const entity = this.entities.get(id);

    if (!entity) {
      console.warn(`Entity with id ${id} not found to destroy.`);
      return;
    }

    if (entity.sprite) {
      entity.sprite.destroy();
    }

    this.players.delete(id);
    this.entities.delete(id);
  }

  private initializeInstances() {
    this.initializeBuilders();
  }

  private initializeBuilders() {
    this.playerBuilder = new PlayerBuilder({
      scene: this.scene,
      playersConfig: this.matchConfig.players,
      onEntityCreated: entity => this.registerEntity({ entity, options: { isPlayer: true } }),
    });
  }

  private registerEntity({ entity, options }: RegisterEntityProp) {
    const { isPlayer = false } = options || {};

    this.entities.set(entity.entityId, entity);

    if (isPlayer) this.players.set(entity.entityId, entity);
  }
}

export { EntityManager };
