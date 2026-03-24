import { ALIVE_STATE } from './alive';

type AliveState = (typeof ALIVE_STATE)[keyof typeof ALIVE_STATE];

export type { AliveState };
