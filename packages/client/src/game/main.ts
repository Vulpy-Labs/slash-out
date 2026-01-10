import { AUTO, Game } from 'phaser';
import { Boot, Preloader } from './scenes/core';
import { MainMenu } from './scenes/ui/menu';
import { CanyonMap, GameOver } from './scenes/game';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scene: [Boot, Preloader, MainMenu, CanyonMap, GameOver],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
