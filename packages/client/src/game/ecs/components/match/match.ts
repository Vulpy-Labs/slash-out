import { MatchConfigCharacter } from './character-config';
import { EquipmentComponent } from '../equipment';

type MatchConfigPlayers = {
  character: MatchConfigCharacter;
  equipment: EquipmentComponent;
}[];

interface MatchConfig {
  mapName: string;
  players: MatchConfigPlayers;
}

export type { MatchConfig, MatchConfigPlayers };
