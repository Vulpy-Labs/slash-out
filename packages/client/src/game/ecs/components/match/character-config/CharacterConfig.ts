import { CharacterComponent } from '@/ecs/components';

interface MatchConfigCharacter {
  playerRef: '01' | '02';
  name: CharacterComponent['name'];
  skin: CharacterComponent['skin'];
}

export type { MatchConfigCharacter };
