import { ENTITY_TYPES } from '../../entity-types';
import { GUN_MOVEMENT } from '../gun';
import { PLAYER_MOVEMENT } from '../player';

const MOVEMENT_MAPPING = {
  [ENTITY_TYPES.PLAYER]: PLAYER_MOVEMENT,
  [ENTITY_TYPES.GUN]: GUN_MOVEMENT,
} as const;

export { MOVEMENT_MAPPING };
