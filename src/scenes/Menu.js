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

        this.add.image(game.config.width/2, game.config.height/2, 'mainMenu');
        let playButton = this.add.image(
            game.config.width/2, game.config.height/2 + 100, 'playButton'
        ).setInteractive();
        let creditButton = this.add.image(
            game.config.width/2, game.config.height/2 + 250, 'creditButton'
        ).setInteractive();

        playButton.on('pointerover', () => playButton.alpha = 0.7);
        playButton.on('pointerout', () => playButton.alpha = 1);
        playButton.on('pointerup', () => this.scene.start('playScene'));

        creditButton.on('pointerover', () => creditButton.alpha = 0.7);
        creditButton.on('pointerout', () => creditButton.alpha = 1);
        creditButton.on('pointerup', () => this.scene.start('creditsScene'));

        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start('loseScene');
        }
    }
}
