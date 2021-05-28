class Trail extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        let randSound = Phaser.Math.Between(1,5);
        if(randSound == 1){
            scene.sound.play('footstep_1_sfx', {volume: 0.05});
        }else if(randSound == 2){
            scene.sound.play('footstep_2_sfx', {volume: 0.05});
        }else if(randSound == 3){
            scene.sound.play('footstep_3_sfx', {volume: 0.05});
        }else if(randSound == 4){
            scene.sound.play('footstep_4_sfx', {volume: 0.05});
        }else {
            scene.sound.play('footstep_5_sfx', {volume: 0.05});
        }
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