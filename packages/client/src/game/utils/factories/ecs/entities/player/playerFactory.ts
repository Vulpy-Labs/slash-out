import { PlayerEntity } from '@/ecs/entities/player';
import { GetPlayerIdProp, loadCharacterSpritesProp, PlayerFactoryProp } from './types.p';
import { defaultInput, defaultKeymap, defaultMovement } from '../../components';

const CHARACTER_SPRITES = [
  'spr_dead',
  'spr_deadnohead',
  'spr_head',
  'spr_idle',
  'spr_jump',
  'spr_longattack',
  'spr_longattackdown',
  'spr_longattackup',
  'spr_lookdown',
  'spr_lookup',
  'spr_running',
  'spr_shortattack',
  'spr_shortattackdown',
  'spr_shortattackup',
  'spr_slice',
] as const;

function loadCharacterSprites({ name, scene, version }: loadCharacterSpritesProp) {
  CHARACTER_SPRITES.forEach(sprite => {
    scene.load.image({
      key: `${name}_${sprite}`,
      url: `/assets/sprites/characters/${name}/${version}/${sprite}.png`,
    });
  });
}

function getPlayerId({ entities }: GetPlayerIdProp) {
  let playersQuant = 0;

  entities.forEach(({ entityId }) => (entityId.startsWith('player_') ? playersQuant++ : null));

  return `player_${playersQuant + 1}`;
}

function playerFactory({
  scene,
  entities,
  x,
  y,
  characterName,
  keymapFor,
}: PlayerFactoryProp): PlayerEntity {
  const playerSprite = scene.matter.add.sprite(x, y, `${characterName}_spr_idle`, undefined);
  const playerId = getPlayerId({ entities });

  playerSprite.setFixedRotation();
  playerSprite.setFriction(0);

  const playerEntity: PlayerEntity = {
    entityId: playerId,
    sprite: playerSprite,
    keymap: defaultKeymap({ player: keymapFor }),
    input: defaultInput(),
    movement: defaultMovement({ entityType: 'player' }),
  };

  return playerEntity;
}

export { playerFactory, loadCharacterSprites };
