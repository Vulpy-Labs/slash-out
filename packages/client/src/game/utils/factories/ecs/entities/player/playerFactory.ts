import { PlayerEntity } from '@/ecs/entities/player';
import { GetPlayerIdProp, PlayerFactoryProp } from './types.p';
import { defaultInput, defaultKeymap, defaultMovement } from '../../components';

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
  defaultSprite,
  keymapFor,
}: PlayerFactoryProp): PlayerEntity {
  const playerSprite = scene.matter.add.sprite(x, y, defaultSprite, undefined);
  const playerId = getPlayerId({ entities });

  // Todo: () => checar outras possíveis modificações no código

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

export { playerFactory };
