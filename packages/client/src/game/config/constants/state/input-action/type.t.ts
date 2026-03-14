import { INPUT_ACTION } from './input-action';

type InputAction = (typeof INPUT_ACTION)[keyof typeof INPUT_ACTION];

export type { InputAction };
