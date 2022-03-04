class TitleScene extends Phaser.Scene {
    constructor() {
        super("title_scene");
    }

    preload() {
        this.load.image('title_bg', 'assets/title_screen_background.jpg');
    }

    create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'title_bg');

        this.add.text(100, 80, 'Mi juego');

        var startGameButton = this.add.text(100, 100, 'INICIAR JUEGO');
        startGameButton.setInteractive({ useHandCursor: true });
        startGameButton.on('pointerdown', () => this.startGame());

        var creditsButton = this.add.text(100, 120, 'CRÉDITOS');
        creditsButton.setInteractive({ useHandCursor: true });
        creditsButton.on('pointerdown', () => {
            this.scene.switch('credits_scene');
        });
    }

    startGame() {
        this.scene.switch('level_one');
    }
}

export default TitleScene;