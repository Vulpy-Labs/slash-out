import { Boot } from './scenes/Boot';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { TestScene } from './scenes/arenas/test';
import { PHYSICS, SCENE } from 'shared/config/constants';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: SCENE.WIDTH,
  height: SCENE.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#00000',
  physics: {
    default: 'matter',
    arcade: {
      gravity: { x: 0, y: PHYSICS.GRAVITY },
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
  input: {
    keyboard: true,
  },
  scene: [Boot, Preloader, TestScene],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
