import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

type CollisionHandleProp = {
  affected: GlobalEntity;
  collider: GlobalEntity;
  entities: GlobalEntityMap;
};

interface ICollisionSystemHandler {
  handle({ affected, collider, entities }: CollisionHandleProp): void;
}

export type { CollisionHandleProp, ICollisionSystemHandler };
