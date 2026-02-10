import { CharacterComponent } from '@/ecs/components/character';

interface MatchConfigCharacter {
  playerRef: '01' | '02';
  name: CharacterComponent['name'];
  skin: CharacterComponent['skin'];
}

export type { MatchConfigCharacter };
