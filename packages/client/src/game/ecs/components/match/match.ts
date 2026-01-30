import { MatchConfigCharacter } from './character-config';

interface MatchConfig {
  mapName: string;
  players: {
    quantity: number;
    characters: MatchConfigCharacter[];
  };
}

export type { MatchConfig };
