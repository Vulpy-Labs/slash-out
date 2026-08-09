import { MapBuilder } from '@/builders';
import { EntityManager } from '@/managers';
import { MatchConfig } from '@/ecs/components';
import {
  AnimationSystem,
  InputSystem,
  KeymapSystem,
  MovementSystem,
  VelocitySystem,
  StateSystem,
  WeaponSystem,
} from '@/ecs/systems';

import { GlobalEntityMap } from './type.i';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private entityManager: EntityManager;

  private mapBuilder: MapBuilder;
  private spawnPoints: { x: number; y: number }[] = [];

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;
  private stateSystem: StateSystem;
  private weaponSystem: WeaponSystem;
  private movementSystem: MovementSystem;
  private velocitySystem: VelocitySystem;
  private animationSystem: AnimationSystem;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;

    this.initializeInstances();
    this.initializeEntities();
  }

  initializeInstances() {
    this.initializeSystems();
    this.initializeBuilders();
    this.initializeManagers();
  }

  initializeSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
    this.inputSystem = new InputSystem();
    this.movementSystem = new MovementSystem();
    this.velocitySystem = new VelocitySystem({ scene: this });
    this.stateSystem = new StateSystem();
    this.weaponSystem = new WeaponSystem();
    this.animationSystem = new AnimationSystem({ scene: this });
  }

  initializeBuilders() {
    this.mapBuilder = new MapBuilder({ scene: this, mapName: this.matchConfig.mapName });
  }

  initializeManagers() {
    this.entityManager = new EntityManager({
      scene: this,
      matchConfig: this.matchConfig,
    });
  }

  initializeEntities() {
    this.entities = this.entityManager.getAll();
  }

  preload() {
    this.mapBuilder.load();
    this.entityManager.load();
  }

  create() {
    this.createMap();
    this.createPlayers();
    this.createKeyboardInputs();
    this.createAnimations();
  }

  createMap() {
    const { spawnPoints } = this.mapBuilder.build();
    this.spawnPoints = spawnPoints;
  }

  createPlayers() {
    this.entityManager.createPlayers(this.spawnPoints);
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
    this.stateSystem.update({ entities: this.entities });
    this.weaponSystem.update({ entities: this.entities });
    this.animationSystem.update({ entities: this.entities });
  }
}
