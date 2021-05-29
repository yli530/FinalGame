class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Candara',
            fontSize: '28px',
            fixedWidth: 0
        }

        this.add.text(
            game.config.width / 2,
            200,
            'THANKS FOR PLAYING',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            200 + 56,
            'Molly Thompson - Art',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            200 + 56 * 2,
            'Jessica Wake - Music and Sound, Add\'l Art & Programming',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            200 + 56 * 3,
            'Yuhong Li - Programming',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            200 + 56 * 4,
            'Tom Cannon - Programming',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width / 2,
            200 + 56 * 5,
            '"Footsteps, Dry Leaves, E.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org',
            menuConfig
        ).setOrigin(0.5);

        let menuButton = this.add.image(
            game.config.width/2, game.config.height/2 + 200, 'menuButton'
        ).setInteractive();

        menuButton.on('pointerover', () => menuButton.alpha = 0.7);
        menuButton.on('pointerout', () => menuButton.alpha = 1);
        menuButton.on('pointerup', () => this.scene.start('menuScene'));
    }
}
