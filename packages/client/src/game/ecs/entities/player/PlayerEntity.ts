import {
  AnimationComponent,
  CharacterComponent,
  InputComponent,
  KeymapComponent,
  MovementComponent,
} from '@/ecs/components';
import { BaseEntity } from '../base';

interface PlayerEntity extends BaseEntity {
  keymap: KeymapComponent;
  input: InputComponent;
  movement: MovementComponent;
  character: CharacterComponent;
  animation: AnimationComponent;
  sprite: Phaser.Physics.Matter.Sprite;
}

export type { PlayerEntity };
