class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        //this.background = this.add.tileSprite(0, 0, 2100, 1500, 'background').setOrigin(0,0);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
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

      /*  this.add.text(
            game.config.width / 2,
            54,
            "this is playScene, F to go back to menu\nPress K to change cam between player and whole world",
            {
                fontFamily: 'Consolas',
                fontSize: '28px',
                fixedWidth: 0
            }
        ).setOrigin(0.5).setDepth(5);*/

        /* Text for showing the action the player can take. */
        this.actionText = this.add.text(
            0,
            0,
            'Help text',
            {
                fontFamily: 'Candara',
                fontSize: '28px',
                fixedWidth: 0
            }
        ).setOrigin(0.5).setDepth(5);

        /* For tutorial. */
        this.playerHasSnuck = false

        this.isMonster = false;

        this.map = this.add.tilemap('birch_forest')
        const tileset = this.map.addTilesetImage('tileset')
        this.map.createLayer('bg', tileset, 0, 0)
        this.map.createLayer('grasses', tileset, 0, 0)
        this.map.createLayer('path', tileset, 0, 0)
        const collisionLayer = this.map.createLayer('collision', tileset, 0, 0)
        const flowers = this.map.createLayer('flowers', tileset, 0, 0)
        const hides = this.map.createLayer('hide', tileset, 0, 0)
        this.map.createLayer('trees', tileset, 0, 0)
        
        collisionLayer.setCollisionByExclusion([-1]);

        const playerSpawn = this.map.getObjectLayer('player_spawn')
        this.player = new Player(
            {
                up: keyUp,
                down: keyDown,
                left: keyLeft,
                right: keyRight,
                sneak: keySneak
            },
            this, 
            playerSpawn.objects[0].x,
            playerSpawn.objects[0].y,
            'player'
        );

        this.physics.add.collider(this.player, collisionLayer);

        /* Collect flowers. */
        this.physics.add.overlap(this.player, flowers, (object1, object2) => {
            if (object2.index !== -1) {
                /* Collect when key is pressed. */
                if (keyUse.isDown) {
                    if(this.monster){
                        this.monster.increment += 10;
                    }
                    flowers.removeTileAt(object2.x, object2.y, true)
                    this.sound.play('get_sfx', {volume: 0.5});
                    /* TODO flower goes to inventory or something. */
                    events.emit('update-flower', { tile: object2 });
                    let footstep = new Trail(this.player.scene, this.player.x, this.player.y, 'trail');
                    this.player.trail.add(footstep);
                    this.spawnMonster()
                }
                /* Show helper text. */
                this.actionText.text = 'Press E to COLLECT'
                this.actionText.alpha = 1.0
                this.actionText.x = this.map.tileToWorldX(object2.x) + 32
                this.actionText.y = this.map.tileToWorldY(object2.y)
            }
            /* TODO hideaway. */
            if (false) {
                if (Phaser.Input.Keyboard.JustDown(keyUse)) {
                    if(this.player.isHidden){
                        this.sound.play('pop_sfx');
                    }else{
                        this.sound.play('hide_sfx');
                    }
                    this.player.isHidden = !this.player.isHidden
                }
                /* Show helper text. */
                this.actionText.text = this.player.isHidden
                    ? 'Press E to STOP HIDING'
                    : 'Press E to HIDE'
                this.actionText.alpha = 1.0
                this.actionText.x = this.map.tileToWorldX(object2.x) + 32
                this.actionText.y = this.map.tileToWorldY(object2.y)
            }
        });

        /* Hide. */
        this.physics.add.overlap(this.player, hides, (object1, object2) => {
            if (object2.index !== -1) {
                if (Phaser.Input.Keyboard.JustDown(keyUse)) {
                    if(this.player.isHidden){
                        this.sound.play('pop_sfx');
                    }else{
                        this.sound.play('hide_sfx');
                    }
                    this.player.isHidden = !this.player.isHidden
                }
                /* Show helper text. */
                this.actionText.text = this.player.isHidden
                    ? 'Press E to STOP HIDING'
                    : 'Press E to HIDE'
                this.actionText.alpha = 1.0
                this.actionText.x = this.map.tileToWorldX(object2.x) + 32
                this.actionText.y = this.map.tileToWorldY(object2.y)
            }
        });

        this.player.depth = 1;

        this.cameras.main.setZoom(1.6);

        const allFlowers = flowers.filterTiles(x => x.index !== -1)
        const flowerCounts = {}
        allFlowers
            .map(x => x.index)
            .forEach(x => flowerCounts[x] = (flowerCounts[x] || 0) + 1)
        const flowerTiles = Object.keys(flowerCounts)
            .sort((x, y) => x - y)
            .map(Number)
        /* Get the number of flowers per flower (sorted by index) */
        const totalFlowers = Object.keys(flowerCounts)
            .sort((x, y) => x - y)
            .map(x => flowerCounts[x])

        this.scene.launch('GUI', {
            totalFlowers,
            flowerTiles
        });

        this.textures = this.map.getTileset('tileset');
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        )
        this.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        );
    }

    spawnMonster () {
        /* Spawn the monster if they have not been spawned yet. */
        if (!this.isMonster) {
            if(this.monster) this.monster.destroy();
            events.emit('tutorial', {
                message: 'Hold SHIFT to sneak',
                update (t, dt, next) {
                    /*
                     * Go to the next item in the tutorial if shift is pressed.
                     */
                    if (Phaser.Input.Keyboard.DownDuration(keySneak, 500)) {
                        next()
                    }
                }
            })
            this.monster = new Monster({
                scene: this,
                x: -4, /* Start offscreen. */
                y: -4,
                texture: 'monster',
                target: this.player,
                trail: this.player.trail,
                chase: false
            })
            this.monster.depth = 2;
            this.isMonster = true;
            /* Die if you get hit. */
            this.physics.add.overlap(this.monster, this.player, () => {
                if (!this.player.isHidden) {
                    this.killPlayer()
                }
            })
        }
    }

    killPlayer () {
        events.emit('stopGUI');
        this.isMonster = false;
        this.scene.start('loseScene');
    }

    update(t, dt) {
        /* Fade help text. */
        this.actionText.alpha = Math.max(0, this.actionText.alpha - dt / 1000)

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
            this.playMusic.setVolume(.6);
            this.playSpooky1.setVolume(0);
        }else if(this.spookyValue > 566){
            this.playMusic.setVolume(.53);
            this.playSpooky1.setVolume(.2);
        }else if(this.spookyValue > 533){
            this.playMusic.setVolume(.46);
            this.playSpooky1.setVolume(.4);
        }else if(this.spookyValue > 500){
            this.playMusic.setVolume(.4);
            this.playSpooky1.setVolume(.6);
            this.playSpooky2.setVolume(0);
        }else if(this.spookyValue > 466){
            this.playMusic.setVolume(.33);
            this.playSpooky2.setVolume(.2);
        }else if(this.spookyValue > 433){
            this.playMusic.setVolume(.26);
            this.playSpooky2.setVolume(.4);
        }else if(this.spookyValue > 400){
            this.playMusic.setVolume(.2);
            this.playSpooky2.setVolume(.6);
            this.playSpooky3.setVolume(0);
        }else if(this.spookyValue > 366){
            this.playMusic.setVolume(.13);
            this.playSpooky3.setVolume(.2);
        }else if(this.spookyValue > 333){
            this.playMusic.setVolume(.06);
            this.playSpooky3.setVolume(.4);
        }else if(this.spookyValue > 300){
            this.playMusic.setVolume(.0);
            this.playSpooky3.setVolume(.6);
        }

        if(!this.isMonster){
            this.playMusic.setVolume(.6);
            this.playSpooky1.setVolume(0);
            this.playSpooky2.setVolume(0);
            this.playSpooky3.setVolume(0);
            this.playSpooky4.setVolume(0);
        }

        if(this.isMonster && this.monster.chase == true){
            this.playSpooky4.setVolume(.6);
        }else if(this.isMonster){
            this.playSpooky4.setVolume(0);
        }

        if(this.isMonster && this.monster.playScream == true){
            this.monster.playScream = false;
            let rando = Phaser.Math.Between(1,3);
            if(rando == 1){
                this.sound.play('monster_scream_1_sfx');
            }else if(rando == 2){
                this.sound.play('monster_scream_2_sfx');
            }else{
                this.sound.play('monster_scream_3_sfx');
            }
        }

        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            events.emit('stopGUI');
            this.scene.start('menuScene');
        }

        if(Phaser.Input.Keyboard.JustDown(keyP)) {
            events.emit('stopGUI');
            this.scene.start('endScene');
        }

        //This is here to be able to test and toggle between
        //seeing entire map and just the player view
        if(Phaser.Input.Keyboard.JustDown(keyK)) {
            //Can change zoom if the camera feels too small or too big
            this.cameras.main.setZoom((this.cameras.main.zoom == 1.6) ? 0.25 : 1.6);
        }

        //This if check only here to make sure camera doesn't move when we are on whole map mode
        this.cameras.main.centerOn(this.player.x, this.player.y);

        this.player.update(t, dt);
        if (this.monster) {
            this.monster.update(t, dt);
        }
    }
}
