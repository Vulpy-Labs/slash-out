import { ENTITY_TYPES } from './entityTypes';

type DeepValues<T> = T extends string ? T : T extends object ? DeepValues<T[keyof T]> : never;

type EntityTypes = DeepValues<typeof ENTITY_TYPES>;

export type { EntityTypes };
