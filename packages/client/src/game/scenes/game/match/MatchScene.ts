import { MatchConfig } from '@/ecs/components';
import { InputSystem, KeymapSystem } from '@/ecs/systems';
import { GlobalEntityMap } from './type.i';
import { defaultInput, defaultKeymap } from '@/utils/factories/ecs/components';
import { MovementFactory } from '@/utils/factories/ecs/components/movement';

export class MatchScene extends Phaser.Scene {
  private matchConfig?: MatchConfig;

  private movementFactory: MovementFactory;

  private entities: GlobalEntityMap = new Map();

  private keymapSystem: KeymapSystem;
  private inputSystem: InputSystem;

  // Handle Super
  constructor() {
    super('MatchScene');
  }

  // Initialize Classes
  init(data: MatchConfig) {
    this.matchConfig = data;

    this.initFactories();
  }

  initFactories() {
    this.movementFactory = new MovementFactory();
  }

  // Create Elements
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
      input: defaultInput(),
      movement: this.movementFactory.getDefaultMovement(),
    };

    console.log('fakeEntity', fakeEntity);

    this.entities.set(fakeEntity.entityId, fakeEntity);
  }

  createSystems() {
    this.keymapSystem = new KeymapSystem({ scene: this });
    this.inputSystem = new InputSystem({ scene: this });
  }

  createKeyboardInputs() {
    this.keymapSystem.createPhaserListeners({ entities: this.entities });
  }

  update() {
    this.inputSystem.update({ entities: this.entities });
  }
}
