import { KeymapComponent, MatchConfig } from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
}

interface GlobalEntity extends BaseEntity, AllComponentsList {}

type GlobalEntityMap = Map<string, GlobalEntity>;

export type { GlobalEntityMap };
