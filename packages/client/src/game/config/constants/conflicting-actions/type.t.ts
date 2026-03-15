import { PossibleActions } from '../possible-actions';
import { CONFLICTING_ACTIONS } from './conflictingActions';

type ConflictingActionsMap = { actionA: PossibleActions; actionB: PossibleActions }[];

type ConflictingActions = (typeof CONFLICTING_ACTIONS)[number];

export type { ConflictingActionsMap, ConflictingActions };
