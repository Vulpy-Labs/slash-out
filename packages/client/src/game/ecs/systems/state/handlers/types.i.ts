import { GlobalEntity } from '@/ecs/entities';

interface IEntityStateHandler {
  update({ entity }: { entity: GlobalEntity }): void;
}

export type { IEntityStateHandler };
