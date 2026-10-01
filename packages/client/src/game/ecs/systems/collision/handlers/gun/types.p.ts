import {
  AnimationComponent,
  MovementComponent,
  StateComponent,
  VelocityComponent,
} from '@/ecs/components';
import { GlobalEntity } from '@/ecs/entities';

type ValidGunCollisionEntity = GlobalEntity & {
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
  movement: MovementComponent;
  animation?: AnimationComponent;
  velocity?: VelocityComponent;
};

type GunCollisionDeactivateProp = {
  bullet: ValidGunCollisionEntity;
};

type GunCollisionDeflectProp = {
  bullet: ValidGunCollisionEntity;
  owner: GlobalEntity;
};

type PopulateDeflectDirectionProp = {
  owner: GlobalEntity;
};

type IsActiveSwordProp = {
  collider: GlobalEntity;
};

type IsBulletClashProp = {
  affected: ValidGunCollisionEntity;
  collider: GlobalEntity;
};

type IsPlayerProp = {
  collider: GlobalEntity;
};

export type {
  ValidGunCollisionEntity,
  GunCollisionDeactivateProp,
  GunCollisionDeflectProp,
  PopulateDeflectDirectionProp,
  IsActiveSwordProp,
  IsBulletClashProp,
  IsPlayerProp,
};
