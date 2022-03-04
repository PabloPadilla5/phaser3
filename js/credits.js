class CreditsScene extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        this.add.text(100, 60, 'Centro Universitario de Ciencias Exactas e Ingenierías');
        this.add.text(100, 80, 'Desarrollado por: Pablo Alexis Padilla Maldonado');
        this.add.text(100, 100, 'Código: 220289236');
        this.add.text(100, 120, 'Materia: Programación para Internet (2022A)');
        this.add.text(100, 140, 'Sección: D04');
        this.add.text(100, 160, 'Profesor: Jose Luis David Bonilla Carranza');

        var backButton = this.add.text(100, 200, 'REGRESAR');
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => this.goBack());
    }

    goBack() {
        this.scene.switch('titleScene');
    }
}

export default CreditsScene;