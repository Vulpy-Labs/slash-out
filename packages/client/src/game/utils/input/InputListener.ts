export class InputListener {
  scene: Phaser.Scene;

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private keyboardInputs: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    sword: Phaser.Input.Keyboard.Key;
    gun: Phaser.Input.Keyboard.Key;
    dash: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    // ? Do I need to add a name in the super call? (i.e., super('InputListener'))
    this.scene = scene;
  }

  createKeyboardInputs() {
    const keyboard = this.scene.input.keyboard!;
    console.log('🚀 ~ InputListener ~ createKeyboardInputs ~ keyboard:', keyboard);

    this.cursors = this.scene.input.keyboard!.createCursorKeys();
    this.keyboardInputs = {
      left: keyboard.addKey('A'),
      right: keyboard.addKey('D'),
      up: keyboard.addKey('W'),
      down: keyboard.addKey('S'),
      jump: keyboard.addKey('K'),
      dash: keyboard.addKey('L'),
      sword: keyboard.addKey('J'),
      gun: keyboard.addKey('I'),
    };
  }

  updateInputs() {
    const inputState = {
      left: this.cursors.left.isDown || this.keyboardInputs.left.isDown,
      right: this.cursors.right.isDown || this.keyboardInputs.right.isDown,
      up: this.cursors.up.isDown || this.keyboardInputs.up.isDown,
      down: this.cursors.down.isDown || this.keyboardInputs.down.isDown,
      jump: this.keyboardInputs.jump.isDown,
      dash: this.keyboardInputs.dash.isDown,
      sword: this.keyboardInputs.sword.isDown,
      gun: this.keyboardInputs.gun.isDown,
    };

    console.log('sword', inputState.sword);
  }
}
