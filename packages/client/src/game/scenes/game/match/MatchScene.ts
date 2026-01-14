import { MatchConfig } from '@/ecs/components';
import { PlayerEntity } from '../../../ecs/entities/player';

export class MatchScene extends Phaser.Scene {
  private matchConfig: MatchConfig;
  private playerEntity: PlayerEntity;

  constructor() {
    super('MatchScene');
  }

  init(data: MatchConfig) {
    this.matchConfig = data;
  }

  create() {
    this.initializeECS();
    this.createPlayer();
  }

  initializeECS() {
    this.playerEntity = new PlayerEntity(this);
  }

  createPlayer() {
    const player = this.playerEntity.createPlayer();
    console.log('🚀 ~ MatchScene ~ createPlayer ~ player:', player);
  }

  update() {
    // Todo: () => analyse if the current iteration would work for the second player.
    // Todo: () => create entityManager to automatically call the update() in all register entities;

    this.playerEntity.update();
  }
}
