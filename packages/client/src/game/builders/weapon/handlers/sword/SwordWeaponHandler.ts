import { DEPTH, ENTITY_TYPES, SWORD, SWORD_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import {
  defaultInput,
  defaultKeymap,
  defaultSwordAnimation,
} from '@/utils/factories/ecs/components';
import { IWeaponHandler } from '../types.i';

export class SwordWeaponHandler implements IWeaponHandler {
  load({ scene }: { scene: Phaser.Scene }): void {
    for (let i = 0; i < 5; i++) {
      const key = `spr_sword_${i}`;
      const url = `assets/sprites/combat/melee/spr_sword/spr_sword_${i}.png`;
      if (!scene.textures.exists(key)) {
        scene.load.image(key, url);
      }
    }
  }

  build({
    scene,
    ownerEntityId,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    ownerEntityId: string;
  }): GlobalEntity {
    const sprite = scene.matter.add.sprite(-9999, -9999, 'spr_sword_0');

    sprite.setDisplaySize(SWORD.CONFIG.WIDTH, SWORD.CONFIG.HEIGHT);
    sprite.setOrigin(SWORD.CONFIG.ORIGIN_X, SWORD.CONFIG.ORIGIN_Y);
    sprite.setBody({
      type: 'rectangle',
      width: SWORD.CONFIG.WIDTH,
      height: SWORD.CONFIG.HEIGHT,
    });

    sprite.setSensor(true);
    sprite.setIgnoreGravity(true);
    sprite.setVisible(false);
    sprite.setDepth(DEPTH.ENTITIES);

    const playerRef = ownerEntityId.includes('02') ? '02' : '01';

    return {
      entityId: `sword_${ownerEntityId}`,
      entityType: ENTITY_TYPES.SWORD,
      sprite,
      state: { current: SWORD_STATE.IDLE },
      input: defaultInput(),
      keymap: defaultKeymap({ player: playerRef }),
      animation: defaultSwordAnimation(),
    };
  }
}
