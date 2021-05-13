class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.image('player', './assets/player.png');
    }

    create() {
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.add.text(
            game.config.width / 2,
            54,
            "this is playScene, F to go back to menu",
            {
                fontFamily: 'Courier',
                fontSize: '28px',
                fixedWidth: 0
            }
        ).setOrigin(0.5);

        this.player = new Player(
            {up: keyUp, down: keyDown, left: keyLeft, right: keyRight},
            this, 
            game.config.width / 2, 
            game.config.height / 2,
            'player'
        );
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start('menuScene');
        }
        this.player.update();
    }
}