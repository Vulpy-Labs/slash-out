import { MatchConfig, InputComponent, KeymapComponent, MovementComponent } from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
  input?: InputComponent;
  movement?: MovementComponent;
}

interface GlobalEntity extends BaseEntity, AllComponentsList {}

type GlobalEntityMap = Map<string, GlobalEntity>;

export type { GlobalEntityMap };
