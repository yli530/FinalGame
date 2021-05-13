class Player extends Phaser.GameObjects.Sprite {
    constructor(keys, scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        this.keys = keys;
        this.movementSpeed = 3;
    }

    update() {
        if(this.keys.up.isDown) {
            this.y -= this.movementSpeed;
        }
        if(this.keys.left.isDown) {
            this.x -= this.movementSpeed;
        }
        if(this.keys.right.isDown) {
            this.x += this.movementSpeed;
        }
        if(this.keys.down.isDown) {
            this.y += this.movementSpeed;
        }
    }
}