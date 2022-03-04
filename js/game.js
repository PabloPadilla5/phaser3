import TitleScene from './title_screen';
import CreditsScene from './credits';
import LevelOne from './level_one';
import LevelTwo from './level_two';
import LevelThree from './level_three';

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