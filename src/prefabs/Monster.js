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
        target, /* What to follow. */
        trail /* A group of trail objects to follow. */
    }) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.movementSpeed = 100;
        this.target = target
        this.trail = trail
        /* Keeps track of the trails that have been visited */
        this.visitedTrails = new WeakSet() 
    }

    /* Updates the velocity to move towards the specified target. */
    moveTowards (target) {
        const dx = target.x - this.x
        const dy = target.y - this.y
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > this.movementSpeed) {
            this.body.velocity.x = dx * this.movementSpeed / len
            this.body.velocity.y = dy * this.movementSpeed / len
        } else {
            this.body.velocity.x = dx
            this.body.velocity.y = dy
        }
    }

    update() {
        /* TODO move directly towards player if within distance? */

        /* Follow trails. */
        const unvisitedTrails = (
            this.trail.children.getArray()
            .filter(x => !this.visitedTrails.has(x))
        )
        if (unvisitedTrails.length > 0) {
            /* Find closest trail object. */
            const closestTrail = unvisitedTrails.reduce((a, c) => (
                distanceBetween(this, c) < distanceBetween(this, a)
                ? c
                : a
            ))
            this.moveTowards(closestTrail)
            if (distanceBetween(this, closestTrail) < 100) {
                this.visitedTrails.add(closestTrail)
            }
        } else {
            this.body.velocity.x = 0
            this.body.velocity.y = 0
        }
    }
}
