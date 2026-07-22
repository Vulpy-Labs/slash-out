import { AnimationComponent, InputComponent, KeymapComponent, StateComponent } from '@/ecs/components';
import { BaseEntity } from '../base';

interface SwordEntity extends BaseEntity {
  keymap: KeymapComponent;
  input: InputComponent;
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
  animation: AnimationComponent;
}

export type { SwordEntity };
