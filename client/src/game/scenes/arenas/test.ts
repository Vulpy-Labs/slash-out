import { v4 as uuidv4 } from 'uuid';

import { CHARACTER, SCENE, SWORD, BULLET } from 'shared/config/constants';

import { RoomConnection } from '@/services/server/connection/RoomConnection';

type PlayerState =
  | 'IDLE'
  | 'RUNNING'
  | 'JUMPING'
  | 'IN_AIR'
  | 'LOOKING_UP'
  | 'LOOKING_DOWN'
  | 'ATTACKING_FORWARD'
  | 'ATTACKING_UP'
  | 'ATTACKING_DOWN'
  | 'DEAD';

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
  weapon: Phaser.Physics.Matter.Sprite;
};

type SwordType = Phaser.Physics.Matter.Sprite;

type BulletType = Phaser.Physics.Matter.Sprite & {
  bulletId: string;
  isBeingDestroyed: boolean;
};

type CharacterType = Phaser.Physics.Matter.Sprite & {
  health: number;
};

type SpawnPointType = { x: number; y: number };

type CreateBulletProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
};
export class TestScene extends Phaser.Scene {
  // Map
  gameWidth = SCENE.WIDTH;
  gameHeight = SCENE.HEIGHT;
  mapImages: string[];
  platforms: Phaser.Tilemaps.TilemapLayer;
  map: Phaser.Tilemaps.Tilemap;
  spawnPoints: SpawnPointType[];

