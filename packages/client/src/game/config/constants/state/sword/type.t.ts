import { SWORD_STATE } from './swordState';

type SwordState = (typeof SWORD_STATE)[keyof typeof SWORD_STATE];

export type { SwordState };
