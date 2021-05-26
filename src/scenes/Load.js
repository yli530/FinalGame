class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.add.text(game.config.width / 2, (game.config.height / 2) - 50, 'Loading....').setOrigin(0.5);
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xffffff, 1);
            loadingBar.fillRect(0, game.config.height/2, game.config.width * value, 5);
        });

        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.audio('menu_bgm', './assets/menu_bgm.mp3');
        this.load.image('player', './assets/player.png');
        this.load.image('monster', './assets/monster.png');

        //temp trail image
        this.load.image('trail', './assets/trail.png');

        this.load.image('lupine', './assets/lupine.png');
        this.load.image('daisy', './assets/daisy.png');
        this.load.image('dandelion', './assets/dandelion.png');
        
        //temp background so it is easier to see trail
        this.load.image('background', './assets/background.png');

        // tiles
        this.load.image('tileset', './assets/tileset.png');

        // tilemaps
        this.load.tilemapTiledJSON('birch_forest', './assets/birch_forest.json');
        //this.load.tilemapTiledJSON('oak_forest', './assets/oak_forest.json');

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
        this.load.audio('pop_sfx', './assets/pop_out.wav');
        this.load.audio('hide_sfx', './assets/wood_creak.wav');
        this.load.audio('get_sfx', './assets/get.wav');

        //monster sfx
        this.load.audio('monster_wail_1_sfx', './assets/monster_wail_1.wav');
        this.load.audio('monster_wail_2_sfx', './assets/monster_wail_2.wav');
        this.load.audio('monster_wail_3_sfx', './assets/monster_wail_3.wav');
        this.load.audio('monster_scream_1_sfx', './assets/monster_scream_1.wav');
        this.load.audio('monster_scream_2_sfx', './assets/monster_scream_2.wav');
        this.load.audio('monster_scream_3_sfx', './assets/monster_scream_3.wav');

        this.load.audio('death_bgm', './assets/death_bgm.mp3');

        this.load.video('endCutscene', './assets/video.mp4', 'loadeddata', false, true);
    }

    create() {
        this.scene.start('menuScene');
    }
}