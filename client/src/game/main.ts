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

  // ULTRA-HIGH PERFORMANCE SETTINGS
  fps: {
    target: 120, // Target 120 FPS
    forceSetTimeOut: true,
    deltaHistory: 10,
    panicMax: 0, // Never skip frames
    smoothStep: false, // Disable frame smoothing for instant response
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
      debug: true,
      fps: 120, // Physics at 120 FPS
      fixedStep: false, // Variable timestep for maximum responsiveness
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: false, // Disable pixel rounding for smoother movement
  },
  input: {
    keyboard: true,
    activePointers: 1, // Optimize input handling
  },
  scene: [Boot, Preloader, TestScene],

  // MAXIMUM PERFORMANCE
  disableContextMenu: true,
  banner: false, // Remove Phaser banner for slight performance gain
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
