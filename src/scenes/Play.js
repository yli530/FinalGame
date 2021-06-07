class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.graderMode = false;
        this.keyImage = this.add.image(0, 0, 'keyArrows').setOrigin(0.5,0.5);
        this.keyImage.alpha = 1;
        this.keyImage.depth = 4;
        this.keysGoAway = false;
        this.shiftImage = this.add.image(0, 0, 'keyShift').setOrigin(0.5,0.5);
        this.shiftImage.alpha = 0;
        this.shiftImage.depth = 4;
        this.eImage = this.add.image(0, 0, 'keyE').setOrigin(0.5,0.5);
        this.eImage.alpha = 0;
        this.eImage.depth = 4;
        this.eImage2 = this.add.image(0, 0, 'keyE').setOrigin(0.5,0.5);
        this.eImage2.alpha = 0;
        this.eImage2.depth = 4;
        /* Create animations. */
        this.anims.create({
            key: 'player_fwd',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 8,
                prefix: 'fwd_',
                zeroPad: 2
            }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'player_side',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 8,
                prefix: 'side_',
                zeroPad: 2
            }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'player_back',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 8,
                prefix: 'back_',
                zeroPad: 2
            }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'monster_walk',
            frames: this.anims.generateFrameNames('monster', {
                start: 1,
                end: 12,
                prefix: 'walk_',
                zeroPad: 2
            }),
            frameRate: 15,
            repeat: -1
        })
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySneak = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyUse = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        /* Night timer. */
        this.nightTimer = stopwatch()
        this.loseTime = 4 * 60 /* 4 minutes of gameplay. */

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

        this.isMonster = false;

        this.map = this.add.tilemap('birch_forest');
        const tileset = this.map.addTilesetImage('tileset');
        this.map.createLayer('bg', tileset, 0, 0);
        this.map.createLayer('grasses', tileset, 0, 0);
        this.map.createLayer('path', tileset, 0, 0);
        const collisionLayer = this.map.createLayer('collision', tileset, 0, 0);
        collisionLayer.setDepth(1);
        const flowers = this.map.createLayer('flowers', tileset, 0, 0);
        flowers.setDepth(1);
        const hides = this.map.createLayer('hide', tileset, 0, 0);
        hides.setDepth(1);
        const trees = this.map.createLayer('tree_tops', tileset, 0, 0);
        trees.setDepth(3);
        
        collisionLayer.setCollisionByExclusion([-1, 34, 35, 36, 37, 38, 63, 64, 65, 66]);
        let trunkGrp = this.add.group();

        // very janky implementation of tree trunk collision, idk if there is any other way
        collisionLayer.forEachTile(tile => {
            if((tile.index <= 37 && tile.index >= 34) || (tile.index >= 63 && tile.index <= 66)) {
                var w = (tile.index <= 37 && tile.index >= 34) ? 
                            8 :
                            14;
                var h = 62;
                var offset = (tile.index <= 37 && tile.index >= 34) ?
                                28 :
                                ((tile.index == 63 || tile.index == 65) ? 
                                    ((tile.flipX)? 0 : 50) :
                                    ((tile.flipX)? 50 : 0));
                var trunk = this.physics.add.sprite(tile.pixelX, tile.pixelY, null, null).setOrigin(0, 0).setVisible(false);
                trunk.setImmovable(true);
                trunk.body.setOffset(offset, 0);
                trunk.body.width = w;
                trunk.body.height = h;
                trunkGrp.add(trunk);
            }
        });

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
        this.physics.add.collider(this.player, trunkGrp);

        /* Collect flowers. */
        this.physics.add.overlap(this.player, flowers, (_, object2) => {
            if (object2.index !== -1) {
                /* Collect when key is pressed. */
                if (keyUse.isDown) {
                    if(this.monster){
                        this.monster.increment += 15;
                    }
                    flowers.removeTileAt(object2.x, object2.y, true)
                    this.sound.play('get_sfx', {volume: 0.5});
                    /* TODO flower goes to inventory or something. */
                    events.emit('update-flower', { tile: object2 });
                    let footstep = new Trail(this.player.scene, this.map.tileToWorldX(object2.x)+32, this.map.tileToWorldY(object2.y)+48, 'uproot');
                    this.player.trail.add(footstep);
                    if(!this.monster && !this.graderMode){
                        this.spawnMonster()
                    }
                }
                /* Show helper text. */
                /*this.actionText.text = 'Press E to COLLECT'
                this.actionText.alpha = 1.0
                this.actionText.x = this.map.tileToWorldX(object2.x) + 32
                this.actionText.y = this.map.tileToWorldY(object2.y)*/
                this.eImage2.alpha = 1;
                this.eImage2.x = this.map.tileToWorldX(object2.x) + 32;
                this.eImage2.y = this.map.tileToWorldY(object2.y) - 64;
            }
        });

        /* Hide. */
        this.physics.add.overlap(this.player, hides, (_, object2) => {
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
                /*this.actionText.text = this.player.isHidden
                    ? 'Press E to STOP HIDING'
                    : 'Press E to HIDE'
                this.actionText.alpha = 1.0
                this.actionText.x = this.map.tileToWorldX(object2.x) + 32
                this.actionText.y = this.map.tileToWorldY(object2.y)*/
                this.eImage.alpha = 1;
                this.eImage.x = this.map.tileToWorldX(object2.x) + 32;
                this.eImage.y = this.map.tileToWorldY(object2.y) - 64;
            }
        });

        this.player.depth = 2;

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

        this.nightOverlay = this.add.rectangle(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels,
            0x0F0020
        )
        this.nightOverlay
            .setOrigin(0, 0)
            .setDepth(1000)
            .setBlendMode(Phaser.BlendModes.MULTIPLY)
        this.physics.world.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels
        )

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

        events.on('win', this.win, this);

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('win', this.win, this);
        });
    }

    spawnMonster () {
        /* Spawn the monster if they have not been spawned yet. */
        if (!this.isMonster) {
            if(this.monster) this.monster.destroy();
            /*
            events.emit('tutorial', {
                message: 'Hold SHIFT to sneak',
                update (t, dt, next) {
                    // Go to the next item in the tutorial if shift is pressed.
                    if (Phaser.Input.Keyboard.DownDuration(keySneak, 500)) {
                        next()
                    }
                }
            })
            */
            this.shiftImage.alpha = 1;
            this.rand1 = Phaser.Math.Between(0, 1);
            this.rand2 = Phaser.Math.Between(0, 1);
            this.spawnOffX = this.rand1 ? -1 : 1;
            this.spawnOffY = this.rand2 ? -1 : 1;
            this.monster = new Monster({
                scene: this,
                x: this.player.x - (1200*this.spawnOffX), /* Start far from player. */
                y: this.player.y + (1200*this.spawnOffY),
                texture: 'monster',
                target: this.player,
                trail: this.player.trail,
                chase: false
            })
            this.monster.depth = 3;
            this.isMonster = true;
            /* Die if you get hit. */
            this.physics.add.overlap(this.monster, this.player, () => {
                if (this.monster.chase) {
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
        /* Update time. */
        const nightFade = Math.min(
            1,
            (this.nightTimer.inSeconds() / this.loseTime) ** 2
        )
        this.nightTimer.addMilliseconds(dt)
        this.nightOverlay.setAlpha(nightFade)
        /* grader mode */

        if(!this.monster && keyX.isDown){
            this.actionText.text = 'Grader mode enabled.'
            this.actionText.alpha = 1.0
            this.actionText.x = this.player.x;
            this.actionText.y = this.player.y-64;
            this.graderMode = true;
        }
        /* Set page color. */
        {
            const t = nightFade
            const lerp = Phaser.Math.Linear
            const color = `rgb(${lerp(255, 15, t)}, ${lerp(255, 0, t)}, ${lerp(255, 32, t)})`
            document.body.style.background = color
        }

        if (this.nightTimer.inSeconds() >= this.loseTime) {
            this.killPlayer()
        }

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
        // dynamic zoom feature
        /*
        if(this.monster) this.spookyValue += this.monster.increment;
        this.dynamicZoom = 1.6 + (350-this.spookyValue)/1500;
        if (this.dynamicZoom < 1.6) this.cameras.main.setZoom(1.6);
        else this.cameras.main.setZoom(this.dynamicZoom);
        */

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

        /*if(Phaser.Input.Keyboard.JustDown(keyF)) {
            events.emit('stopGUI');
            this.scene.start('menuScene');
        }*/

        /*if(Phaser.Input.Keyboard.JustDown(keyP)) {
            this.win();
        }*/

        //This is here to be able to test and toggle between
        //seeing entire map and just the player view
        /*if(Phaser.Input.Keyboard.JustDown(keyK)) {
            //Can change zoom if the camera feels too small or too big
            this.cameras.main.setZoom((this.cameras.main.zoom == 1.6) ? 0.25 : 1.6);
        }*/

        //This if check only here to make sure camera doesn't move when we are on whole map mode
        this.cameras.main.centerOn(this.player.x, this.player.y);

        this.player.update(t, dt);
        if (this.monster) {
            this.monster.update(t, dt);
        }

        if(this.eImage.alpha > 0){
            this.eImage.alpha -= .1;
        }
        if(this.eImage2.alpha > 0){
            this.eImage2.alpha -= .1;
        }
        if(this.keyImage.alpha > 0 && this.keysGoAway == true){
            this.keyImage.alpha -= .1;
        }
    }

    win() {
        events.emit('stopGUI');
        this.scene.start('endScene');
    }
}
