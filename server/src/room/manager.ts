import { Client, logger, Room } from 'colyseus';
import { Player, State } from './state';

export class RoomManager extends Room {
  onCreate(options: any) {
    this.setState(new State());
  }

  onJoin(client: Client, options: any) {
    logger.info(client.sessionId, 'joined!');

    const mapWidth = 800;
    const mapHeight = 600;

    const player = new Player();
    player.x = Math.random() * mapWidth;
    player.y = Math.random() * mapHeight;

    console.log('🚀 ~ RoomManager ~ onJoin ~ player:', player);
    console.log('🚀 ~ RoomManager ~ onJoin ~ client.sessionId:', client.sessionId);

    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    logger.warn(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }
}
