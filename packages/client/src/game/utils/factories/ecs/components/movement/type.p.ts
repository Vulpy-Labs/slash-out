import { MOVEMENT_MAPPING } from '@/config/constants';

type DefaultMovementProp = {
  entityType: keyof typeof MOVEMENT_MAPPING;
};

export type { DefaultMovementProp };
