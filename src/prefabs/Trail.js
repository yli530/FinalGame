class Trail extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.aliveTime = 30;

        scene.time.addEvent({
            delay: 1000,
            callback: () => {this.alpha -= 1/this.aliveTime},
            callbackScope: this,
            loop: true
        });
        scene.time.delayedCall(this.aliveTime*1000, () => {
            this.destroy();
        })
    }
}