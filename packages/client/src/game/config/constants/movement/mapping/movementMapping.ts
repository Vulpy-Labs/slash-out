import { PLAYER_MOVEMENT } from '../player';
import { FALLBACK_MOVEMENT } from '../fallback';

const MOVEMENT_MAPPING = {
  player: PLAYER_MOVEMENT,
  fallback: FALLBACK_MOVEMENT,
} as const;

export { MOVEMENT_MAPPING };
