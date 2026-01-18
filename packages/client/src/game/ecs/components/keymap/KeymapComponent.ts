type PossibleActions = 'left' | 'right' | 'up' | 'down' | 'jump' | 'dash' | 'sword' | 'gun';

type KeymapConfig = Record<PossibleActions, string>;

type KeymapRuntime = Record<PossibleActions, Phaser.Input.Keyboard.Key>;

type KeymapComponent = KeymapConfig | KeymapRuntime;

export type { KeymapComponent };
