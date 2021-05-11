const game = new Phaser.Game({
    type: Phaser.auto,
    width: 1600,
    height: 900,
    backgroundColor: '#000000',
    scene: [Menu, Play]
})

let keyF; 