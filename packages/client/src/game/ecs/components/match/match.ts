import { MatchConfigCharacter } from './character-config';

interface MatchConfig {
  mapName: string;
  players: {
    characters: MatchConfigCharacter[];
  };
}

export type { MatchConfig };
