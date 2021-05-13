class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(keys, scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.keys = keys;
        this.movementSpeed = 100;
        this.setCollideWorldBounds(true);
    }

    update() {
        //console.log(this.body.touching);
        if(this.keys.up.isDown && !this.body.touching.up) {
            this.body.velocity.y = -this.movementSpeed;
        }
        if(this.keys.left.isDown && !this.body.touching.left) {
            this.body.velocity.x = -this.movementSpeed;
        }
        if(this.keys.down.isDown && !this.body.touching.down) {
            this.body.velocity.y = this.movementSpeed;
        }
        if(this.keys.right.isDown && !this.body.touching.right) {
            this.body.velocity.x = this.movementSpeed;
        }
        if(!this.keys.up.isDown && !this.keys.down.isDown) {
            this.body.velocity.y = 0;
        }
        if(!this.keys.left.isDown && !this.keys.right.isDown) {
            this.body.velocity.x = 0;
        }
    }
}