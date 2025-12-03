import { Engine, World, Body } from 'matter-js';
import { PHYSICS } from 'shared/config/constants';

/**
 * Manages the Matter.js physics engine and world.
 * Responsible for engine initialization, world updates, and body management.
 */
export class PhysicsWorldManager {
  private engine: Engine;
  private world: World;

  constructor() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;
  }

  /**
   * Step the physics simulation forward by the given delta time.
   */
  step(deltaTime: number): void {
    Engine.update(this.engine, deltaTime);
  }

  /**
   * Add a body to the physics world.
   */
  addBody(body: Body): void {
    World.add(this.world, body);
  }

  /**
   * Remove a body from the physics world.
   */
  removeBody(body: Body): void {
    World.remove(this.world, body);
  }

  /**
   * Get the Matter.js world instance.
   */
  getWorld(): World {
    return this.world;
  }

  /**
   * Get the Matter.js engine instance.
   */
  getEngine(): Engine {
    return this.engine;
  }
}
