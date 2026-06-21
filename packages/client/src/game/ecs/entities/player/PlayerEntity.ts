// PR - 3
import {
  AnimationComponent,
  CharacterComponent,
  InputComponent,
  KeymapComponent,
  MovementComponent,
  StateComponent,
  EquipmentComponent,
} from '@/ecs/components';
import { BaseEntity } from '../base';

interface PlayerEntity extends BaseEntity {
  keymap: KeymapComponent;
  input: InputComponent;
  movement: MovementComponent;
  character: CharacterComponent;
  animation: AnimationComponent;
  state: StateComponent;
  equipment?: EquipmentComponent;
  sprite: Phaser.Physics.Matter.Sprite;
}

export type { PlayerEntity };
