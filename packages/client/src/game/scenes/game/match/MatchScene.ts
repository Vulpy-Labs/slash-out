// PR - 6
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
  CombatSystem,
} from '@/ecs/systems';

import { GlobalEntityMap } from './type.i';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private entityManager: EntityManager;

  private mapBuilder: MapBuilder;

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;
  private stateSystem: StateSystem;
  private combatSystem: CombatSystem;
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
    this.combatSystem = new CombatSystem({ scene: this });
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
    this.entities = this.entityManager.getAllEntities();
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

    console.log(this.entities);
  }

  createMap() {
    this.mapBuilder.build();
  }

  createPlayers() {
    this.entityManager.build();
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
    // this.combatSystem.update({ entities: this.entities });
    this.animationSystem.update({ entities: this.entities });
  }
}
