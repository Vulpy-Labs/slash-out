import { GlobalEntity } from '@/ecs/entities';

export interface IWeaponHandler {
  load({ scene }: { scene: Phaser.Scene }): void;
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
  }): GlobalEntity;
}
