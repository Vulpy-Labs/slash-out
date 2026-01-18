import { MatchConfig } from '@/ecs/components';
import { KeymapSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';
import { defaultKeymapP1 } from '@/utils/factories/ecs/components';

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
    const fakeEntity = {
      entityId: 'player_01',
      keymap: defaultKeymapP1(),
    };

    this.entities.set(fakeEntity.entityId, fakeEntity);
  }

  createSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
  }

  createKeyboardInputs() {
    this.keymapSystem.addPhaserListenersToKeymap({ entities: this.entities });
  }

  update() {}
  // const player1 = this.entities.get('player_01')!.keymap;
  // console.log(`up:${player1.up.isDown}|down:${player1.down.isDown}`);
}
