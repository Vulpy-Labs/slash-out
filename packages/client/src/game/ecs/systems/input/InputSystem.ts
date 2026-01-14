import { Player } from '../../../ecs/entities/player';

// Possible inputs
type InputActions = {
  left: string;
  right: string;
  up: string;
  down: string;
  jump: string;
  dash: string;
  sword: string;
  gun: string;
};

// Phaser Inputs
type InputActionsPhaser = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
  dash: Phaser.Input.Keyboard.Key;
  sword: Phaser.Input.Keyboard.Key;
  gun: Phaser.Input.Keyboard.Key;
};

type EntityTypes = Player;

export class InputSystem {
  private scene: Phaser.Scene;
  // Map for all the possible Phaser's keys for each player
  private entitiesInput: Map<string, InputActionsPhaser>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.entitiesInput = new Map();
  }

  // Todo: () => create an unified type with all entities
  createInputs(entity: EntityTypes, keys: InputActions) {
    if (!entity.input) return;

    const phaserKeyboard = this.scene.input.keyboard;

    if (!phaserKeyboard) return;

    this.entitiesInput.set(entity.entityId, {
      left: phaserKeyboard.addKey(keys.left),
      right: phaserKeyboard.addKey(keys.right),
      up: phaserKeyboard.addKey(keys.up),
      down: phaserKeyboard.addKey(keys.down),
      jump: phaserKeyboard.addKey(keys.jump),
      dash: phaserKeyboard.addKey(keys.dash),
      sword: phaserKeyboard.addKey(keys.sword),
      gun: phaserKeyboard.addKey(keys.gun),
    });

    return this.entitiesInput.get(entity.entityId);
  }

  update() {
    this.entitiesInput.forEach(entity => {
      if (entity.left.isDown) console.log('left.isDown', entity.left.isDown);
      if (entity.right.isDown) console.log('right.isDown', entity.right.isDown);
      if (entity.up.isDown) console.log('up.isDown', entity.up.isDown);
      if (entity.down.isDown) console.log('down.isDown', entity.down.isDown);
      if (entity.jump.isDown) console.log('jump.isDown', entity.jump.isDown);
      if (entity.dash.isDown) console.log('dash.isDown', entity.dash.isDown);
      if (entity.sword.isDown) console.log('sword.isDown', entity.sword.isDown);
      if (entity.gun.isDown) console.log('gun.isDown', entity.gun.isDown);
    });
  }
}
