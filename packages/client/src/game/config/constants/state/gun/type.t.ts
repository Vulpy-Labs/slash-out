import { GUN_STATE } from './gunState';

type GunState = (typeof GUN_STATE)[keyof typeof GUN_STATE];

export type { GunState };
