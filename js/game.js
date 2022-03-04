import TitleScene from './titleScreen';
import CreditsScene from './credits';
import LevelOne from './levelOne';
import LevelTwo from './levelTwo';
import LevelThree from './levelThree';

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
game.scene.start('titleScene');