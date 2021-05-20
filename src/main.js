const game = new Phaser.Game({
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
    scene: [Menu, Play, Credits, Lose]
})

let keyF, keyUp, keyDown, keyLeft, keyRight, keySneak, keyK, keyUse;
