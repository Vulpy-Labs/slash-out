import { MapBuilder } from '@/maps/builder';
import { MatchConfig } from '@/ecs/components';
import { InputSystem, KeymapSystem, MovementSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';
import { defaultInput, defaultKeymap, defaultMovement } from '@/utils/factories/ecs/components';
import { CreatePlayerProp } from './type.p';
import { PlayerEntity } from '@/ecs/entities/player';

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
    this.load.image({
      key: 'otomo_idle',
      url: '/assets/sprites/characters/otomo/v1/spr_idle.png',
    });
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
    const player = this.matter.add.sprite(x, y, 'otomo_idle', undefined);
    player.setFixedRotation();
    player.setFriction(0);

    const playerEntity: PlayerEntity = {
      entityId: 'player_01',
      keymap: defaultKeymap({ player: '01' }),
      input: defaultInput(),
      movement: defaultMovement({ entityType: 'player' }),
      sprite: player,
    };

    this.entities.set(playerEntity.entityId, playerEntity);
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
    this.movementSystem.update({ entities: this.entities });
  }
}
