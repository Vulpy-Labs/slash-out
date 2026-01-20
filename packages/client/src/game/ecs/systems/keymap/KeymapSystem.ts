import { KeymapComponent } from '@/ecs/components';
import { CreatePhaserListenersProp, KeymapSystemProp } from './types.p';

class KeymapSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: KeymapSystemProp) {
    if (!scene) throw new Error('scene parameter is missing or invalid');

    this.scene = scene;
  }

  createPhaserListeners({ entities }: CreatePhaserListenersProp) {
    const phaserKeyboard = this.scene.input.keyboard;

    if (!phaserKeyboard || !(entities instanceof Map) || !entities.size) return;

    entities.forEach(({ keymap }) => {
      if (!keymap || !keymap?.codes) return;

      for (const action in keymap.codes) {
        const actionKeyCode = keymap.codes[action as keyof KeymapComponent['codes']];

        keymap.listeners[action as keyof KeymapComponent['listeners']] =
          phaserKeyboard.addKey(actionKeyCode);
      }
    });
  }
}

export { KeymapSystem };
