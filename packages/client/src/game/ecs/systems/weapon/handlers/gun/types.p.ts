import { StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

type GunWeaponSystemHandlerUpdateProp = {
  entity: GlobalEntity;
  entities?: GlobalEntityMap;
};

type ValidGunWeaponEntity = GlobalEntity & {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type { GunWeaponSystemHandlerUpdateProp, ValidGunWeaponEntity };
