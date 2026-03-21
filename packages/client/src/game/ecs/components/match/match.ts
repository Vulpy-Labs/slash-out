import { MatchConfigCharacter } from './character-config';

type MatchConfigPlayers = {
  characters: MatchConfigCharacter[];
};

interface MatchConfig {
  mapName: string;
  players: MatchConfigPlayers;
}

export type { MatchConfig, MatchConfigPlayers };
