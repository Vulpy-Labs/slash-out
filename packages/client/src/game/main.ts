import { AUTO, Game } from 'phaser';
import { Boot, Preloader } from './scenes/core';
import { MainMenu } from './scenes/ui/menu';
import { MatchScene } from './scenes/game';
import { PHYSICS, SCENE } from './config/constants';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: SCENE.WIDTH,
  height: SCENE.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#028af8',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: PHYSICS.GRAVITY },
      debug: true,
      setBounds: {
        x: 0,
        y: 0,
        width: SCENE.WIDTH,
        height: SCENE.HEIGHT,
        thickness: 64,
        left: true,
        right: true,
        top: true,
        bottom: true,
      },
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
  scene: [Boot, Preloader, MainMenu, MatchScene],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
