import { PossibleActions } from '../possible-actions';

type ConflictingActionsMap = ReadonlyArray<{ actionA: PossibleActions; actionB: PossibleActions }>;

export type { ConflictingActionsMap };
