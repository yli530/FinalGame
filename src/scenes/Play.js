class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, 2100, 1500, 'background').setOrigin(0,0);
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

        this.isMonster = false;

        this.map = this.add.tilemap('birch_forest')
        const tileset = this.map.addTilesetImage('tileset')
        this.map.createLayer('bg', tileset, 0, 0)
        this.map.createLayer('grasses', tileset, 0, 0)
        const layer = this.map.createLayer('collision', tileset, 0, 0)
        this.map.createLayer('tress', tileset, 0, 0)
        
        layer.setCollisionByProperty({ collides: true })
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics, {
            tileColor: null,    // color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        })

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
            if (this.isFlowerTile(object2)) {
                /* Collect when key is pressed. */
                if (keyUse.isDown) {
                    layer.removeTileAt(object2.x, object2.y, true)
                    this.sound.play('get_sfx', {volume: 0.5});
                    /* TODO flower goes to inventory or something. */
                    events.emit('update-flower');
                    let footstep = new Trail(this.player.scene, this.player.x, this.player.y, 'trail');
                    this.player.trail.add(footstep);
                    this.spawnMonster()
                }
                /* Show helper text. */
                this.helpText.text = 'Press E to COLLECT'
                this.helpText.alpha = 1.0
                this.helpText.x = this.map.tileToWorldX(object2.x) + 32
                this.helpText.y = this.map.tileToWorldY(object2.y)
            } else if (this.isHideawayTile(object2)) {
                if (Phaser.Input.Keyboard.JustDown(keyUse)) {
                    if(this.player.isHidden){
                        this.sound.play('pop_sfx');
                    }else{
                        this.sound.play('hide_sfx');
                    }
                    this.player.isHidden = !this.player.isHidden
                }
                /* Show helper text. */
                this.helpText.text = this.player.isHidden
                    ? 'Press E to STOP HIDING'
                    : 'Press E to HIDE'
                this.helpText.alpha = 1.0
                this.helpText.x = this.map.tileToWorldX(object2.x) + 32
                this.helpText.y = this.map.tileToWorldY(object2.y)
            }
        });

        this.player.depth = 1;

        this.cameras.main.setZoom(2);

        this.scene.launch('GUI');

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

    isFlowerTile (tile) {
        return tile.index === 1
    }

    isHideawayTile (tile) {
        return tile.index === 2
    }

    spawnMonster () {
        /* Spawn the monster if they have not been spawned yet. */
        if (!this.isMonster) {
            if(this.monster) this.monster.destroy();
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
            this.cameras.main.setZoom((this.cameras.main.zoom == 2) ? 1 : 2);
        }

        //This if check only here to make sure camera doesn't move when we are on whole map mode
        this.cameras.main.centerOn(this.player.x, this.player.y);

        this.player.update(t, dt);
        if (this.monster) {
            this.monster.update(t, dt);
        }
    }
}
