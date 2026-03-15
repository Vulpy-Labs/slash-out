import { ConflictingActionsMap } from './type.t';

const CONFLICTING_ACTIONS: ConflictingActionsMap = [
  { actionA: 'up', actionB: 'down' },
  { actionA: 'left', actionB: 'right' },
] as const;

export { CONFLICTING_ACTIONS };
