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

        this.add.image(game.config.width/2, game.config.height/2, 'deathScreen');

        let retryButton = this.add.image(
            280, game.config.height/2 + 180, 'retryButtonD'
        ).setInteractive();
        let menuButton = this.add.image(
            280, game.config.height/2 + 330, 'menuButtonD'
        ).setInteractive();

        retryButton.on('pointerover', () => retryButton.alpha = 0.7);
        retryButton.on('pointerout', () => retryButton.alpha = 1);
        retryButton.on('pointerup', () => this.scene.start('playScene'));

        menuButton.on('pointerover', () => menuButton.alpha = 0.7);
        menuButton.on('pointerout', () => menuButton.alpha = 1);
        menuButton.on('pointerup', () => this.scene.start('menuScene'));
    }
}
