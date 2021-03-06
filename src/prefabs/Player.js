class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(keys, scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.keys = keys;
        this.walkSpeed = 200;
        this.sneakSpeed = 75;
        this.direction = 'fwd';
        this.trail = scene.add.group();
        this.timer = Date.now();
        this.sneakTimer = 0;

        /* Adjust physics size. */
        this.setSize(this.width - 4, this.height / 2)
        this.setOffset(0, this.height / 2)
        this.scene.keyImage.x = this.x;
        this.scene.keyImage.y = this.y-128;
    }

    update() {
        this.scene.shiftImage.x = this.x;
        this.scene.shiftImage.y = this.y-150;

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
            if(this.sneakTimer < 60 && this.keys.sneak.isDown){
                this.sneakTimer += 1;
                this.scene.shiftImage.alpha = 1 - (this.sneakTimer/60);
            }else if(this.sneakTimer < 60){
                this.sneakTimer = 0;
            }
            if(this.sneakTimer >= 60) this.scene.shiftImage.alpha = 0;
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
            if(moving){
                this.scene.keysGoAway = true;
            }

            if((Date.now() - this.timer) > interval && moving && !this.keys.sneak.isDown) {
                this.timer = Date.now();
                let footstep = new Trail(this.scene, this.x, this.y+22, 'trail');
                footstep.angle += Math.atan(this.body.velocity.y / this.body.velocity.x) * (180/Math.PI);
                this.trail.add(footstep);
            }
        }

        /* Play animations. */
        if(!this.keys.sneak.isDown){
            if (this.body.velocity.x < -4 || this.body.velocity. x > 4) {
                this.play('player_side', true)
                this.flipX = this.body.velocity.x < 0
                this.direction = 'side';
            } else if (this.body.velocity.y > 4) {
                this.play('player_fwd', true)
                this.direction = 'fwd';
            } else if (this.body.velocity.y < -4) {
                this.play('player_back', true)
                this.direction = 'back';
            } else {
                this.setFrame(this.direction + "_03");
                this.stop();
            }
        }else{
            if (this.body.velocity.x < -4 || this.body.velocity. x > 4) {
                this.play('player_sneak_side', true)
                this.flipX = this.body.velocity.x < 0
                this.direction = 'side';
            } else if (this.body.velocity.y > 4) {
                this.play('player_sneak_fwd', true)
                this.direction = 'fwd';
            } else if (this.body.velocity.y < -4) {
                this.play('player_sneak_back', true)
                this.direction = 'back';
            } else {
                this.setFrame(this.direction + "_03");
                this.stop();
            }
        }
    }
}
