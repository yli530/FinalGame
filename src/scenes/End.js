class End extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    create() {
        this.add.text();
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.video = this.add.video(game.config.width/2, game.config.height/2, 'endCutscene');
        this.video.play();
        this.video.setInteractive();
        this.video.on('pointerup', () => this.scene.start('creditsScene'));
        this.video.on('complete', () => this.scene.start('creditsScene'));
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyP)) {
            this.scene.start('menuScene');
        }
    }
}