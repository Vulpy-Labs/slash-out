import { Boot } from './scenes/Boot';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { TestScene } from './scenes/arenas/test';
import { GRAVITY, VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#00000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
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
