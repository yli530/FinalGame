const game = new Phaser.Game({
    // feel free to change to webgl is needed
    type: Phaser.CANVAS,
    width: 1600,
    height: 900,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: true
        }
    },
    scene: [Menu, Play]
})

let keyF, keyUp, keyDown, keyLeft, keyRight, keySneak;