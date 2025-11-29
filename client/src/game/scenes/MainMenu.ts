import i18next from '../../../18n';
import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.background = this.add.image(512, 384, 'background');

    this.logo = this.add.image(512, 300, 'logo');

    this.title = this.add
      .text(512, 460, i18next.t('main_menu.title'), {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5);

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
      .text(400, 200, 'Próxima cena')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game');
      });
  }

  updateTexts() {
    this.title.setText(i18next.t('main_menu.title'));
    // Update other texts as needed
  }
}
