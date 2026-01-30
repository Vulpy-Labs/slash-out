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

const CHARACTER_OVERRIDES: Partial<Record<string, SpriteConfig[]>> = {};

const CHARACTERS_SPRITES_MODEL = {
  hayao: CHARACTER_OVERRIDES.hayao ?? BASE_CHARACTER_SPRITES,
  hiroshige: CHARACTER_OVERRIDES.hiroshige ?? BASE_CHARACTER_SPRITES,
  habuki: CHARACTER_OVERRIDES.habuki ?? BASE_CHARACTER_SPRITES,
  kurosawa: CHARACTER_OVERRIDES.kurosawa ?? BASE_CHARACTER_SPRITES,
  otomo: CHARACTER_OVERRIDES.otomo ?? BASE_CHARACTER_SPRITES,
} as const;

export { CHARACTERS_SPRITES_MODEL };
