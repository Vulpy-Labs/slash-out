import { MOBILITY } from './mobility';

type Mobility = (typeof MOBILITY)[keyof typeof MOBILITY];

export type { Mobility };
