import { DecrementStateTickerProp } from './types.p';

function decrementStateTicker({ state }: DecrementStateTickerProp): void {
  if (state.ticker !== undefined && state.ticker > 0) {
    state.ticker -= 1;
    if (state.ticker <= 0) {
      state.ticker = undefined;
    }
  }
}

export { decrementStateTicker };
