import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

interface IEntityStateHandler {
  update({ entity, entities }: { entity: GlobalEntity; entities?: GlobalEntityMap }): void;
}

export type { IEntityStateHandler };
