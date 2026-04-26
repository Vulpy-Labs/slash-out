import type { EntityTypes } from '@/config/constants';

interface BaseEntity {
  entityId: string;
  entityType: EntityTypes;
  sprite?: Phaser.Physics.Matter.Sprite;
}

export type { BaseEntity };
