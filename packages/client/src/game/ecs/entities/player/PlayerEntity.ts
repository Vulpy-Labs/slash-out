import {
  AnimationComponent,
  CharacterComponent,
  InputComponent,
  KeymapComponent,
  MovementComponent,
  StateComponent,
} from '@/ecs/components';
import { BaseEntity } from '../base';

interface PlayerEntity extends BaseEntity {
  keymap: KeymapComponent;
  input: InputComponent;
  movement: MovementComponent;
  character: CharacterComponent;
  animation: AnimationComponent;
  state: StateComponent;
  sprite: Phaser.Physics.Matter.Sprite;
}

export type { PlayerEntity };
