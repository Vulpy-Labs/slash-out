import { CHARACTER_NAMES, CHARACTER_SKINS } from '@/config/constants';

interface CharacterComponent {
  skin: (typeof CHARACTER_SKINS)[number];
  name: (typeof CHARACTER_NAMES)[number];
}

export type { CharacterComponent };
