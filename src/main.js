const game = new Phaser.Game({
    // feel free to change to webgl is needed
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 900
    },
    scene: [Menu, Play]
})

let keyF, keyUp, keyDown, keyLeft, keyRight, keySneak;
