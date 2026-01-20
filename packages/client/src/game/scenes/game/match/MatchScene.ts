import { MatchConfig } from '@/ecs/components';
import { KeymapSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';
import { defaultKeymap } from '@/utils/factories/ecs/components';

export class MatchScene extends Phaser.Scene {
  private matchConfig?: MatchConfig;

  private entities: GlobalEntityMap = new Map();

  private keymapSystem: KeymapSystem;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;
  }

  create() {
    this.createECS();
    this.createKeyboardInputs();
  }

  createECS() {
    this.createEntities();
    this.createSystems();
  }

  createEntities() {
    this.createFakePlayer();
  }

  createFakePlayer() {
    const fakeEntity = {
      entityId: 'player_01',
      keymap: defaultKeymap({ player: '01' }),
    };

    this.entities.set(fakeEntity.entityId, fakeEntity);
  }

  createSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }
}
