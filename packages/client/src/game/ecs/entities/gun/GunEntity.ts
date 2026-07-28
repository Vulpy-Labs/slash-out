import { InputComponent, KeymapComponent, StateComponent } from '@/ecs/components';
import { BaseEntity } from '../base';

interface GunEntity extends BaseEntity {
  keymap: KeymapComponent;
  input: InputComponent;
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
}

export type { GunEntity };
