import { PlayerBuilder, MapBuilder } from '@/builders';
import { MatchConfig } from '@/ecs/components';
import {
  AnimationSystem,
  InputSystem,
  KeymapSystem,
  MovementSystem,
  VelocitySystem,
} from '@/ecs/systems';

import { GlobalEntityMap } from './type.i';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private mapBuilder: MapBuilder;
  private playerBuilder: PlayerBuilder;

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;
  private movementSystem: MovementSystem;
  private velocitySystem: VelocitySystem;
  private animationSystem: AnimationSystem;

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
    this.inputSystem = new InputSystem();
    this.movementSystem = new MovementSystem();
    this.keymapSystem = new KeymapSystem({ scene: this });
    this.velocitySystem = new VelocitySystem({ scene: this });
    this.animationSystem = new AnimationSystem({ scene: this });
  }

  initializeBuilders() {
    this.mapBuilder = new MapBuilder({ scene: this, mapName: this.matchConfig.mapName });
    this.playerBuilder = new PlayerBuilder({
      scene: this,
      matchConfig: this.matchConfig,
      entities: this.entities,
    });
  }

  preload() {
    this.mapBuilder.load();
    this.playerBuilder.load();
  }

  create() {
    this.createMap();
    this.createPlayers();
    this.createKeyboardInputs();
    this.createAnimations();
  }

  createMap() {
    this.mapBuilder.build();
  }

  createPlayers() {
    this.playerBuilder.build();
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  createAnimations() {
    this.animationSystem.create({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
    this.movementSystem.update({ entities: this.entities });
    this.velocitySystem.update({ entities: this.entities });
    this.animationSystem.update({ entities: this.entities });
  }
}
