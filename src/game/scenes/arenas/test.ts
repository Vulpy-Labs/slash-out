import { v4 as uuidv4 } from 'uuid';

import {
  CHARACTER_SPEED_X,
  CHARACTER_SPEED_Y,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
  SWORD_CONFIG,
  BULLET_CONFIG,
} from '../../constants';

type PlayerState =
  | 'IDLE'
  | 'RUNNING'
  | 'JUMPING'
  | 'IN_AIR'
  | 'LOOKING_UP'
  | 'LOOKING_DOWN'
  | 'ATTACKING_FORWARD'
  | 'ATTACKING_UP'
  | 'ATTACKING_DOWN';

type WeaponState =
  | 'SWORD_FORWARD'
  | 'SWORD_UP'
  | 'SWORD_DOWN'
  | 'SHOOTING_FORWARD'
  | 'SHOOTING_UP'
  | 'SHOOTING_DOWN'
  | 'BULLET_DESTROYED';

type WeaponStateProps = {
  newState: WeaponState;
  objId?: string;
};

type BulletType = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody & {
  bulletId: string;
  beingDestroyed: boolean;
};

export class TestScene extends Phaser.Scene {
  // Map
  gameWidth = VIRTUAL_WIDTH;
  gameHeight = VIRTUAL_HEIGHT;
  mapImages: string[];
  platforms: Phaser.Tilemaps.TilemapLayer;
  map: Phaser.Tilemaps.Tilemap;

