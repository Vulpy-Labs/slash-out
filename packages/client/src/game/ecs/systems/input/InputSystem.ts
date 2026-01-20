import { PossibleActions } from '@/config/constants';
import { InputSystemProps, InputSystemUpdateProps } from './types.p';

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

      for (const [action, actionKeyListener] of Object.entries(keymap.listeners)) {
        if (!actionKeyListener) return;

        input[action as PossibleActions] = actionKeyListener.isDown;
      }
    });
  }
}

export { InputSystem };
