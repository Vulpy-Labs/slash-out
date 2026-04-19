import { ENTITY_TYPES } from './entityTypes';

type EntityTypes = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

export type { EntityTypes };
