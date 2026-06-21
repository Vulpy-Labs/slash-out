import { SWORD_STATES } from './swordStates';

type SwordState = (typeof SWORD_STATES)[keyof typeof SWORD_STATES];

export type { SwordState };
