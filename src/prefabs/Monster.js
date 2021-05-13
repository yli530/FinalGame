class Monster extends Phaser.Physics.Arcade.Sprite {
    /*
     * This syntax is called object destructuring, I'm using it here to make the
     * code a little easier to read.
     */
    constructor({
        scene,
        x,
        y,
        texture,
        frame,
        target /* What to follow. */
    }) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.movementSpeed = 100;
        this.target = target
    }

    update() {
        if (this.target) {
            const dx = this.target.x - this.x
            const dy = this.target.y - this.y
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len > this.movementSpeed) {
                this.body.velocity.x = dx * this.movementSpeed / len
                this.body.velocity.y = dy * this.movementSpeed / len
            } else {
                this.body.velocity.x = dx
                this.body.velocity.y = dy
            }
        } else {
            this.body.velocity.x = 0
            this.body.velocity.y = 0
        }
    }
}
