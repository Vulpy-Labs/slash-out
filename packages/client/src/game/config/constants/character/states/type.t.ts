import { CHARACTER_STATE } from './characterStates';

type CharacterState = (typeof CHARACTER_STATE)[keyof typeof CHARACTER_STATE];

export type { CharacterState };
