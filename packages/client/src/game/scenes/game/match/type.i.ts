import { KeymapComponent, MatchConfig } from '@/ecs/components';
import { BaseEntity } from '@/ecs/entities';

interface AllComponentsList {
  matchConfig?: MatchConfig;
  keymap?: KeymapComponent;
}

interface AllEntitiesList extends BaseEntity, AllComponentsList {}

type GlobalEntityMap = Map<string, AllEntitiesList>;

export type { GlobalEntityMap };
