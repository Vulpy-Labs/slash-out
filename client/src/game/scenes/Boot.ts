/**
 * Runs only once and exists throught the life of the game
 * 
 * Handles the logic between different scenes
 * Injects code into scenes that need it
 * Connects to colyseus server  
 */

import { Scene } from 'phaser';

export class Boot extends Scene {

  constructor() {
    super('Boot');
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image('background', 'assets/bg.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
