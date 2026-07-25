import { GlobalEntity } from '@/ecs/entities';
import { GlobalEntityMap } from '@/scenes/game';

interface IWeaponSystemHandler {
  update({ entity, entities }: { entity: GlobalEntity; entities?: GlobalEntityMap }): void;
}

export type { IWeaponSystemHandler };
