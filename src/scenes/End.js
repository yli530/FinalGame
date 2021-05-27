class End extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    create() {
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.video = this.add.video(game.config.width/2, game.config.height/2, 'endCutscene');
        this.video.play();
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyP)) {
            this.scene.start('menuScene');
        }
    }
}