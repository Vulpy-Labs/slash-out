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
    this.loadPlayers();
  }

  createPlayers() {
    this.matchConfig.players.characters.forEach(character => {
      this.playerBuilder.build({ character });
    });
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
      onEntityCreated: entity => this.registerEntity({ entity, options: { isPlayer: true } }),
    });
  }

  private loadPlayers() {
    this.matchConfig.players.characters.forEach(character => {
      this.playerBuilder.load({ character });
    });
  }

  private createPlayerId() {
    let playerCount = this.players.size + 1;

    while (this.players.has(`player_0${playerCount}`)) {
      playerCount++;
    }

    return `player_0${playerCount}`;
  }

  private registerEntity({ entity, options }: RegisterEntityProp) {
    const { isPlayer = false } = options || {};

    if (isPlayer) {
      entity.entityId = this.createPlayerId();
      this.players.set(entity.entityId, entity);
    }

    this.entities.set(entity.entityId, entity);
  }
}

export { EntityManager };
