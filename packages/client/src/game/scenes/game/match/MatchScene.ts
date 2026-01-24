import { defaultInput, defaultKeymap, defaultMovement } from '@/utils/factories/ecs/components';
import { MapBuilder } from '@/maps/builder';
import { MatchConfig } from '@/ecs/components';
import { InputSystem, KeymapSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private mapBuilder: MapBuilder;

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;

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
  }

  initializeBuilders() {
    this.mapBuilder = new MapBuilder({ scene: this, mapName: this.matchConfig.mapName });
  }

  preload() {
    this.mapBuilder.load();
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
    this.createFakePlayer();
  }

  createFakePlayer() {
    const fakeEntity = {
      entityId: 'player_01',
      keymap: defaultKeymap({ player: '01' }),
      input: defaultInput(),
      movement: defaultMovement({ entityType: 'player' }),
    };

    this.entities.set(fakeEntity.entityId, fakeEntity);
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
  }
}
