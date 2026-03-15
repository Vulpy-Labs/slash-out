import { CONFLICTING_ACTIONS, PossibleActions } from '@/config/constants';
import { InputSystemProps, InputSystemUpdateProps } from './types.p';

class InputSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: InputSystemProps) {
    if (!scene) {
      throw new Error('scene parameter is missing or invalid');
    }

    this.scene = scene;
  }

  update({ entities }: InputSystemUpdateProps) {
    if (!(entities instanceof Map)) {
      throw new Error(`Entities is not a Map: ${typeof entities}`);
    }

    entities.forEach(({ keymap, input }) => {
      if (!keymap || !input) return;

      for (const [action, actionKeyListener] of Object.entries(keymap.listeners)) {
        if (!actionKeyListener) continue;

        input[action as PossibleActions] = actionKeyListener.isDown;
      }

      CONFLICTING_ACTIONS.forEach(({ actionA, actionB }) => {
        const actionAListener = keymap.listeners[actionA];
        const actionBListener = keymap.listeners[actionB];

        if (actionAListener?.isDown && actionBListener?.isDown) {
          if (actionAListener.timeDown > actionBListener.timeDown) input[actionB] = false;
          else input[actionA] = false;
        }
      });
    });
  }
}

export { InputSystem };
