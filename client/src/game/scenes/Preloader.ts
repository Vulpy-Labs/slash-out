import { Scene } from 'phaser';
import { NetworkManager } from '../network/NetworkManager';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath('assets');
    this.load.image('logo', 'logo.png');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Connect to Colyseus server before starting the game
    this.connectToServer();
  }

  private async connectToServer() {
    try {
      // Show loading text
      const loadingText = this.add
        .text(512, 300, 'Connecting to server...', {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      const networkManager = NetworkManager.getInstance();
      console.log('Attempting to join room...');
      const room = await networkManager.joinRoom();
      console.log('Successfully joined room! Session ID:', room.sessionId);

      loadingText.setText('Connected! Waiting for game state...');

      // Wait for the initial state to be received
      room.onStateChange.once(state => {
        console.log('Initial room state received:', state);

        // Check if current player exists in the room state
        if (state.players && state.players.has(room.sessionId)) {
          const currentPlayer = state.players.get(room.sessionId);

          // Player is ready, start the game scene
          loadingText.setText('Ready! Starting game...');
          setTimeout(() => {
            this.scene.start('TestScene', {
              networkManager,
              room,
              playerId: room.sessionId,
              playerData: currentPlayer,
            });
          }, 500);
        } else {
          // If player is not in state yet, wait a bit more
          loadingText.setText('Joining game...');
          setTimeout(() => {
            this.scene.start('TestScene', {
              networkManager,
              room,
              playerId: room.sessionId,
              playerData: null,
            });
          }, 1000);
        }
      });

      // Handle room errors
      room.onError((code, message) => {
        console.error('Room error:', code, message);
        loadingText.setText('Connection error. Retrying...');
        // Retry connection after 3 seconds
        setTimeout(() => this.connectToServer(), 3000);
      });

      // Handle room leave
      room.onLeave(code => {
        console.log('Left room with code:', code);
      });
    } catch (error) {
      console.error('Failed to connect to server:', error);

      // Show error message and retry button
      this.add
        .text(512, 300, 'Failed to connect to server', {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#ff0000',
        })
        .setOrigin(0.5);

      const retryButton = this.add
        .text(512, 350, 'Click to retry', {
          fontFamily: 'Arial',
          fontSize: '18px',
          color: '#ffffff',
        })
        .setOrigin(0.5)
        .setInteractive();

      retryButton.on('pointerdown', () => {
        retryButton.destroy();
        this.connectToServer();
      });
    }
  }
}
