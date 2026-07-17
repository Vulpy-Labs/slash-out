import { DEPTH, ENTITY_TYPES, SWORD } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
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
    x,
    y,
    ownerEntityId,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    ownerEntityId: string;
  }): GlobalEntity {
    const sprite = scene.matter.add.sprite(x, y, 'spr_sword_0');

    sprite.setDisplaySize(SWORD.CONFIG.WIDTH, SWORD.CONFIG.HEIGHT);
    sprite.setOrigin(SWORD.CONFIG.ORIGIN_X, SWORD.CONFIG.ORIGIN_Y);
    sprite.setBody({
      type: 'rectangle',
      width: SWORD.CONFIG.WIDTH,
      height: SWORD.CONFIG.HEIGHT,
    });

    sprite.setSensor(true);
    sprite.setIgnoreGravity(true);
    sprite.setDepth(DEPTH.ENTITIES);

    return {
      entityId: `sword_${ownerEntityId}`,
      entityType: ENTITY_TYPES.SWORD,
      sprite,
      state: { current: 'idle' },
    };
  }
}
