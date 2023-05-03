class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image('sky', './assets/sky.png');
        // load audio
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_butter', './assets/buttered.wav');
        this.load.audio('sfx_ching','./assets/ching.wav');
        this.load.audio('sfx_boing','./assets/boing.wav');
        this.load.audio('sfx_bonk','./assets/bonk.wav');
        this.load.audio('sfx_pew','./assets/pew.wav');
        this.load.audio('sfx_explosion', './assets/assets_explosion38.wav');
        this.load.audio('sfx_rocket', './assets/whoosh.wav');
        this.load.audio('play_music', './assets/play_music.wav');
      }
    create() {
      this.sky=this.add.tileSprite(0,0,800,600,'sky').setOrigin(0,0);

      let menuConfig = {
          fontFamily: 'Concert One',
          fontSize: '28px',
//          backgroundColor: '#ffeb7a',
          color: '#843605',
          align: 'center',
          padding: {
              top: 5,
              bottom: 5,
          },
          fixedWidth: 0
      }
      //menu text
      this.add.text(game.config.width/4, game.config.height/4 - borderUISize - borderPadding, 'TOASTED', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width-100, game.config.height/4, 'Created by \nThanh To', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width-500, game.config.height-250, 'Use ←→ arrows\n to move & \n(F) to fire', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width-104, game.config.height-118, 'Press\n ← for Novice \nor \n→ for Expert', menuConfig).setOrigin(0.5);
      //keys for menu
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 5,
            butterSpeed: 7,
            gameTimer: 61000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 6,
            butterSpeed: 8,
            gameTimer: 46000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
      }
}