  // Character / player
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  playerState: PlayerState = 'IDLE';
  isPlayerMovingHorizontally: boolean;
  isPlayerTouchingGround: boolean;
  keyboardInputs: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    attack: Phaser.Input.Keyboard.Key;
    shoot: Phaser.Input.Keyboard.Key;
    dash: Phaser.Input.Keyboard.Key;
  };

  // Weapons
  weaponState: WeaponState;
  sword: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bullets: BulletType[] = [];
  bulletsLeft = BULLET_CONFIG.CLIP_SIZE;

  constructor() {
    super('TestScene');
  }

  preload() {
    this.loadAssets();
  }

  loadAssets() {
    this.loadMapAssets();
    this.loadCharacterMovementAssets();
    this.loadCharacterAttackAssets();
    this.loadWeaponsAssets();
  }

  loadMapAssets() {
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.tilemapTiledJSON('canyon_map', 'assets/maps/canyon.json');
    this.loadMapImages();
  }

  loadCharacterMovementAssets() {
    this.load.spritesheet('spr_idle', 'assets/characters/otomo/v1/spr_idle.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_running', 'assets/characters/otomo/v1/spr_running.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_jump', 'assets/characters/otomo/v1/spr_jump.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_look_up', 'assets/characters/otomo/v1/spr_lookup.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('spr_look_down', 'assets/characters/otomo/v1/spr_lookdown.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  loadCharacterAttackAssets() {
    this.load.spritesheet('spr_attack_sword', 'assets/characters/otomo/v1/spr_shortattack.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      'spr_attack_sword_up',
      'assets/characters/otomo/v1/spr_shortattackup.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      'spr_attack_sword_down',
      'assets/characters/otomo/v1/spr_shortattackdown.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
  }

  loadWeaponsAssets() {
    for (let i = 0; i < 5; i++) {
      this.load.image(`spr_sword_${i}`, `assets/sprites/combat/melee/spr_sword/spr_sword_${i}.png`);
    }

    this.load.spritesheet(
      'spr_sword_idle',
      'assets/sprites/combat/melee/spr_sword/spr_sword_0.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );

    for (let i = 0; i < 2; i++) {
      this.load.image(
        `spr_bullet_${i}`,
        `assets/sprites/combat/range/spr_bullet/spr_bullet_${i}.png`
      );
    }
    for (let i = 0; i < 16; i++) {
      this.load.image(`spr_blast_${i}`, `assets/sprites/combat/range/spr_blast/spr_blast_${i}.png`);
    }
  }

  create() {
    this.createMap();
    this.createTitle();
    this.createCharacter();
    this.createKeyboardInputs();
    this.createWeapons();
  }

  update() {
    this.updateCharacterMovement();
    this.updateWeaponsAttachmentToCharacter();
    this.updateCharacterAttack();
  }

  loadMapImages() {
    this.mapImages = [
      'bg_FG_0',
      'at_bgrock_0',
      'bg_rock_0',
      'bg_bamboo_0',
      'spr_bamboo_1',
      'spr_grass_group_1',
      'spr_grass_group_2',
      'bg_forestrock_0',
    ];

    this.mapImages.forEach(image => {
      this.load.image(image, `assets/sprites/maps/${image}.png`);
    });
  }

  createTitle() {
    this.add.text(16, 16, 'Slash Out Level Test', {
      fontStyle: 'bold',
      fontSize: '14px',
      color: '#fff',
    });
  }

  createMap() {
    this.map = this.make.tilemap({ key: 'canyon_map' });
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    this.mapImages.forEach(image => {
      const tileset = this.map.addTilesetImage(image, image);
      if (tileset) tilesets.push(tileset);
    });

    this.createMapLayer('background', tilesets);

    const ground = this.createMapLayer('ground', tilesets);
    this.platforms = ground.find(ground => ground?.layer.name.includes('platform'))!;

    this.platforms.setCollisionByProperty({ collider: true });

    this.createMapLayer('foreground', tilesets);
  }

  createMapLayer(layersGroup: string, tilesets: Phaser.Tilemaps.Tileset[]) {
    return this.map.layers
      .filter(layer => layer.name.startsWith(`${layersGroup}/`))
      .map(layer => {
        return this.map.createLayer(layer.name, tilesets, 0, 0);
      });
  }

  createCharacter() {
    this.character = this.physics.add.sprite(150, 100, 'spr_idle');

    this.createCharacterCollisions();
    this.createCharacterAnimations();
  }

  createCharacterCollisions() {
    this.character.setCollideWorldBounds(true);
    this.physics.add.collider(this.character, this.platforms);
  }

  createCharacterAnimations() {
    this.createCharacterMovementAnimations();
    this.createCharacterAttackAnimations();
  }

  createCharacterMovementAnimations() {
    this.anims.create({
      key: 'anim_idle',
      frames: this.anims.generateFrameNumbers('spr_idle', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_running',
      frames: this.anims.generateFrameNumbers('spr_running', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_look_up',
      frames: this.anims.generateFrameNumbers('spr_look_up', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_look_down',
      frames: this.anims.generateFrameNumbers('spr_look_down', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_jump',
      frames: this.anims.generateFrameNumbers('spr_jump', { start: 1, end: 2 }),
      frameRate: 12,
    });

    this.anims.create({
      key: 'anim_in_air',
      frames: this.anims.generateFrameNumbers('spr_jump', { start: 2, end: 2 }),
      frameRate: 12,
    });
  }

  createCharacterAttackAnimations() {
    this.anims.create({
      key: 'anim_attack_sword',
      frames: this.anims.generateFrameNumbers('spr_attack_sword', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_attack_sword_up',
      frames: this.anims.generateFrameNumbers('spr_attack_sword_up', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: 'anim_attack_sword_down',
      frames: this.anims.generateFrameNumbers('spr_attack_sword_down', { start: 0, end: 0 }),
      frameRate: 7,
      repeat: -1,
    });
  }

  createWeaponsAnimations() {
    this.anims.create({
      key: 'anims_attack_sword_trail',
      frames: [
        { key: 'spr_sword_0' },
        { key: 'spr_sword_1' },
        { key: 'spr_sword_2' },
        { key: 'spr_sword_3' },
        { key: 'spr_sword_4' },
      ],
      frameRate: 24,
      repeat: -1,
    });

    this.anims.create({
      key: 'anims_attack_bullet',
      frames: [{ key: 'spr_bullet_0' }, { key: 'spr_bullet_1' }],
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: 'anims_attack_bullet_destroy',
      frames: new Array(15).fill('').map((_, index) => ({
        key: `spr_blast_${index}`,
      })),
      frameRate: 30,
      repeat: 0,
    });
  }

  setPlayerState(newState: PlayerState) {
    if (this.playerState === newState) return;

    this.playerState = newState;

    switch (newState) {
      case 'IDLE':
        this.character.anims.play('anim_idle', true);
        break;
      case 'RUNNING':
        this.character.anims.play('anim_running', true);
        break;
      case 'JUMPING':
        this.character.anims.play('anim_jump', true);
        break;
      case 'IN_AIR':
        this.character.anims.play('anim_in_air', true);
        break;
      case 'LOOKING_UP':
        this.character.anims.play('anim_look_up', true);
        break;
      case 'LOOKING_DOWN':
        this.character.anims.play('anim_look_down', true);
        break;
      case 'ATTACKING_FORWARD':
        this.character.anims.play('anim_attack_sword', true);
        break;
      case 'ATTACKING_UP':
        this.character.anims.play('anim_attack_sword_up', true);
        break;
      case 'ATTACKING_DOWN':
        this.character.anims.play('anim_attack_sword_down', true);
        break;
    }
  }

  setWeaponState({ newState, objId }: WeaponStateProps) {
    this.weaponState = newState;

    switch (newState) {
      case 'SWORD_FORWARD':
        this.sword.anims.play('anims_attack_sword_trail', true);
        break;
      case 'SWORD_UP':
        this.sword.anims.play('anims_attack_sword_trail', true);
        break;
      case 'SWORD_DOWN':
        this.sword.anims.play('anims_attack_sword_trail', true);
        break;
      case 'SHOOTING_FORWARD':
        if (objId !== undefined) {
          const bullet = this.bullets.find(({ bulletId }) => bulletId === objId);
          if (!bullet)
            throw new Error(
              `Error while trying to play bullet's ${newState} animation. Bullet not found for id: ${objId}`
            );

          bullet.anims.play('anims_attack_bullet', true);
        } else {
          this.bullets[this.bullets.length - 1].anims.play('anims_attack_bullet', true);
        }
        break;
      case 'SHOOTING_UP':
        if (objId !== undefined) {
          const bullet = this.bullets.find(({ bulletId }) => bulletId === objId);
          if (!bullet)
            throw new Error(
              `Error while trying to play bullet's ${newState} animation. Bullet not found for id: ${objId}`
            );

          bullet.anims.play('anims_attack_bullet', true);
        } else {
          this.bullets[this.bullets.length - 1].anims.play('anims_attack_bullet', true);
        }
        break;
      case 'SHOOTING_DOWN':
        if (objId !== undefined) {
          const bullet = this.bullets.find(({ bulletId }) => bulletId === objId);
          if (!bullet)
            throw new Error(
              `Error while trying to play bullet's ${newState} animation. Bullet not found for id: ${objId}`
            );

          bullet.anims.play('anims_attack_bullet', true);
        } else {
          this.bullets[this.bullets.length - 1].anims.play('anims_attack_bullet', true);
        }
        break;
      case 'BULLET_DESTROYED':
        try {
          if (objId !== undefined) {
            const bullet = this.bullets.find(({ bulletId }) => bulletId === objId);

            if (!bullet)
              throw new Error(
                `Error while trying to play bullet's ${newState} animation. Bullet not found for id: ${objId}`
              );

            bullet.anims.play('anims_attack_bullet_destroy', true);
          } else {
            this.bullets[this.bullets.length - 1].anims.play('anims_attack_bullet_destroy');
          }
        } catch (e: any) {
          throw Error(e);
        }

        break;
    }
  }

  createKeyboardInputs() {
    const keyboard = this.input.keyboard!;

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyboardInputs = {
      left: keyboard.addKey('A'),
      right: keyboard.addKey('D'),
      up: keyboard.addKey('W'),
      down: keyboard.addKey('S'),
      jump: keyboard.addKey('SPACE'),
      attack: keyboard.addKey('F'),
      shoot: keyboard.addKey('G'),
      dash: keyboard.addKey('SHIFT'),
    };
  }

  createWeapons() {
    this.sword = this.physics.add.sprite(this.character.x, this.character.y, 'spr_sword_0');

    this.createWeaponsAnimations();
    this.createWeaponCollisions();
  }

  createWeaponCollisions() {
    this.createSwordCollision();
  }

  createSwordCollision() {
    this.sword.setCollideWorldBounds(true);

    (this.sword.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    this.physics.add.overlap(this.sword, this.character);
    this.physics.add.overlap(this.sword, this.platforms);
  }

  createBullet() {
    // Todo: () => trocar bulletId por id
    const bulletId = uuidv4();
    const bullet = this.physics.add.sprite(
      this.character.x,
      this.character.y,
      'spr_bullet_0'
    ) as BulletType;
    bullet.bulletId = bulletId;
    bullet.beingDestroyed = false;

    this.bullets.push(bullet);
    this.createBulletCollision({ bullet });
    this.updateBulletAttachmentToCharacter({ id: bulletId });

    return bulletId;
  }

  createBulletCollision({ bullet }: { bullet: BulletType }) {
    bullet.setCollideWorldBounds(true);
    (bullet.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    this.physics.add.collider(bullet, this.character, () => {
      this.destroyBullet({ id: bullet.bulletId });
    });
    this.physics.add.collider(bullet, this.platforms, () => {
      this.destroyBullet({ id: bullet.bulletId });
    });
  }

  updateCharacterMovement() {
    if (!this.character || !this.cursors) return;

    this.isPlayerMovingHorizontally =
      this.cursors.left.isDown ||
      this.keyboardInputs.left.isDown ||
      this.cursors.right.isDown ||
      this.keyboardInputs.right.isDown;

    this.isPlayerTouchingGround = this.character.body.blocked.down;

    this.updateHorizontalMovement();
    this.updateVerticalMovement();
  }

  updateHorizontalMovement() {
    if (this.cursors.left.isDown || this.keyboardInputs.left.isDown) {
      this.character.setVelocityX(-CHARACTER_SPEED_X);
      this.character.setFlipX(true);

      if (this.isPlayerTouchingGround) {
        this.setPlayerState('RUNNING');
      }
    } else if (this.cursors.right.isDown || this.keyboardInputs.right.isDown) {
      this.character.setVelocityX(CHARACTER_SPEED_X);
      this.character.setFlipX(false);

      if (this.isPlayerTouchingGround) {
        this.setPlayerState('RUNNING');
      }
    } else if (this.isPlayerTouchingGround && !this.isPlayerMovingHorizontally) {
      this.character.setVelocityX(0);
      this.setPlayerState('IDLE');
    }
  }

  updateVerticalMovement() {
    if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.jump) && this.isPlayerTouchingGround) {
      this.character.setVelocityY(-CHARACTER_SPEED_Y);
      this.setPlayerState('JUMPING');
    }

    if (!this.isPlayerTouchingGround) {
      this.setPlayerState('IN_AIR');
    }

    if (
      (this.cursors.up.isDown || this.keyboardInputs.up.isDown) &&
      !this.isPlayerMovingHorizontally &&
      this.isPlayerTouchingGround
    ) {
      this.setPlayerState('LOOKING_UP');
    } else if (
      (this.cursors.down.isDown || this.keyboardInputs.down.isDown) &&
      !this.isPlayerMovingHorizontally &&
      this.isPlayerTouchingGround
    ) {
      this.setPlayerState('LOOKING_DOWN');
    }
  }

  updateWeaponsAttachmentToCharacter() {
    this.updateSwordAttachmentToCharacter();
  }

  updateSwordAttachmentToCharacter() {
    const originX = 0.5;
    const originY = 0.5;

    let x = this.character.x;
    let y = this.character.y;
    let angle = 0;
    let width = SWORD_CONFIG.WIDTH;
    let height = SWORD_CONFIG.HEIGHT;

    if (this.playerState === 'LOOKING_UP') {
      angle = -90;
      width = SWORD_CONFIG.HEIGHT;
      height = SWORD_CONFIG.WIDTH;
      x = this.character.x;
      y = this.character.y - this.character.height / 2 - height / 2;
    } else if (this.playerState === 'LOOKING_DOWN') {
      angle = 90;
      width = SWORD_CONFIG.HEIGHT;
      height = SWORD_CONFIG.WIDTH;
      x = this.character.x;
      y = this.character.y + this.character.height / 2 + height / 2;
    } else {
      if (this.character.flipX) {
        angle = 180;
        x = this.character.x - this.character.width / 2 - width / 2;
      } else {
        angle = 0;
        x = this.character.x + this.character.width / 2 + width / 2;
      }
      y = this.character.y;
    }

    this.sword.setOrigin(originX, originY);
    this.sword.setAngle(angle);
    this.sword.body.setSize(width, height);
    this.sword.setPosition(x, y);
  }

  updateBulletAttachmentToCharacter({ id }: { id: string }) {
    const bullet = this.bullets.find(({ bulletId }) => bulletId === id);

    if (!bullet)
      throw new Error(
        `Not possible to attach bullet to the character. Bullet not found for id: ${id}`
      );

    const originX = 0.5;
    const originY = 0.5;

    let x = this.character.x;
    let y = this.character.y;
    let angle = 0;
    let width = BULLET_CONFIG.WIDTH;
    let height = BULLET_CONFIG.HEIGHT;

    if (this.playerState === 'LOOKING_UP') {
      angle = -90;
      width = BULLET_CONFIG.HEIGHT;
      height = BULLET_CONFIG.WIDTH;
      x = this.character.x;
      y = this.character.y - this.character.height / 2 - height / 2;
    } else if (this.playerState === 'LOOKING_DOWN') {
      angle = 90;
      width = BULLET_CONFIG.HEIGHT;
      height = BULLET_CONFIG.WIDTH;
      x = this.character.x;
      y = this.character.y + this.character.height / 2 + height / 2;
    } else {
      if (this.character.flipX) {
        angle = 180;
        x = this.character.x - this.character.width / 2 - width / 2;
      } else {
        angle = 0;
        x = this.character.x + this.character.width / 2 + width / 2;
      }
      y = this.character.y;
    }

    bullet.setOrigin(originX, originY);
    bullet.setAngle(angle);
    bullet.body.setSize(width, height);
    bullet.setPosition(x, y);
  }

  updateCharacterAttack() {
    this.updateSwordAttack();
    this.updateBulletAttack();
  }

  updateSwordAttack() {
    if (this.keyboardInputs.attack.isDown) {
      this.sword.setVisible(true);

      if (this.playerState === 'LOOKING_UP') {
        this.setPlayerState('ATTACKING_UP');
        this.setWeaponState({ newState: 'SWORD_UP' });
      } else if (this.playerState === 'LOOKING_DOWN') {
        this.setPlayerState('ATTACKING_DOWN');
        this.setWeaponState({ newState: 'SWORD_DOWN' });
      } else {
        this.setPlayerState('ATTACKING_FORWARD');
        this.setWeaponState({ newState: 'SWORD_FORWARD' });
      }
    } else {
      if (this.sword) this.sword.setVisible(false);
    }
  }

  updateBulletAttack() {
    if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.shoot)) {
      if (this.bulletsLeft) {
        const id = this.createBullet();

        if (this.playerState === 'LOOKING_UP') {
          this.setPlayerState('ATTACKING_UP');
          this.setWeaponState({ newState: 'SHOOTING_UP' });
        } else if (this.playerState === 'LOOKING_DOWN') {
          this.setPlayerState('ATTACKING_DOWN');
          this.setWeaponState({ newState: 'SHOOTING_DOWN' });
        } else {
          this.setPlayerState('ATTACKING_FORWARD');
          this.setWeaponState({ newState: 'SHOOTING_FORWARD' });
        }

        this.bulletsLeft--;
        this.updateBulletMovement({ id });
      }
    }
  }

  updateBulletMovement({ id }: { id: string }) {
    const bullet = this.bullets.find(({ bulletId }) => bulletId === id);

    if (!bullet) throw new Error(`Not possible to move projectile. Bullet not found for id: ${id}`);

    switch (this.weaponState) {
      case 'SHOOTING_FORWARD':
        if (this.character.flipX) {
          bullet.setVelocityX(-BULLET_CONFIG.VELOCITY);
        } else {
          bullet.setVelocityX(BULLET_CONFIG.VELOCITY);
        }
        break;
      case 'SHOOTING_UP':
        bullet.setVelocityY(-BULLET_CONFIG.VELOCITY);
        break;
      case 'SHOOTING_DOWN':
        bullet.setVelocityY(BULLET_CONFIG.VELOCITY);
        break;
    }
  }

  destroyBullet() {
    this.setWeaponState('BULLET_DESTROYED');

    setTimeout(() => {
      this.bullet.destroy();
    }, 450);
  }
}
