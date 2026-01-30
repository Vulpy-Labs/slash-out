import { CHARACTER_NAMES } from '@/config/constants';

interface CharacterComponent {
  skin: 'v1' | 'v2' | 'v3';
  name: (typeof CHARACTER_NAMES)[number];
  sprite?: Phaser.Physics.Matter.Sprite;
}

export type { CharacterComponent };
