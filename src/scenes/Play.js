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

        //load sfx
        this.load.audio('footstep_1_sfx', './assets/footstep_1.wav');
        this.load.audio('footstep_2_sfx', './assets/footstep_2.wav');
        this.load.audio('footstep_3_sfx', './assets/footstep_3.wav');
        this.load.audio('footstep_4_sfx', './assets/footstep_4.wav');
        this.load.audio('footstep_5_sfx', './assets/footstep_5.wav');
        this.load.audio('get_sfx', './assets/get.wav');
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
        keyUse = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //play music
        this.sound.stopAll();
        this.playMusic = this.sound.add('play_bgm', {
            loop: true
        });
        this.playMusic.play({volume: .6});
        this.playSpooky1 = this.sound.add('spooky_1_bgm', {
            loop: true
        });
        this.playSpooky1.mute = false;
        this.playSpooky1.play({volume: 0});
        this.playSpooky2 = this.sound.add('spooky_2_bgm', {
            loop: true
        });
        this.playSpooky2.mute = false;
        this.playSpooky2.play({volume: 0});
        this.playSpooky3 = this.sound.add('spooky_3_bgm', {
            loop: true
        });
        this.playSpooky3.mute = false;
        this.playSpooky3.play({volume: 0});
        this.playSpooky4 = this.sound.add('spooky_4_bgm', {
            loop: true
        });
        this.playSpooky4.mute = false;
        this.playSpooky4.play({volume: 0});

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

        /* Text for showing the action the player can take. */
        this.helpText = this.add.text(
            0,
            0,
            'Help text',
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
            {
                up: keyUp,
                down: keyDown,
                left: keyLeft,
                right: keyRight,
                sneak: keySneak
            },
            this, 

            game.config.width / 2, 
            game.config.height / 2,
            'player'
        );

        /* Collect flowers. */
        this.physics.add.overlap(this.player, layer, (object1, object2) => {
            if (object2.index == 1) {
                /* Collect when key is pressed. */
                if (keyUse.isDown) {
                    layer.removeTileAt(object2.x, object2.y, true)
                    this.sound.play('get_sfx', {volume: 0.5});
                    /* TODO flower goes to inventory or something. */

                    this.spawnMonster()
                }
                /* Show helper text. */
                this.helpText.text = 'Press E to collect'
                this.helpText.alpha = 1.0
                this.helpText.x = this.map.tileToWorldX(object2.x)
                this.helpText.y = this.map.tileToWorldY(object2.y)
            }
        });

        this.player.depth = 1;

        this.cameras.main.setZoom(2);
    }

    spawnMonster () {
        /* Spawn the monster if they have not been spawned yet. */
        if (!this.monster) {
            this.monster = new Monster({
                scene: this,
                x: -4, /* Start offscreen. */
                y: -4,
                texture: 'monster',
                target: this.player,
                trail: this.player.trail
            })
            this.monster.depth = 2;
            /* Die if you get hit. */
            this.physics.add.overlap(this.monster, this.player, () => {
                this.killPlayer()
            })
        }
    }

    killPlayer () {
        this.scene.start('loseScene');
    }

    update(t, dt) {
        /* Fade help text. */
        this.helpText.alpha = Math.max(0, this.helpText.alpha - dt / 1000)

        //update music spookiness
        this.spookyValue = this.monster
            ? Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.monster.x,
                this.monster.y
            )
            : Infinity; /* No monster = no spooky. */
        if(this.spookyValue > 600){
            this.playSpooky1.setVolume(0);
        }else if(this.spookyValue > 566){
            this.playSpooky1.setVolume(.2);
        }else if(this.spookyValue > 533){
            this.playSpooky1.setVolume(.4);
        }else if(this.spookyValue > 500){
            this.playSpooky1.setVolume(.6);
            this.playSpooky2.setVolume(0);
        }else if(this.spookyValue > 466){
            this.playSpooky2.setVolume(.2);
        }else if(this.spookyValue > 433){
            this.playSpooky2.setVolume(.4);
        }else if(this.spookyValue > 400){
            this.playSpooky2.setVolume(.6);
            this.playSpooky3.setVolume(0);
        }else if(this.spookyValue > 366){
            this.playSpooky3.setVolume(.2);
        }else if(this.spookyValue > 333){
            this.playSpooky3.setVolume(.4);
        }else if(this.spookyValue > 300){
            this.playSpooky3.setVolume(.6);
            this.playSpooky4.setVolume(0);
        }else if(this.spookyValue > 266){
            this.playSpooky4.setVolume(.2);
        }else if(this.spookyValue > 233){
            this.playSpooky4.setVolume(.4);
        }else{
            this.playSpooky4.setVolume(.6);
        }


        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start('menuScene');
        }

        //This is here to be able to test and toggle between
        //seeing entire map and just the player view
        if(Phaser.Input.Keyboard.JustDown(keyK)) {
            //Can change zoom if the camera feels too small or too big
            this.cameras.main.setZoom((this.cameras.main.zoom == 2) ? 1 : 2);
        }

        //This if check only here to make sure camera doesn't move when we are on whole map mode
        if(this.cameras.main.zoom == 2) {
            this.cameras.main.centerOn(this.player.x, this.player.y);
        } else {
            this.cameras.main.centerOn(game.config.width / 2, game.config.height / 2);
        }
        this.player.update();
        if (this.monster) {
            this.monster.update();
        }
    }
}
