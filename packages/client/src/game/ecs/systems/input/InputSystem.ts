import { InputSystemProps, InputSystemUpdateProps } from './types.p';

/**
 * Todo: (V) => create keyMap Component. Control the entity keys.
 * Todo: (V) => register entity keys in the scene (input.keyboard).
 * Todo: (V) => on every frame, check which keys are pressed.
 *
 * * This allows the possibility to check for key conflicts,
 * * because the keys are going to be stored in the entities.
 *
 * ? The config scene is also going to store the player's keys.
 * ? How are they going to relate?
 *
 * ! Hard to say. For now, focus on the use cases you have available.
 *
 * Separed Components for keyMap and input
 *
 * Entity = {
 *  entityId: 'player_01',
 *  keymap: {
 *    up: 'W',
 *    down: 'S',
 *    left: 'A',
 *    right: 'D',
 *  },
 *  input: {
 *    up: 'false',
 *    down: 'false',
 *    left: 'false',
 *    right: 'false',
 *    ...
 *  }
 * }
 *
 * OR
 *
 * Centralize both features in the Input Component?
 * Entity = {
 *  entityId: 'player_01',
 *  input: {
 *    keyMap: {
 *      up: 'W',
 *      down: 'S',
 *      left: 'A',
 *      right: 'D',
 *    },
 *    state: {
 *      up: 'false',
 *      down: 'false',
 *      left: 'false',
 *      right: 'false',
 *    }
 *  }
 * }
 */

class InputSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: InputSystemProps) {
    this.scene = scene;
  }

  update({ entities }: InputSystemUpdateProps) {
    if (!(entities instanceof Map)) {
      throw new Error(`Entites is not a Map: ${typeof entities}`);
    }

    entities.forEach(({ keymap, input }) => {
      if (!keymap || !input) return;

      for (const [action, phaserKey] of Object.entries(keymap)) {
        input[action] = phaserKey.isDown;
      }
    });
  }
}

export { InputSystem };
