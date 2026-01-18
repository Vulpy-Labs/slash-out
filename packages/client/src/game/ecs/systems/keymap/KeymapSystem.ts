import { AddPhaserListenersToKeymapProp, KeymapSystemProp } from './types.p';

class KeymapSystem {
  private scene: Phaser.Scene;

  constructor({ scene }: KeymapSystemProp) {
    if (!scene) throw new Error('scene not found');

    this.scene = scene;
  }

  addPhaserListenersToKeymap({ entities }: AddPhaserListenersToKeymapProp) {
    const phaserKeyboard = this.scene.input.keyboard;

    if (!phaserKeyboard || !(entities instanceof Map) || !entities.size) return;

    entities.forEach(({ keymap }) => {
      if (!keymap) return;

      for (const [action, button] of Object.entries(keymap)) {
        keymap[action as keyof typeof keymap] = phaserKeyboard.addKey(button);
      }
    });
  }
}

export { KeymapSystem };
