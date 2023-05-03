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
        this.load.image('particle','./assets/emmiter_graphicy.png');
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
       //score calc
        this.p1Score = 0;
        let scoreConfig = {
            fontFamily: 'Concert One',
            fontSize: '28px',
            backgroundColor: '#ffeb7a',
            color: '#843605',
            align: 'right',
            padding: {
                top: 3,
                bottom: 3,
            }
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*34, "score\n"+this.p1Score, scoreConfig);
        //fire
        this.fire = this.add.text(borderUISize + borderPadding*30, borderUISize + borderPadding*35, "FIRE", scoreConfig);        
        this.fire.setVisible(false);
        //highscore
        this.highScore = this.add.text(borderUISize + borderPadding*45, borderUISize + borderPadding*34, "hi-Score\n"+this.p1Score, scoreConfig);
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.width=500;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/3, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/3 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        this.clockTime = this.add.text(borderUISize + borderPadding*7, borderUISize + borderPadding*34, 60, scoreConfig);
        this.music =  this.sound.add('play_music', {
            volume: 0.2,
            loop: true
        })
        this.music.play()


    }
    update() {

        if(this.p1Rocket.isFiring){
            this.fire.setVisible(true);
        }
        else{
            this.fire.setVisible(false);
        }
        this.clockTime.text="time\n"+Math.floor(this.clock.getRemainingSeconds());
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.music.stop()
            this.scene.start("menuScene");
        }
        this.sky.tilePositionX -= 6;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.butter.update();
        } 
        this.highScore.text = "hi-score\n"+localStorage.getItem("highscore");
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
        // create explosion sprite at ship's position
        //particle emmiter
        let emitter= this.add.particles(ship.x,ship.y,'particle',{
            alpha: (1, 0, 2000),
            speed: 50,
            lifespan: 750
        });
        //num of particles emmited 
        emitter.explode(10);
        ship.reset();                       // reset ship position
        ship.alpha = 1;                     // make ship visible again
        this.p1Score += ship.points;
        this.scoreLeft.text = "score\n"+this.p1Score;
        if (ship==this.butter){
            this.clock.delay+=4000;
            this.sound.play('sfx_butter');
        }
        else{
            var sfx = Phaser.Math.Between(1, 4);
            if (sfx==1){
                this.sound.play('sfx_ching');
                this.clock.delay+=2000;
            }
            else if(sfx==2){
                this.sound.play('sfx_bonk');
                this.clock.delay+=2000;
            }
            else if(sfx==3){
                this.sound.play('sfx_boing');
                this.clock.delay+=2000;
            }
            else{
                this.sound.play('sfx_pew');
                this.clock.delay+=2000;
            }
        }
        //white border 
        this.add.rectangle(0,0, game.config.width, borderUISize,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,game.config.height-borderUISize,game.config.width,borderUISize,0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    }
}