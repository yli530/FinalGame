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

        //loading bgm 
        this.load.audio('play_bgm', './assets/play_bgm.mp3');
        this.load.audio('spooky_1_bgm', './assets/spooky_1_bgm.mp3');
        this.load.audio('spooky_2_bgm', './assets/spooky_2_bgm.mp3');
        this.load.audio('spooky_3_bgm', './assets/spooky_3_bgm.mp3');
        this.load.audio('spooky_4_bgm', './assets/spooky_4_bgm.mp3');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 2100, 1500, 'background').setOrigin(0,0);
        keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySneak = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        //play music
        this.sound.stopAll();
        this.playMusic = this.sound.add('play_bgm', {
            loop: true
        });
        this.playMusic.play();
        this.playSpooky1 = this.sound.add('spooky_1_bgm', {
            loop: true
        });
        this.playSpooky1.mute = true;
        this.playSpooky1.play();
        this.playSpooky2 = this.sound.add('spooky_2_bgm', {
            loop: true
        });
        this.playSpooky2.mute = true;
        this.playSpooky2.play();
        this.playSpooky3 = this.sound.add('spooky_3_bgm', {
            loop: true
        });
        this.playSpooky3.mute = true;
        this.playSpooky3.play();
        this.playSpooky4 = this.sound.add('spooky_4_bgm', {
            loop: true
        });
        this.playSpooky4.mute = true;
        this.playSpooky4.play();

        //music controller
        this.spookyValue = 0;

        this.add.text(
            game.config.width / 2,
            54,
            "this is playScene, F to go back to menu\nPress K to change cam between player and whole world",
            {
                fontFamily: 'Courier',
                fontSize: '28px',
                fixedWidth: 0
            }
        ).setOrigin(0.5).setDepth(5);

        this.cameras.main.setBounds(0, 0, 1600, 900);

        const data = generateMap({
            width: 32,
            height: 32,
            pathTile: 0,
            flowerTile: 1
        })
        this.map = this.make.tilemap({
            data,
            tileWidth: 64,
            tileHeight: 64
        })
        const tiles = this.map.addTilesetImage('tilemap')
        const layer = this.map.createLayer(0, tiles, 0, 0)
        /* Enable collision for flowers (tile 1). */
        this.map.setCollisionBetween(1, 2)

        this.player = new Player(
            {up: keyUp, down: keyDown, left: keyLeft, right: keyRight, sneak: keySneak},
            this, 
            game.config.width / 2, 
            game.config.height / 2,
            'player'
        );

        /* Collect flowers. */
        this.physics.add.overlap(this.player, layer, (object1, object2) => {
            if (object2.index == 1) {
                layer.removeTileAt(object2.x, object2.y, true)
                /* TODO flower goes to inventory or something. */
            }
        });

        this.monster = new Monster({
            scene: this,
            x: 0,
            y: 0,
            texture: 'monster',
            target: this.player,
            trail: this.player.trail
        })

        this.player.depth = 1;
        this.monster.depth = 2;
    }

    update() {
        //update music spookiness
        this.spookyValue = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.monster.x, this.monster.y);
        if(this.spookyValue > 700){
            this.playSpooky1.mute = true;
        }else if(this.spookyValue > 600){
            this.playSpooky1.mute = false;
            this.playSpooky2.mute = true;
        }else if(this.spookyValue > 500){
            this.playSpooky1.mute = false;
            this.playSpooky2.mute = true;
        }else if(this.spookyValue > 400){
            this.playSpooky2.mute = false;
            this.playSpooky3.mute = true;
        }else if(this.spookyValue > 300){
            this.playSpooky3.mute = false;
            this.playSpooky4.mute = true;
        }else{
            this.playSpooky4.mute = false;
        }


        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start('menuScene');
        }

        //This is here to be able to test and toggle between
        //seeing entire map and just the player view
        if(Phaser.Input.Keyboard.JustDown(keyK)) {
            //Can change zoom if the camera feels too small or too big
            this.cameras.main.setZoom((this.cameras.main.zoom == 4) ? 1 : 4);
        }

        //This if check only here to make sure camera doesn't move when we are on whole map mode
        if(this.cameras.main.zoom == 4) {
            this.cameras.main.centerOn(this.player.x, this.player.y);
            console.log(this.cameras.main);
        } else {
            this.cameras.main.centerOn(game.config.width / 2, game.config.height / 2);
        }
        this.player.update();
        this.monster.update();
    }
}
