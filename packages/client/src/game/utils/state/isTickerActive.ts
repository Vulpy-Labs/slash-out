import { IsTickerActiveProp } from './types.p';

function isTickerActive({ state }: IsTickerActiveProp): boolean {
  return state.ticker !== undefined && state.ticker > 0;
}

export { isTickerActive };
