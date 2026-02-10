import {
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
}

export type { PlayerEntity };
