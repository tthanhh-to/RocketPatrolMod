let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu,Play],
}
let game=new Phaser.Game(config);
//setting UI sizes
let borderUISize=game.config.height /15;
let borderPadding=borderUISize/3;

let keyF, keyR, keyLEFT, keyRIGHT;

