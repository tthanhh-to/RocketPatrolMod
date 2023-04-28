class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload(){
        //loading images/sprites
        this.load.image('rocket', './assets/toasty.png');
        this.load.image('spaceship', './assets/toaster.png');
        this.load.image('butter', './assets/butter_stick_1.png');
        this.load.image('sky', './assets/sky.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        //scrolling starfield
        this.sky=this.add.tileSprite(0,0,800,600,'sky').setOrigin(0,0);
        //adds the rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, borderUISize, 'rocket').setOrigin(0.5, 0);
        //adds butter
        this.butter = new Butter(this, game.config.width + borderUISize*10, borderUISize*11, 'butter', 0, 50).setOrigin(0, 0);
        //purple rectangle
        this.add.rectangle(0,borderUISize+borderPadding*34,game.config.width, borderUISize*2,0xead5fe).setOrigin(0,0);
        //adds spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*6, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*7 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*8 + borderPadding*4, 'spaceship', 0, 30).setOrigin(0,0);
        //white border 
        this.add.rectangle(0,0, game.config.width, borderUISize,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,game.config.height-borderUISize,game.config.width,borderUISize,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // defines the keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);    
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        //score calc
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Concert One',
            fontSize: '25px',
            backgroundColor: '#ffeb7a',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*36, this.p1Score, scoreConfig);
        this.scoreTitle = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*34, "Score", scoreConfig);
        scoreConfig.fixedWidth = 150;
        //highscore
        this.highScore = this.add.text(borderUISize + borderPadding*12, borderUISize + borderPadding*34, "Hi-Score", scoreConfig);
        this.highScore = this.add.text(borderUISize + borderPadding*12, borderUISize + borderPadding*36, this.p1Score, scoreConfig);

        //the clock
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/3, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/3 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        let clockConfig = {
            fontFamily: 'Concert One',
            fontSize: '25px',
            backgroundColor: '#ffeb7a',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.clockTitle = this.add.text(borderUISize + borderPadding*45, borderUISize + borderPadding*34, "Time", clockConfig);
        this.clockTime = this.add.text(borderUISize + borderPadding*45, borderUISize + borderPadding*36, 60, clockConfig);
        clockConfig.fixedWidth = 0;
    }
    update() {
        this.clockTime.text=Math.floor(this.clock.getRemainingSeconds());
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.sky.tilePositionX -= 8;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.butter.update();
        } 
        this.highScore.text = localStorage.getItem("highscore");
        if (this.p1Score>localStorage.getItem("highscore")){
            localStorage.setItem("highscore", this.p1Score);
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
          }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.butter)) {
            this.p1Rocket.reset();
            this.shipExplode(this.butter);
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        if (ship==this.butter){
            this.sound.play('sfx_butter');
        }
        else{
            this.sound.play('sfx_toaster_ding');
        }
    }
}