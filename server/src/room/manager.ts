import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { SCENE } from 'shared/config/constants/scenes';

export class RoomManager extends Room {
  onCreate() {
    const state = new State();
    this.setState(state);
    this.setPatchRate(8);
  }

  onJoin(client: Client) {
    try {
      const mapWidth = SCENE.WIDTH;
      const mapHeight = SCENE.HEIGHT;
      const playerId = client.sessionId;

      const player = new Player();
      player.x = Math.random() * mapWidth;
      player.y = mapHeight - 25;

      this.state.players.set(playerId, player);

      logger.info(`Player ${playerId} added successfully!`);

      this.createClientMessagesListeners();
    } catch (error) {
      console.error('🚀 Server - Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }

  createClientMessagesListeners() {
    this.createMovementListeners();
  }

  createMovementListeners() {
    this.onMessage(PLAYER_ACTIONS.MOVED, (client, payload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) {
        logger.warn(`No player found for session ${client.sessionId}`);
        return;
      }

      if (payload.left) player.x -= 1;
      if (payload.right) player.x += 1;
      if (payload.jump) player.y -= 5;
    });
  }
}
