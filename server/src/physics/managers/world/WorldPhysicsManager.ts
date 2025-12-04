import { GAME, PHYSICS, CHARACTER, SCENE } from 'shared/config/constants';
import { Engine, World, Bodies, Body } from 'matter-js';

export class WorldPhysicsManager {
  private world: World;
  private engine: Engine;

  initiatePhysicsWorld() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;

    return this.engine.world;
  }
}
