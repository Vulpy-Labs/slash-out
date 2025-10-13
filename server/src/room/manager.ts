import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { ACTIONS } from 'shared/types/player/events';

export class RoomManager extends Room {
  onCreate() {
    this.setState(new State());
    this.setPatchRate(50);

    this.onMessage(ACTIONS.PLAYER_MOVED, (client, data) => {
      console.log('🚀 Server - Received movement from', client.sessionId, data);

      const player = this.state.players.get(client.sessionId);
      if (player) {
        const oldX = player.x;
        const oldY = player.y;

        if (data.left) player.x -= 5;
        if (data.right) player.x += 5;

        console.log(
          `🚀 Server - Player ${client.sessionId} moved from (${oldX}, ${oldY}) to (${player.x}, ${player.y})`
        );
      } else {
        console.error('🚀 Server - Player not found:', client.sessionId);
      }
    });
  }

  onJoin(client: Client) {
    console.log('🚀 Server - onJoin called for:', client.sessionId);

    try {
      // Todo: () => extrair valores para shared.
      const mapWidth = 352;
      const mapHeight = 240;

      const player = new Player();
      player.x = Math.random() * mapWidth;
      player.y = Math.random() * mapHeight;

      console.log('🚀 Server - Created player:', player);
      console.log('🚀 Server - Adding to state.players...');

      this.state.players.set(client.sessionId, player);

      console.log('🚀 Server - Player added:', player);
      console.log('🚀 Server - Players count after add:', this.state.players.size);
      console.log('🚀 Server - All players:', Array.from(this.state.players.keys()));

      const message = {
        sessionId: client.sessionId,
        player: {
          x: player.x,
          y: player.y,
        },
      };

      console.log('🚀 ~ RoomManager ~ onJoin ~ message:', message);

      this.broadcast(CREATION.PLAYER_JOINED, message);
    } catch (error) {
      console.error('🚀 Server - Error in onJoin:', error);
    }
  }

  onLeave(client: Client, consented: boolean) {
    logger.warn(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }
}
