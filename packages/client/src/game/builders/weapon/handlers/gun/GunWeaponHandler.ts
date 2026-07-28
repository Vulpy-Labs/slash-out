import { GlobalEntity } from '@/ecs/entities';
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

  build(): GlobalEntity {
    throw new Error('Method not implemented.');
  }
}
