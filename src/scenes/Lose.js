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

        let menuConfig = {
            fontFamily: 'MS Gothic',
            fontSize: '28px',
            fixedWidth: 0
        }

        this.add.text(
            game.config.width / 2,
            50,
            'The monster just totally ate you. RIP',
            menuConfig
        ).setOrigin(0.5);

        let retryButton = this.add.image(
            game.config.width/2, game.config.height/2 + 100, 'retryButton'
        ).setInteractive();
        let menuButton = this.add.image(
            game.config.width/2, game.config.height/2 + 250, 'menuButton'
        ).setInteractive();

        retryButton.on('pointerover', () => retryButton.alpha = 0.7);
        retryButton.on('pointerout', () => retryButton.alpha = 1);
        retryButton.on('pointerup', () => this.scene.start('playScene'));

        menuButton.on('pointerover', () => menuButton.alpha = 0.7);
        menuButton.on('pointerout', () => menuButton.alpha = 1);
        menuButton.on('pointerup', () => this.scene.start('menuScene'));
    }
}
