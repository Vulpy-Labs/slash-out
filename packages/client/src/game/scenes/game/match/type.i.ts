import {
  MatchConfig,
  InputComponent,
  KeymapComponent,
  MovementComponent,
  VelocityComponent,
} from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
  input?: InputComponent;
  movement?: MovementComponent;
  velocity?: VelocityComponent;
}

interface GlobalEntity extends BaseEntity, AllComponentsList {}

type GlobalEntityMap = Map<string, GlobalEntity>;

export type { GlobalEntityMap };
