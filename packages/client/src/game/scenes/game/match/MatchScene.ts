import { MapBuilder } from '@/maps/builder';
import { MatchConfig } from '@/ecs/components';
import { InputSystem, KeymapSystem, MovementSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';
import { CreatePlayerProp } from './type.p';
import { loadCharacterSprites, playerFactory } from '@/utils/factories/ecs/entities';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private mapBuilder: MapBuilder;

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;
  private movementSystem: MovementSystem;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;

    this.initializeInstances();
  }

  initializeInstances() {
    this.initializeSystems();
    this.initializeBuilders();
  }

  initializeSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
    this.inputSystem = new InputSystem({ scene: this });
    this.movementSystem = new MovementSystem({ scene: this });
  }

  initializeBuilders() {
    this.mapBuilder = new MapBuilder({ scene: this, mapName: this.matchConfig.mapName });
  }

  preload() {
    this.loadPlayerAssets();
    this.mapBuilder.load();
  }

  loadPlayerAssets() {
    loadCharacterSprites({ name: 'otomo', scene: this, version: 'v1' });
  }

  create() {
    this.createMap();
    this.createECS();
    this.createKeyboardInputs();
  }

  createMap() {
    this.mapBuilder.build();
  }

  createECS() {
    this.createEntities();
  }

  createEntities() {
    this.createPlayer({ x: 100, y: 100 });
  }

  createPlayer({ x, y }: CreatePlayerProp) {
    const newPlayer = playerFactory({
      scene: this,
      entities: this.entities,
      x,
      y,
      characterName: 'otomo',
      keymapFor: '01',
    });

    this.entities.set(newPlayer.entityId, newPlayer);
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
    this.movementSystem.update({ entities: this.entities });
  }
}
