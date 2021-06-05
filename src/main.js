/*
"UNCANNY VALLEY"

Team Cave Team Name: Mammoth
Yuhong Li - Programming
Molly Thompson - Art & Design
Jess Wake - Sound, Additional Art & Programming
Tom Cannon - Programming
"Footsteps, Dry Leaves, E.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org

Made for CMPM-120-02, Spring 2021
*/
const game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    render: {pixelArt: true},
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x: 0, y: 0},
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 900
    },
    scene: [Load, Menu, Play, Credits, Lose, End, Gui]
})

let keyF, keyUp, keyDown, keyLeft, keyRight, keySneak, keyK, keyUse, keyP;
const events = new Phaser.Events.EventEmitter();
