import { Client, logger, Room } from 'colyseus';
import { State } from 'shared/types/room/state';
import { Player } from 'shared/types/player/schema';
import { PLAYER_ACTIONS } from 'shared/config/events/player/actions';
import { GAME } from 'shared/config/constants';
import { PhysicsWorldManager } from '../physics/PhysicsWorldManager';
import { PhysicsPlayerManager } from '../physics/PhysicsPlayerManager';
import { MapManager } from '../maps/MapManager';

/**
 * RoomManager - Thin orchestrator for Colyseus room lifecycle.
 * Delegates physics, map loading, and player management to specialized managers.
 */
export class RoomManager extends Room {
  // Specialized managers
  private physicsWorld: PhysicsWorldManager;
  private physicsPlayerManager: PhysicsPlayerManager;
  private mapManager: MapManager;

  // Fixed timestep accumulator
  private accumulator: number = 0;

  onCreate() {
    console.log('Trying to initiate room connection with client');

    // Initialize state
    const state = new State();
    this.setState(state);
    this.setPatchRate(2);

    // Initialize managers
    this.physicsWorld = new PhysicsWorldManager();
    this.physicsPlayerManager = new PhysicsPlayerManager(this.physicsWorld);
    this.mapManager = new MapManager(this.physicsWorld);

    // Load map platforms
    const platforms = this.mapManager.loadPlatforms();
    this.physicsPlayerManager.setPlatformBodies(platforms);

    // Start physics simulation
    this.setSimulationInterval(deltaTime => this.update(deltaTime));

    // Setup message handlers
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

    // Remove player physics body
    this.physicsPlayerManager.removePlayerBody(client.sessionId);

    // Remove from state
    this.state.players.delete(client.sessionId);
  }

  update(deltaTime: number) {
    // Accumulate time since last frame
    this.accumulator += deltaTime;

    // Run physics in fixed timesteps (prevents physics from running faster/slower based on framerate)
    while (this.accumulator >= GAME.CONFIG.FIXED_TIME_STEP) {
      this.fixedUpdate();
      this.accumulator -= GAME.CONFIG.FIXED_TIME_STEP;
    }
  }

  fixedUpdate() {
    // Step Matter.js physics
    this.physicsWorld.step(GAME.CONFIG.FIXED_TIME_STEP);

    // Update all players (velocity clamping, ground detection, state sync)
    this.physicsPlayerManager.updateAllPlayers(this.state.players);
  }

  createPlayer({ sessionId }: { sessionId: string }) {
    const playerId = sessionId;

    try {
      // Create Colyseus player state
      const player = new Player();
      const spawnPos = PhysicsPlayerManager.generateSpawnPosition();
      player.x = spawnPos.x;
      player.y = spawnPos.y;

      console.log(`👤 Player spawned at: x=${player.x}, y=${player.y}`);

      this.state.players.set(playerId, player);

      // Create physics body
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

      // Handle horizontal movement
      this.physicsPlayerManager.handleMovement(client.sessionId, payload);

      // Handle jump (independent)
      if (payload.jump) {
        this.physicsPlayerManager.handleJump(client.sessionId, playerState);
      }
    });
  }
}
