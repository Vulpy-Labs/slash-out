import { Scene } from 'phaser';
import i18next from '../../../18n';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  constructor() {
    super('Game');
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.msg_text = this.add.text(512, 384, i18next.t('make_something_fun'), {
      fontFamily: 'Arial Black',
      fontSize: 38,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center',
    });
    this.msg_text.setOrigin(0.5);

    // Language selection buttons
    this.add
      .text(100, 200, i18next.t('main_menu.options.languages.en'))
      .setInteractive()
      .on('pointerdown', () => {
        i18next.changeLanguage('en').then(() => {
          this.updateTexts();
        });
      });

    this.add
      .text(200, 200, i18next.t('main_menu.options.languages.pt'))
      .setInteractive()
      .on('pointerdown', () => {
        i18next.changeLanguage('pt').then(() => {
          this.updateTexts();
        });
      });

    this.add
      .text(300, 200, 'Voltar')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('MainMenu');
      });
  }

  updateTexts() {
    this.msg_text.setText(i18next.t('make_something_fun'));
    // Update other texts as needed
  }
}
