import { SpriteConfig } from './type.t';

const BASE_CHARACTER_SPRITES: SpriteConfig[] = [
  { isSpritesheet: true, spriteName: 'spr_dead' },
  { isSpritesheet: true, spriteName: 'spr_deadnohead' },
  { isSpritesheet: true, spriteName: 'spr_running' },
  { isSpritesheet: true, spriteName: 'spr_jump' },
  { isSpritesheet: false, spriteName: 'spr_head' },
  { isSpritesheet: false, spriteName: 'spr_idle' },
  { isSpritesheet: false, spriteName: 'spr_longattack' },
  { isSpritesheet: false, spriteName: 'spr_longattackdown' },
  { isSpritesheet: false, spriteName: 'spr_longattackup' },
  { isSpritesheet: false, spriteName: 'spr_lookdown' },
  { isSpritesheet: false, spriteName: 'spr_lookup' },
  { isSpritesheet: false, spriteName: 'spr_shortattack' },
  { isSpritesheet: false, spriteName: 'spr_shortattackdown' },
  { isSpritesheet: false, spriteName: 'spr_shortattackup' },
  { isSpritesheet: false, spriteName: 'spr_slice' },
];

const CHARACTER_NAMES = ['hayao', 'hiroshige', 'habuki', 'kurosawa', 'otomo'] as const;
type CharacterName = (typeof CHARACTER_NAMES)[number];

const CHARACTER_OVERRIDES: Partial<Record<CharacterName, SpriteConfig[]>> = {};

const CHARACTERS_SPRITES_MODEL: Record<CharacterName, SpriteConfig[]> = Object.fromEntries(
  CHARACTER_NAMES.map(name => [name, CHARACTER_OVERRIDES[name] ?? BASE_CHARACTER_SPRITES])
) as Record<CharacterName, SpriteConfig[]>;
export { CHARACTERS_SPRITES_MODEL };
