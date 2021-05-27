class Lose extends Phaser.Scene {
    constructor() {
        super('loseScene');
    }

    create() {
        //play music
        this.sound.stopAll();
        this.playMusic = this.sound.add('death_bgm', {
            loop: false
        });
        this.playMusic.play({volume: .6});

        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        let menuConfig = {
            fontFamily: 'MS Gothic',
            fontSize: '28px',
            fixedWidth: 0
        }

        this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            'The monster just totally ate you. RIP',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            (game.config.height / 2) + 56,
            '-> to replay',
            menuConfig
        ).setOrigin(0.5);
        this.add.text(
            game.config.width / 2,
            (game.config.height / 2) + 56 * 2,
            '<- to go to menu',
            menuConfig
        ).setOrigin(0.5);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRight)) {
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start('menuScene');
        }
    }
}
