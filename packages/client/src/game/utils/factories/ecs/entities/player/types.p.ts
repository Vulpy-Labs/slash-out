import { GlobalEntityMap } from '@/scenes/game';

type CharacterNames = 'hayao' | 'hiroshige' | 'habuki' | 'kurosawa' | 'otomo';

type PlayerFactoryProp = {
  scene: Phaser.Scene;
  entities: GlobalEntityMap;
  x: number;
  y: number;
  characterName: CharacterNames;
  keymapFor: '01' | '02';
};

type GetPlayerIdProp = {
  entities: GlobalEntityMap;
};

type loadCharacterSpritesProp = {
  name: CharacterNames;
  scene: Phaser.Scene;
  version: 'v1' | 'v2' | 'v3';
};

export type { PlayerFactoryProp, GetPlayerIdProp, loadCharacterSpritesProp };
