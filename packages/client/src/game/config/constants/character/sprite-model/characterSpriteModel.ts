import { CHARACTER_NAMES } from '../name';
import { CHARACTER_STATE } from '../states';
import { SpriteConfig } from './type.t';

const BASE_CHARACTER_SPRITES: SpriteConfig[] = [
  {
    key: CHARACTER_STATE.IDLE,
    spriteName: 'spr_idle',
    frameRate: 7,
    repeat: true,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.HEAD,
    spriteName: 'spr_head',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.DEAD,
    spriteName: 'spr_dead',
    frameRate: 6,
    repeat: false,
    start: 0,
    end: 1,
  },
  {
    key: CHARACTER_STATE.RUN,
    spriteName: 'spr_running',
    frameRate: 6,
    repeat: true,
    start: 0,
    end: 1,
  },
  {
    key: CHARACTER_STATE.JUMP,
    spriteName: 'spr_jump',
    frameRate: 12,
    repeat: false,
    start: 1,
    end: 2,
  },
  {
    key: CHARACTER_STATE.SLICE,
    spriteName: 'spr_slice',
    frameRate: 7,
    repeat: true,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.LOOK_UP,
    spriteName: 'spr_lookup',
    frameRate: 7,
    repeat: true,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.LOOK_DOWN,
    spriteName: 'spr_lookdown',
    frameRate: 7,
    repeat: true,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.DEAD_NO_HEAD,
    spriteName: 'spr_deadnohead',
    frameRate: 6,
    repeat: false,
    start: 0,
    end: 1,
  },
  {
    key: CHARACTER_STATE.SHORT_ATTACK_FORWARD,
    spriteName: 'spr_shortattack',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.SHORT_ATTACK_UP,
    spriteName: 'spr_shortattackup',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.SHORT_ATTACK_DOWN,
    spriteName: 'spr_shortattackdown',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.LONG_ATTACK_FORWARD,
    spriteName: 'spr_longattack',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.LONG_ATTACK_UP,
    spriteName: 'spr_longattackup',
    frameRate: 7,
    repeat: false,
    start: 0,
    end: 0,
  },
  {
    key: CHARACTER_STATE.LONG_ATTACK_DOWN,
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
