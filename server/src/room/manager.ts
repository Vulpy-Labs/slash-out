import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { ACTIONS } from 'shared/types/player/events';

export class RoomManager extends Room {
  onCreate() {
    const state = new State();
    this.setState(state);
    this.setPatchRate(8);
  }

  onJoin(client: Client) {
    console.log('🚀 Server - onJoin called for:', client.sessionId);

    try {
      // Todo: () => extrair valores para shared.
      const mapWidth = 352;
      const mapHeight = 240;
      const playerId = client.sessionId;

      const player = new Player();
      player.x = Math.random() * mapWidth;
      player.y = mapHeight - 25;

      this.state.players.set(playerId, player);

      logger.info(`Player ${playerId} added successfully!`);

      this.setupClientMessagesListeners();
    } catch (error) {
      console.error('🚀 Server - Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }

  setupClientMessagesListeners() {
    this.onMessage(ACTIONS.PLAYER_MOVED, (client, payload) => {
      logger.info('Player Moved!');

      const player = this.state.players.get(client.sessionId);
      logger.info('player:', player.x);
      logger.info('player:', player.y);

      if (payload.left) player.x -= 1;
      if (payload.right) player.x += 1;
      if (payload.jump) player.y -= 5;
    });
  }
}
