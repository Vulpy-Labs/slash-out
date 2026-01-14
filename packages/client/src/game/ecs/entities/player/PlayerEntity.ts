import { createInputComponent } from '../../../ecs/components/input';
import { InputSystem } from '../../../ecs/systems/input/InputSystem';

import { Player } from './type.i';

export class PlayerEntity {
  private scene: Phaser.Scene;
  private players: Map<string, Player>;
  private inputSystem: InputSystem;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.players = new Map();
    this.inputSystem = new InputSystem(scene);
  }

  createPlayer(): Player {
    const entityId = 'player1';
    const body = this.scene.matter.add.rectangle(30, 100, 50, 50);
    body.ignoreGravity = true;

    const player = {
      entityId,
      body,
      input: createInputComponent({ entityId }),
    };

    this.players.set(entityId, player);
    this.createPlayerInputs(player);

    return player;
  }

  createPlayerInputs(player: Player) {
    // Todo: () => create function that adds inputs to an entity;
    // Todo: () => check if it's better to do that here or in the PlayerEntity/Factory;
    this.inputSystem.createInputs(player, this.getPlayerDefaultInputs());
  }

  getPlayerDefaultInputs() {
    return {
      left: 'A',
      right: 'D',
      up: 'W',
      down: 'S',
      jump: 'K',
      dash: 'L',
      sword: 'J',
      gun: 'I',
    };
  }

  update() {
    this.inputSystem.update();
  }
}
