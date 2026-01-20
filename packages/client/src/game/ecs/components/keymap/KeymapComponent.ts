import { PossibleActions } from '@/config/constants';

type KeymapCodes = Record<PossibleActions, string>;

type KeymapListeners = Record<PossibleActions, Phaser.Input.Keyboard.Key | null>;

interface KeymapComponent {
  codes: KeymapCodes;
  listeners: KeymapListeners;
}

export type { KeymapComponent };
