class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        //play music
        this.sound.stopAll();
        this.playMusic = this.sound.add('menu_bgm', {
            loop: true
        });
        this.playMusic.play({volume: .6});

        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        let menuConfig = {
            fontFamily: 'Candara',
            fontSize: '30px',
            fixedWidth: 0
        }

        this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            'This is menu scene',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            (game.config.height / 2) + 56,
            '-> to go to game scene',
            menuConfig
        ).setOrigin(0.5);
        this.add.text(
            game.config.width / 2,
            (game.config.height / 2) + 56 * 2,
            '<- to go to credits',
            menuConfig
        ).setOrigin(0.5);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRight)) {
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start('creditsScene');
        }
    }
}
