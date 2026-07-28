import type { EntityTypes } from '@/config/constants';

interface BaseEntity {
  entityId: string;
  entityType: EntityTypes;
  ownerEntityId?: string;
  sprite?: Phaser.Physics.Matter.Sprite;
}

export type { BaseEntity };
