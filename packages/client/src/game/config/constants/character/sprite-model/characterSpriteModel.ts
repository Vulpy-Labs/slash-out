import { CHARACTER_NAMES } from '../name';
import { SpriteConfig } from './type.t';

const BASE_CHARACTER_SPRITES: SpriteConfig[] = [
  { key: 'IDLE', spriteName: 'spr_idle', frameRate: 7, repeat: true, start: 0, end: 0 },
  { key: 'HEAD', spriteName: 'spr_head', frameRate: 7, repeat: false, start: 0, end: 0 },
  { key: 'DEAD', spriteName: 'spr_dead', frameRate: 6, repeat: false, start: 0, end: 1 },
  { key: 'SLICING', spriteName: 'spr_slice', frameRate: 7, repeat: true, start: 0, end: 0 },
  { key: 'JUMPING', spriteName: 'spr_jump', frameRate: 12, repeat: false, start: 1, end: 2 },
  { key: 'RUNNING', spriteName: 'spr_running', frameRate: 6, repeat: true, start: 0, end: 1 },
  { key: 'LOOKING_UP', spriteName: 'spr_lookup', frameRate: 7, repeat: true, start: 0, end: 0 },
  { key: 'LOOKING_DOWN', spriteName: 'spr_lookdown', frameRate: 7, repeat: true, start: 0, end: 0 },
  {
    key: 'DEAD_NO_HEAD',
    spriteName: 'spr_deadnohead',
    frameRate: 6,
    repeat: false,
    start: 0,
    end: 1,
  },
  {
    key: 'SHORT_ATTACKING_FORWARD',
    spriteName: 'spr_shortattack',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: 'SHORT_ATTACKING_UP',
    spriteName: 'spr_shortattackup',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: 'SHORT_ATTACKING_DOWN',
    spriteName: 'spr_shortattackdown',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: 'LONG_ATTACKING_FORWARD',
    spriteName: 'spr_longattack',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: 'LONG_ATTACKING_UP',
    spriteName: 'spr_longattackup',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: 'LONG_ATTACKING_DOWN',
    spriteName: 'spr_longattackdown',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
];

type CharacterName = (typeof CHARACTER_NAMES)[number];

const CHARACTER_OVERRIDES: Partial<Record<CharacterName, SpriteConfig[]>> = {};

const CHARACTERS_SPRITES_MODEL: Record<CharacterName, SpriteConfig[]> = Object.fromEntries(
  CHARACTER_NAMES.map(name => [name, CHARACTER_OVERRIDES[name] ?? BASE_CHARACTER_SPRITES])
) as Record<CharacterName, SpriteConfig[]>;

export { CHARACTERS_SPRITES_MODEL };
