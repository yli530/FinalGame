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
        trail,
        chase
    }) {
        super(scene, x, y, texture, frame);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.movementSpeed = 100;
        this.target = target
        this.trail = trail
        this.chase = chase
        /* Keeps track of the trails that have been visited */
        this.visitedTrails = new WeakSet() 
        this.nextMoveTime = 0
    }

    /* Updates the velocity to move towards the specified position. */
    moveTowardsPosition (x, y) {
        const dx = x - this.x
        const dy = y - this.y
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > this.movementSpeed || this.chase) {
            this.body.velocity.x = dx * this.movementSpeed / len
            this.body.velocity.y = dy * this.movementSpeed / len
        } else {
            this.body.velocity.x = dx
            this.body.velocity.y = dy
        }
    }

    /* Updates the velocity to move towards the specified target. */
    moveTowards (target) {
        return this.moveTowardsPosition(target.x, target.y)
    }

    update(t, dt) {
        /* TODO move directly towards player if within distance? */

        /* Fixes some weird phaser issue with trails.children being null. */
        if (!this.trail || !this.trail.children) {
            return
        }

        /* Determining chase value */
        if(this.chase == false){
            this.chase = (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 300);
        }else{
            this.chase = (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 450);
        }

        if(this.chase == false){
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
                /* Wander around aimlessly if no trails are around. */
                if (t > this.nextMoveTime) {
                    /* Choose next time to move. */
                    this.nextMoveTime = t + Math.random() * 2000 + 500
                    this.moveTowardsPosition(
                        this.x + Math.random() * 1000 - Math.random() * 1000,
                        this.y + Math.random() * 1000 - Math.random() * 1000
                    )
                }
            }
        }else{
            this.moveTowards(this.target);
            this.movementSpeed += 0.05;
        }
    }
}
