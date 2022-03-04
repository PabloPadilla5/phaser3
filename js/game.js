import TitleScene from './title_screen.js';
import CreditsScene from './credits.js';
import LevelOne from './level_one.js';
import LevelTwo from './level_two.js';
import LevelThree from './level_three.js';

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [TitleScene, CreditsScene, LevelOne, LevelTwo, LevelThree]
};

var game = new Phaser.Game(config);
game.scene.start('title_scene');