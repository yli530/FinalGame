class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.image('player', './assets/player.png');
        this.load.image('monster', './assets/monster.png');

        //temp trail image
        this.load.image('trail', './assets/trail.png');
        
        //temp background so it is easier to see trail
        this.load.image('background', './assets/background.png');

        // Test tile
        this.load.image('tilemap', './assets/tilemap.png');
    }

    create() {
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySneak = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

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

        const data = generateMap({ width: 32, height: 32 })
        this.map = this.make.tilemap({
            data,
            tileWidth: 64,
            tileHeight: 64
        })
        const tiles = this.map.addTilesetImage('tilemap')
        this.map.createLayer(0, tiles, 0, 0)

        this.player = new Player(
            {up: keyUp, down: keyDown, left: keyLeft, right: keyRight, sneak: keySneak},
            this, 
            game.config.width / 2, 
            game.config.height / 2,
            'player'
        );

        this.monster = new Monster({
            scene: this,
            x: 0,
            y: 0,
            texture: 'monster',
            target: this.player
        })

        this.player.depth = 1;
        this.monster.depth = 2;

        //This will be wall layer/tree layer/whatever that will stop player movement
        this.collisionCheck = new Player(
            {up: undefined, down: undefined, left: undefined, right: undefined},
            this, 
            game.config.width / 2 + 200, 
            game.config.height / 2,
            'player'
        );

        this.collisionCheck.setImmovable();

        this.physics.add.collider(this.player, this.collisionCheck);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start('menuScene');
        }
        this.player.update();
        this.monster.update();
    }
}
