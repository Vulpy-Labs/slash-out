import { MatchConfig } from '@/ecs/components';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;

  private inputSystem: any;
  private movementSystem: any;

  private mapFactory: any;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;
  }

  create() {
    console.log('MatchScene created with config:', this.matchConfig);
  }

  update() {
    console.log('MatchScene updating...');
  }
}
