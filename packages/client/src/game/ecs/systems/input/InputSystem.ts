import { CONFLICTING_ACTIONS, PossibleActions } from '@/config/constants';
import { InputSystemUpdateProps } from './types.p';

class InputSystem {
  update({ entities }: InputSystemUpdateProps) {
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
