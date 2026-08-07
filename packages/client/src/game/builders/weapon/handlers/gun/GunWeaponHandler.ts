import { BULLET, DEPTH, ENTITY_TYPES, GUN_STATE } from '@/config/constants';
import { GlobalEntity } from '@/ecs/entities';
import { defaultMovement } from '@/utils/factories/ecs/components';
import { IWeaponHandler } from '../types.i';

export class GunWeaponHandler implements IWeaponHandler {
  load({ scene }: { scene: Phaser.Scene }): void {
    for (let i = 0; i < 2; i++) {
      const key = `spr_bullet_${i}`;
      const url = `assets/sprites/combat/range/spr_bullet/spr_bullet_${i}.png`;
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
    const sprite = scene.matter.add.sprite(-9999, -9999, 'spr_bullet_0');

    sprite.setDisplaySize(BULLET.CONFIG.WIDTH, BULLET.CONFIG.HEIGHT);
    sprite.setOrigin(BULLET.CONFIG.ORIGIN_X, BULLET.CONFIG.ORIGIN_Y);
    sprite.setBody({
      type: 'rectangle',
      width: BULLET.CONFIG.WIDTH,
      height: BULLET.CONFIG.HEIGHT,
    });

    sprite.setIgnoreGravity(true);
    sprite.setVisible(false);
    sprite.setDepth(DEPTH.ENTITIES);

    return {
      entityId: `gun_${ownerEntityId}`,
      ownerEntityId,
      entityType: ENTITY_TYPES.GUN,
      sprite,
      state: { current: GUN_STATE.IDLE },
      movement: defaultMovement({ entityType: ENTITY_TYPES.GUN }),
      velocity: { vx: 0, vy: 0 },
    };
  }
}