  // Character / player
  character: CharacterType;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  playerState: PlayerState = 'IDLE';
  playerCurrentLives: number = CHARACTER.CONFIG.LIVES;
  playerLives: Phaser.GameObjects.Container;
  isPlayerMovingHorizontally: boolean;
  isPlayerTouchingGround: boolean;
  isInvincible: boolean = false;
  canAttack: boolean = true;
  keyboardInputs: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    attack: Phaser.Input.Keyboard.Key;
    shoot: Phaser.Input.Keyboard.Key;
    dash: Phaser.Input.Keyboard.Key;
    seppuku_attack: Phaser.Input.Keyboard.Key;
    seppuku_shot: Phaser.Input.Keyboard.Key;
  };

  // Weapons
  weaponState: WeaponState;
  sword: SwordType;
  bullets: BulletType[] = [];
  bulletsLeft = BULLET.ATTACK.CLIP_SIZE;
  shinigamiSword: Phaser.Physics.Matter.Sprite;

  // Server Logic
  roomConnection: RoomConnection;

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
    this.loadCharacterDeathAssets();
    this.loadWeaponsAssets();
    this.loadIcons();
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

  loadCharacterDeathAssets() {
    this.load.spritesheet('spr_dead', 'assets/characters/otomo/v1/spr_dead.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
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

  loadIcons() {
    this.load.image('spr_playerlives', 'assets/sprites/icons/spr_icons_6.png');
  }

  async create() {
    this.createMap();
    this.createSpawnPoints();
    this.createTitle();
    this.createCharacter();
    this.createKeyboardInputs();
    this.createWeaponsAnimations();
    this.createLivesContainer();
    this.updateLivesDisplay();
    await this.createServerRoom();
  }

  update() {
    this.updateCharacterMovement();
    this.updateCharacterAttack();
    this.updateLivesDisplay();
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
    this.matter.world.convertTilemapLayer(this.platforms);

    this.createMapLayer('foreground', tilesets);
  }

  createMapLayer(layersGroup: string, tilesets: Phaser.Tilemaps.Tileset[]) {
    return this.map.layers
      .filter(layer => layer.name.startsWith(`${layersGroup}/`))
      .map(layer => {
        return this.map.createLayer(layer.name, tilesets, 0, 0);
      });
  }

  createCharacter({ x = 150, y = 100 }: { x?: number; y?: number } = {}) {
    this.character = this.matter.add.sprite(x, y, 'spr_idle') as CharacterType;
    this.character.setBody({
      type: 'rectangle',
      width: 16,
      height: 16,
    });
    this.character.setFixedRotation();
    this.character.setFriction(CHARACTER.MOVEMENT.GROUND.FRICTION);
    this.character.setFrictionAir(CHARACTER.MOVEMENT.AIR.FRICTION);
    this.character.setBounce(0);

    (this.character.body as MatterJS.BodyType).label = 'character';
    this.character.health = CHARACTER.CONFIG.HEALTH;

    this.createCharacterCollisions();
    this.createCharacterAnimations();
  }

  createCharacterCollisions() {
    this.createCharacterGroundCollisions();
  }

  createCharacterGroundCollisions() {
    const maxSurfaceAngle = 0.5;
    let groundCollisions = new Set<MatterJS.BodyType>();

    this.matter.world.on(
      'collisionstart',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        event.pairs.forEach(({ bodyA, bodyB, collision }) => {
          const hasCharacter = bodyA.label === 'character' || bodyB.label === 'character';
          if (!hasCharacter) return;

          const isCharacterA = bodyA.label === 'character';
          const otherBody = isCharacterA ? bodyB : bodyA;
          const normalY = collision.normal.y;

          const isGroundCollision = isCharacterA
            ? normalY <= -maxSurfaceAngle
            : normalY >= maxSurfaceAngle;

          if (isGroundCollision) {
            groundCollisions.add(otherBody);
            this.isPlayerTouchingGround = true;
          }
        });
      }
    );

    this.matter.world.on(
      'collisionend',
      (event: Phaser.Physics.Matter.Events.CollisionEndEvent) => {
        event.pairs.forEach(({ bodyA, bodyB }) => {
          const hasCharacter = bodyA.label === 'character' || bodyB.label === 'character';
          if (!hasCharacter) return;

          const isCharacterA = bodyA.label === 'character';
          const otherBody = isCharacterA ? bodyB : bodyA;

          const wasGroundContact = groundCollisions.delete(otherBody);

          if (wasGroundContact && groundCollisions.size === 0) {
            this.isPlayerTouchingGround = false;
          }
        });
      }
    );
  }

  createCharacterAnimations() {
    this.createCharacterMovementAnimations();
    this.createCharacterAttackAnimations();
    this.createCharacterDeathAnimations();
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

  createCharacterDeathAnimations() {
    this.anims.create({
      key: 'anim_dead',
      frames: this.anims.generateFrameNumbers('spr_dead', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: 0,
    });
  }

  createWeaponsAnimations() {
    this.createSwordAnimations();
    this.createBulletAnimations();
  }

  createSwordAnimations() {
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
      repeat: 0,
    });
  }

  createBulletAnimations() {
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

  createLivesContainer() {
    this.playerLives = this.add.container(0, 0);
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
      case 'DEAD':
        this.character.anims.play('anim_dead', true);
        break;
    }
  }

  setWeaponState({ newState, weapon }: WeaponStateProps) {
    this.weaponState = newState;

    switch (newState) {
      case 'SWORD_FORWARD':
      case 'SWORD_UP':
      case 'SWORD_DOWN':
        weapon.anims.play('anims_attack_sword_trail', true);
        break;
      case 'BULLET_DESTROYED':
      case 'SHOOTING_FORWARD':
      case 'SHOOTING_UP':
      case 'SHOOTING_DOWN':
        weapon.anims.play(
          newState === 'BULLET_DESTROYED' ? 'anims_attack_bullet_destroy' : 'anims_attack_bullet',
          true
        );
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
      seppuku_attack: keyboard.addKey('Z'),
      seppuku_shot: keyboard.addKey('X'),
    };
  }

  createSword() {
    this.sword = this.matter.add.sprite(this.character.x, this.character.y, 'spr_sword_0');
    this.sword.setBody({
      type: 'rectangle',
      width: SWORD.CONFIG.WIDTH,
      height: SWORD.CONFIG.HEIGHT,
    });

    (this.sword.body as MatterJS.BodyType).label = 'sword';

    this.sword.setFixedRotation();
    this.sword.setSensor(true);
    this.sword.setIgnoreGravity(true);

    this.createSwordCollision({ sword: this.sword });
    this.updateSwordAttachmentToCharacter();
  }

  createSwordCollision({ sword }: { sword: SwordType }) {
    this.matter.world.on(
      'collisionstart',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        event.pairs.forEach(pair => {
          const { bodyA, bodyB } = pair;

          const isSwordA = bodyA === sword.body;
          const isSwordB = bodyB === sword.body;

          if (
            (isSwordA && bodyB === this.character.body) ||
            (isSwordB && bodyA === this.character.body)
          ) {
            this.applyDamage({ target: this.character, amount: SWORD.ATTACK.DAMAGE });
            this.destroySprite({
              sprite: sword,
              animationKey: 'anims_attack_sword_trail',
            });
          }

          if (
            (isSwordA && bodyB.label === 'platform') ||
            (isSwordB && bodyA.label === 'platform')
          ) {
            this.destroySprite({
              sprite: sword,
              animationKey: 'anims_attack_sword_trail',
            });
          }
        });
      }
    );
  }

  createBullet({
    x = this.character.x,
    y = this.character.y,
    width = BULLET.CONFIG.WIDTH,
    height = BULLET.CONFIG.HEIGHT,
    angle = BULLET.CONFIG.ANGLE,
  }: CreateBulletProps = {}) {
    const bulletId = uuidv4();
    const bullet = this.matter.add.sprite(x, y, 'spr_bullet_0') as BulletType;
    bullet.setBody({
      type: 'rectangle',
      width,
      height,
    });

    (bullet.body as MatterJS.BodyType).label = 'bullet';

    bullet.bulletId = bulletId;
    bullet.isBeingDestroyed = false;
    bullet.setFixedRotation();
    bullet.setSensor(true);
    bullet.setIgnoreGravity(true);
    bullet.setAngle(angle);

    this.bullets.push(bullet);
    this.createBulletCollision({ bullet });
    this.updateBulletAttachmentToCharacter({ bullet });

    return bullet;
  }

  createBulletCollision({ bullet }: { bullet: BulletType }) {
    this.matter.world.on(
      'collisionstart',
      (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        event.pairs.forEach(pair => {
          const { bodyA, bodyB } = pair;

          const isBulletA = bodyA === bullet.body;
          const isBulletB = bodyB === bullet.body;

          if (
            (isBulletA && bodyB === this.character.body) ||
            (isBulletB && bodyA === this.character.body)
          ) {
            bullet.setVelocity(0);
            this.applyDamage({ target: this.character, amount: BULLET.ATTACK.DAMAGE });
            this.destroySprite({
              sprite: bullet,
              animationKey: 'anims_attack_bullet_destroy',
              state: 'BULLET_DESTROYED',
              callback: () => {
                const index = this.bullets.indexOf(bullet);

                if (index === -1) {
                  console.error(
                    `Not possible to destroy the bullet. It wasn't found for index: ${index}`
                  );

                  return;
                }

                this.bullets.splice(index, 1);
              },
            });
          }

          if (
            (isBulletA && bodyB.label === 'Rectangle Body') ||
            (isBulletB && bodyA.label === 'Rectangle Body')
          ) {
            bullet.setVelocity(0);
            this.destroySprite({
              sprite: bullet,
              animationKey: 'anims_attack_bullet_destroy',
              state: 'BULLET_DESTROYED',
              callback: () => {
                const index = this.bullets.indexOf(bullet);

                if (index === -1) {
                  console.error(
                    `Not possible to destroy the bullet. It wasn't found for index: ${index}`
                  );

                  return;
                }

                this.bullets.splice(index, 1);
              },
            });
          }
        });
      }
    );
  }

  createShinigamiSword() {
    this.shinigamiSword = this.matter.add.sprite(
      this.character.x + 21,
      this.character.y,
      'spr_sword_0'
    );
    this.shinigamiSword.setFlipX(true);

    this.createSwordCollision({ sword: this.shinigamiSword });
  }

  createBackfireBullet() {
    const bullet = this.createBullet();

    bullet.setOrigin(BULLET.CONFIG.ORIGIN_X, BULLET.CONFIG.ORIGIN_Y);
    bullet.setAngle(180);
    bullet.setPosition(this.character.x + 50, this.character.y);
    bullet.setVelocityX(-BULLET.ATTACK.VELOCITY);
  }

  createSpawnPoints() {
    const spawnholesLayer = this.map.getObjectLayer('objects/spawhole');

    if (!spawnholesLayer?.objects) {
      console.warn('Camada "spawhole" inexistente ou sem objetos. Usando ponto de respawn padrão.');
      this.spawnPoints = [{ x: 150, y: 100 }];
      return;
    }

    this.spawnPoints = spawnholesLayer.objects.map(spawnhole => {
      const { x = 0, y = 0, width = 0 } = spawnhole;
      return { x: x + width / 2, y };
    });
  }

  updateCharacterMovement() {
    if (!this.character || !this.cursors) return;

    this.isPlayerMovingHorizontally =
      this.cursors.left.isDown ||
      this.keyboardInputs.left.isDown ||
      this.cursors.right.isDown ||
      this.keyboardInputs.right.isDown;

    if (this.playerState !== 'DEAD') {
      this.updateHorizontalMovement();
      this.updateVerticalMovement();
    }
  }

  updateHorizontalMovement() {
    if (this.cursors.left.isDown || this.keyboardInputs.left.isDown) {
      this.character.setVelocityX(-CHARACTER.MOVEMENT.GROUND.SPEED);
      this.character.setFlipX(true);

      if (this.isPlayerTouchingGround) {
        this.setPlayerState('RUNNING');
      }
    } else if (this.cursors.right.isDown || this.keyboardInputs.right.isDown) {
      this.character.setVelocityX(CHARACTER.MOVEMENT.GROUND.SPEED);
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
      this.character.setVelocityY(-CHARACTER.MOVEMENT.AIR.SPEED);
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

  updateSwordAttachmentToCharacter() {
    let x = this.character.x;
    let y = this.character.y;
    let angle = 0;
    let offset = SWORD.CONFIG.OFFSET;

    if (this.playerState === 'LOOKING_UP') {
      angle = -90;
      x = this.character.x;
      y = this.character.y - this.character.height * 2 - offset;
    } else if (this.playerState === 'LOOKING_DOWN') {
      angle = 90;
      x = this.character.x;
      y = this.character.y + this.character.height * 2 + offset;
    } else {
      if (this.character.flipX) {
        angle = 180;
        x = this.character.x - this.character.width * 2 - offset;
      } else {
        angle = 0;
        x = this.character.x + this.character.width * 2 + offset;
      }
      y = this.character.y;
    }

    this.sword.setOrigin(SWORD.CONFIG.ORIGIN_X, SWORD.CONFIG.ORIGIN_Y);
    this.sword.setAngle(angle);
    this.sword.setPosition(x, y);
  }

  updateBulletAttachmentToCharacter({ bullet }: { bullet: BulletType }) {
    let x = this.character.x;
    let y = this.character.y;
    let angle = 0;
    let width = BULLET.CONFIG.WIDTH;
    let height = BULLET.CONFIG.HEIGHT;

    if (this.playerState === 'LOOKING_UP') {
      angle = -90;
      width = BULLET.CONFIG.HEIGHT;
      height = BULLET.CONFIG.WIDTH;
      x = this.character.x;
      y = this.character.y - this.character.height / 2 - height / 2;
    } else if (this.playerState === 'LOOKING_DOWN') {
      angle = 90;
      width = BULLET.CONFIG.HEIGHT;
      height = BULLET.CONFIG.WIDTH;
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

    bullet.setOrigin(BULLET.CONFIG.ORIGIN_X, BULLET.CONFIG.ORIGIN_Y);
    bullet.setPosition(x, y);
  }

  updateCharacterAttack() {
    if (!this.canAttack) return;
    this.updateSwordAttack();
    this.updateBulletAttack();
  }

  updateSwordAttack() {
    if (!this.keyboardInputs) return;

    if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.attack)) {
      this.createSword();

      if (this.playerState === 'LOOKING_UP') {
        this.setPlayerState('ATTACKING_UP');
        this.setWeaponState({ newState: 'SWORD_UP', weapon: this.sword });
      } else if (this.playerState === 'LOOKING_DOWN') {
        this.setPlayerState('ATTACKING_DOWN');
        this.setWeaponState({ newState: 'SWORD_DOWN', weapon: this.sword });
      } else {
        this.setPlayerState('ATTACKING_FORWARD');
        this.setWeaponState({ newState: 'SWORD_FORWARD', weapon: this.sword });
      }
    } else {
      if (this.sword) {
        this.destroySprite({ sprite: this.sword, animationKey: 'anims_attack_sword_trail' });
      }

      if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.seppuku_attack)) {
        this.createShinigamiSword();
        this.shinigamiSword.anims.play('anims_attack_sword_trail');
      }
    }
  }

  updateBulletAttack() {
    if (!this.keyboardInputs) return;

    if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.shoot)) {
      if (this.bulletsLeft) {
        const bullet = this.createBullet();

        if (this.playerState === 'LOOKING_UP') {
          this.setPlayerState('ATTACKING_UP');
          this.setWeaponState({ newState: 'SHOOTING_UP', weapon: bullet });
        } else if (this.playerState === 'LOOKING_DOWN') {
          this.setPlayerState('ATTACKING_DOWN');
          this.setWeaponState({ newState: 'SHOOTING_DOWN', weapon: bullet });
        } else {
          this.setPlayerState('ATTACKING_FORWARD');
          this.setWeaponState({ newState: 'SHOOTING_FORWARD', weapon: bullet });
        }

        this.bulletsLeft--;
        this.updateBulletMovement({ bullet });
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.keyboardInputs.seppuku_shot)) {
      this.createBackfireBullet();
    }
  }

  updateBulletMovement({ bullet }: { bullet: BulletType }) {
    switch (this.weaponState) {
      case 'SHOOTING_FORWARD':
        if (this.character.flipX) {
          bullet.setVelocityX(-BULLET.ATTACK.VELOCITY);
        } else {
          bullet.setVelocityX(BULLET.ATTACK.VELOCITY);
        }
        break;
      case 'SHOOTING_UP':
        bullet.setVelocityY(-BULLET.ATTACK.VELOCITY);
        break;
      case 'SHOOTING_DOWN':
        bullet.setVelocityY(BULLET.ATTACK.VELOCITY);
        break;
    }
  }

  destroySprite({
    sprite,
    animationKey,
    state,
    callback,
  }: {
    sprite: Phaser.Physics.Matter.Sprite;
    animationKey: string;
    state?: WeaponState;
    callback?: () => void;
  }) {
    if (sprite.body) {
      sprite.setCollisionCategory(0);
      sprite.setSensor(true);
    }

    state &&
      this.setWeaponState({
        newState: state,
        weapon: sprite,
      });

    sprite.once('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key === animationKey) {
        callback && callback();
        sprite.destroy();
      }
    });
  }

  applyDamage({ target, amount }: { target: Phaser.Physics.Matter.Sprite; amount: number }) {
    if (target === this.character && !this.isInvincible) {
      this.character.health = Math.max(0, this.character.health - amount);
      if (this.character.health <= 0) {
        this.handleCharacterDeath();
      }
    }
  }

  removePlayerLife({ quantity }: { quantity: number } = { quantity: 1 }) {
    this.playerCurrentLives -= quantity;
  }

  activateInvincibility(
    { duration }: { duration: number } = {
      duration: CHARACTER.CONFIG.RESPAWN.INVENCIBILITY.TIME,
    }
  ) {
    this.isInvincible = true;
    this.canAttack = false;

    this.tweens.add({
      targets: this.character,
      alpha: { from: 1, to: 0.5 },
      ease: 'Linear',
      duration: 100,
      repeat: duration / 100 - 1,
      yoyo: true,
      onComplete: () => {
        this.character.setAlpha(1);
        this.isInvincible = false;
        this.canAttack = true;
      },
    });
  }

  handleCharacterDeath() {
    this.setPlayerState('DEAD');
    this.character.setVelocity(0);
    this.enableKeyboard({ value: false });

    this.character.once('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key !== 'anim_dead') return;

      this.removePlayerLife();
      this.character.setActive(false).setVisible(false);

      if (this.playerCurrentLives > 0) {
        this.time.delayedCall(500, () => {
          this.character.setActive(true).setVisible(true);
          this.character.health = CHARACTER.CONFIG.HEALTH;
          this.enableKeyboard({ value: true });
          this.setPlayerState('IDLE');
          this.handleRespawnCharacter();
        });
      }
    });
  }

  handleRespawnCharacter() {
    if (this.playerCurrentLives <= 0) return;

    const randomIndex = Phaser.Math.Between(0, this.spawnPoints.length - 1);
    const spawnPoint = this.spawnPoints[randomIndex];
    const flip = spawnPoint.x > SCENE.WIDTH / 2;

    this.character.setFlipX(flip);
    this.character.setPosition(spawnPoint.x, spawnPoint.y);

    this.activateInvincibility();
  }

  updateLivesDisplay() {
    if (!this.playerLives) return;

    if (this.playerLives.length === this.playerCurrentLives) return;

    const spriteDistance = 15;

    this.playerLives.removeAll(true);

    for (let i = 0; i < this.playerCurrentLives; i++) {
      const lifeSprite = this.add.sprite(i * spriteDistance, 0, 'spr_playerlives');
      this.playerLives.add(lifeSprite);
    }

    this.playerLives.setPosition(
      this.cameras.main.centerX - (this.playerCurrentLives * spriteDistance) / 2,
      0.95 * SCENE.HEIGHT
    );
  }

  enableKeyboard({ value }: { value: boolean }) {
    Object.values(this.keyboardInputs).forEach(key => {
      if (!value) key.reset();
      key.enabled = value;
    });
    Object.values(this.cursors).forEach(key => {
      if (!value) key.reset();
      key.enabled = value;
    });
  }

  async createServerRoom() {
    this.roomConnection = new RoomConnection();
    await this.roomConnection.create();
  }
}
