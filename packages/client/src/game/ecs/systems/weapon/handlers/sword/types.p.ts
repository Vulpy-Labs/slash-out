import { StateComponent } from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

type SwordWeaponSystemHandlerUpdateProp = {
  entity: GlobalEntity;
  entities?: GlobalEntityMap;
};

type ValidSwordWeaponEntity = GlobalEntity & {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
};

export type { SwordWeaponSystemHandlerUpdateProp, ValidSwordWeaponEntity };
