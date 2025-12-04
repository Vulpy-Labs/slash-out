import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { GAME } from 'shared/config/constants';

import { WorldPhysicsManager } from '@/physics/world/WorldPhysicsManager';
import { PlayerPhysicsManager } from '@/physics/player/PlayerPhysicsManager';
import { MapPhysicsManager } from '@/physics/maps/MapPhysicsManager';

export class RoomManager extends Room {
  private physicsWorld: WorldPhysicsManager;
  private physicsPlayerManager: PlayerPhysicsManager;
  private mapPhysicsManager: MapPhysicsManager;

  private accumulator: number = 0;

  onCreate() {
    logger.info('Trying to initiate room connection with client');

    this.setState(new State());
    this.setPatchRate(GAME.CONFIG.FIXED_TIME_STEP);

    this.physicsWorld = new WorldPhysicsManager();
    this.physicsPlayerManager = new PlayerPhysicsManager(this.physicsWorld);
    this.mapPhysicsManager = new MapPhysicsManager(this.physicsWorld);

    const platforms = this.mapPhysicsManager.loadPlatforms();
    this.physicsPlayerManager.setPlatformBodies(platforms);

    this.setSimulationInterval(deltaTime => this.update(deltaTime));
    this.setupClientMessagesListeners();
  }

  onJoin(client: Client) {
    logger.info('Player joined:', client.sessionId);

    try {
      this.createPlayer({ sessionId: client.sessionId });
    } catch (error) {
      logger.error('Error in onJoin:', error);
    }
  }

  onLeave(client: Client) {
    logger.warn(client.sessionId, 'left!');

    this.physicsPlayerManager.removePlayerBody(client.sessionId);

    this.state.players.delete(client.sessionId);
  }

  update(deltaTime: number) {
    this.accumulator += deltaTime;

    while (this.accumulator >= GAME.CONFIG.FIXED_TIME_STEP) {
      this.fixedUpdate();
      this.accumulator -= GAME.CONFIG.FIXED_TIME_STEP;
    }
  }

  fixedUpdate() {
    this.physicsWorld.step(GAME.CONFIG.FIXED_TIME_STEP);
    this.physicsPlayerManager.updateAllPlayers(this.state.players);
  }

  createPlayer({ sessionId }: { sessionId: string }) {
    const playerId = sessionId;

    try {
      const player = new Player();
      const spawnPos = PlayerPhysicsManager.generateSpawnPosition();
      player.x = spawnPos.x;
      player.y = spawnPos.y;

      this.state.players.set(playerId, player);
      this.physicsPlayerManager.createPlayerBody(playerId, player.x, player.y);

      logger.info(`Player ${playerId} added with Matter.js physics body`);
    } catch (error: any) {
      logger.error(`Player ${playerId} not created. Error:`, error.message);
    }
  }

  setupClientMessagesListeners() {
    this.onMessage(PLAYER_ACTIONS.MOVED, (client, payload) => {
      const playerState = this.state.players.get(client.sessionId);
      if (!playerState) return;

      this.physicsPlayerManager.handleMovement(client.sessionId, payload);

      if (payload.jump) {
        this.physicsPlayerManager.handleJump(client.sessionId, playerState);
      }
    });
  }
}
