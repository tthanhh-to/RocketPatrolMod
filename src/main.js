//5 Implement the 'FIRE' UI text from the original game 
//5 Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) 
//5 Track a high score that persists across scenes and display it in the UI
//5 Create a new scrolling tile sprite for the background 
//5 Allow the player to control the Rocket after it's fired
//25
//10 Create a new title screen (e.g., new artwork, typography, layout)
//10 Display the time remaining (in seconds) on the screen 
//10 Create 4 new explosion sound effects and randomize which one plays on impact
//30
//15 Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points 
//15 Implement a new timing/scoring mechanism that adds time to the clock for successful hits
//15 Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship
//45
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

