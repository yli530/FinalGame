class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            fixedWidth: 0
        }

        this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            'This is the credits scene',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2 + 56,
            'Molly Thompson - Art',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2 + 56 * 2,
            'Jessica Wake - Music',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2 + 56 * 3,
            'Yuhong Li - Programming',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            game.config.height / 2 + 56 * 4,
            'Tom Cannon - Programming',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            (game.config.height / 2) + 56 * 5,
            '<- to go to menu scene',
            menuConfig
        ).setOrigin(0.5);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start('menuScene');
        }
    }
}
