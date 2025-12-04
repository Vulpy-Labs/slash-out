import { Engine, World, Body } from 'matter-js';
import { PHYSICS } from 'shared/config/constants';

export class WorldPhysicsManager {
  private engine: Engine;
  private world: World;

  constructor() {
    this.engine = Engine.create({
      gravity: { x: 0, y: PHYSICS.GRAVITY },
    });
    this.world = this.engine.world;
  }

  step(deltaTime: number): void {
    Engine.update(this.engine, deltaTime);
  }

  addBody(body: Body): void {
    World.add(this.world, body);
  }

  removeBody(body: Body): void {
    World.remove(this.world, body);
  }
}
