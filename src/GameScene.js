import Phaser from 'phaser'

const GROUND_KEY = 'ground'
const PC_IDLE_KEY = 'pc-idle'
const PC_RUN_KEY = 'pc-run'
const PC_JUMP_KEY = 'pc-jump'
const PC_DOUBLE_JUMP_KEY = 'pc-double-jump'
const PC_LAND_KEY = 'pc-land'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene')

    this.player = undefined
    this.cursors = undefined
  }

  preload() {
    this.load.image(GROUND_KEY, 'assets/props/platform.png')

    this.load.spritesheet(PC_IDLE_KEY, 'assets/player-character/idle.png', { frameWidth: 48, frameHeight: 40 })
    this.load.spritesheet(PC_RUN_KEY, 'assets/player-character/run.png', { frameWidth: 48, frameHeight: 40 })
    this.load.spritesheet(PC_JUMP_KEY, 'assets/player-character/jump.png', { frameWidth: 48, frameHeight: 40 })
    this.load.spritesheet(PC_DOUBLE_JUMP_KEY, 'assets/player-character/airspin.png', { frameWidth: 48, frameHeight: 40 })
    this.load.spritesheet(PC_LAND_KEY, 'assets/player-character/land.png', { frameWidth: 48, frameHeight: 40 })
  }

  create() {
    const platforms = this.createPlatforms()
    this.player = this.createPlayer()
    this.physics.add.collider(this.player, platforms)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup()
    platforms.create(400, 600, 'ground').setScale(2).refreshBody()

    const ledges = [
      { x: 600, y: 450, key: GROUND_KEY },
      { x: 50, y: 350, key: GROUND_KEY },
      { x: 650, y: 250, key: GROUND_KEY },
      { x: 100, y: 150, key: GROUND_KEY }
    ]

    ledges.forEach((ledge) => {
      platforms.create(ledge.x, ledge.y, ledge.key)
    })

    return platforms
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, PC_IDLE_KEY)
    player.setBounce(0.15)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers(PC_IDLE_KEY, { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers(PC_RUN_KEY, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers(PC_JUMP_KEY, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: 1
    })

    this.anims.create({
      key: 'double-jump',
      frames: this.anims.generateFrameNumbers(PC_DOUBLE_JUMP_KEY, { start: 0, end: 5 }),
      frameRate: 10,
      repeat: 1
    })

    this.anims.create({
      key: 'land',
      frames: this.anims.generateFrameNumbers(PC_LAND_KEY, { start: 0, end: 8 }),
      frameRate: 10,
      repeat: 1
    })

    return player
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
      this.player.flipX = true

      this.player.anims.play('run', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
      this.player.flipX = false
      this.player.anims.play('run', true)
    } else {
      this.player.setVelocityX(0)

      this.player.anims.play('idle', true)
    }
  }
}
