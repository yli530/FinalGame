class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(keys, scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.keys = keys;
        this.walkSpeed = 200;
        this.sneakSpeed = 100;

        this.trail = scene.add.group();
        this.timer = Date.now();
    }

    update() {
        if (this.isHidden) {
            this.visible = false
            /* Don't move. */
            this.body.velocity.x = 0
            this.body.velocity.y = 0
        } else {
            this.visible = true
            const movementSpeed = (
                this.keys.sneak.isDown
                ? this.sneakSpeed
                : this.walkSpeed
            )
            const interval = 50000 / movementSpeed;
            if(this.keys.up.isDown && !this.body.touching.up) {
                this.body.velocity.y = -1;
            }
            if(this.keys.left.isDown && !this.body.touching.left) {
                this.body.velocity.x = -1;
            }
            if(this.keys.down.isDown && !this.body.touching.down) {
                this.body.velocity.y = 1;
            }
            if(this.keys.right.isDown && !this.body.touching.right) {
                this.body.velocity.x = 1;
            }
            if(!this.keys.up.isDown && !this.keys.down.isDown) {
                this.body.velocity.y = 0;
            }
            if(!this.keys.left.isDown && !this.keys.right.isDown) {
                this.body.velocity.x = 0;
            }
            /* Normalize if necessary. */
            const len = Math.sqrt(this.body.velocity.x **2 + this.body.velocity.y ** 2)
            if (len > 0) {
                this.body.velocity.x *= movementSpeed / len
                this.body.velocity.y *= movementSpeed / len
            }
            
            const moving = !(this.body.velocity.x == 0 && this.body.velocity.y == 0);

            if((Date.now() - this.timer) > interval && moving && !this.keys.sneak.isDown) {
                this.timer = Date.now();
                let footstep = new Trail(this.scene, this.x, this.y, 'trail');
                footstep.angle += Math.atan(-this.body.velocity.y / this.body.velocity.x) * (180/Math.PI);
                this.trail.add(footstep);
            }
        }
    }
}
