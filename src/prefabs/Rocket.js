class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,frame){
        super(scene, x,y,texture,frame);
        scene.add.existing(this);
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 4;         // pixels per frame
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }
    update() {
    // left/right movement
        // for left and right keys setting the width of the screen
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        // if fired, move down
        if(this.isFiring && this.y <= game.config.height-borderUISize-borderPadding*3) {
            this.y += this.moveSpeed;
        }
        // reset on miss
        if(this.y >= game.config.height-borderUISize*3.25-borderPadding) {
            this.reset();
        }
    }
    reset(){
        this.isFiring=false;
        this.y=borderUISize;
        //        this.y = game.config.height - borderPadding;
//        this.y = game.config.height - borderUISize - borderPadding;
    }
}