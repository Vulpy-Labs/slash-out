import { AUTO, Game } from 'phaser';

// import { SCENE } from 'shared/config/constant/scene/scene';
import { SCENE } from '../../../shared/config/constant/scene';

import { Boot, Preloader } from './scenes/core';
import { MainMenu } from './scenes/ui/menu';
import { MatchScene } from './scenes/game';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: SCENE.WIDTH,
  height: SCENE.HEIGHT,
  parent: 'game-container',
  backgroundColor: '#028af8',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 1 },
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
  scene: [Boot, Preloader, MainMenu, MatchScene],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
