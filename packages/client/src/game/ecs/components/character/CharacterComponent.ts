import { CHARACTER_NAMES, CHARACTER_SKINS } from '@/config/constants';

interface CharacterComponent {
  skin: (typeof CHARACTER_SKINS)[number];

  name: (typeof CHARACTER_NAMES)[number];



  sprite?: Phaser.Physics.Matter.Sprite;
}

export type { CharacterComponent };
