class Gui extends Phaser.Scene {
    constructor() {
        super("GUI");
    }

    create() {
        this.flower1 = 0;
        this.flower2 = 0;
        this.flower3 = 0;

        //background image for the gui
        this.add.rectangle(
            20, game.config.height - 90, 93, 70, 0x000000
        ).setOrigin(0,0);
        this.add.rectangle(
            128, game.config.height - 90, 93, 70, 0x000000
        ).setOrigin(0,0);
        this.add.rectangle(
            236, game.config.height - 90, 93, 70, 0x000000
        ).setOrigin(0,0);

        // flower images, maybe scale them up
        this.add.image(57, game.config.height - 55, 'dandelion').setOrigin(0.5);
        this.add.image(165, game.config.height - 55, 'daisy').setOrigin(0.5);
        this.add.image(273, game.config.height - 55, 'lupine').setOrigin(0.5);

        //this is the counter, maybe should add more space in the GUI
        let textConfig = {
            fontFamily: 'Consolas',
            fontSize: '28px',
            fixedWidth: 0
        }

        this.flower1Count = this.add.text(
            101,
            game.config.height - 55,
            this.flower1,
            textConfig
        ).setOrigin(0.5);
        this.flower2Count = this.add.text(
            209,
            game.config.height - 55,
            this.flower2,
            textConfig
        ).setOrigin(0.5);
        this.flower3Count = this.add.text(
            317,
            game.config.height - 55,
            this.flower3,
            textConfig
        ).setOrigin(0.5);

        events.on('update-flower', this.incFlower, this);
        events.on('stopGUI', this.stopScene, this)

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('update-flower', this.incFlower, this);
            events.off('stopGUI', this.stopScene, this);
        })

        /* Text for showing tutorial info to the player. */
        this.tutorialText = this.add.text(
            game.config.width / 2,
            64,
            'Tutorial Text',
            {
                fontFamily: 'Courier',
                fontSize: '28px',
                fixedWidth: 0
            }
        ).setOrigin(0.5).setDepth(5);

        this.tutorialQueue = []
        const tutorialCallback = (state) => {
            this.tutorialQueue.push(state)
        }
        this.tutorialQueueNext = () => {
            this.tutorialQueue.shift()
        }
        events.on('tutorial', tutorialCallback)
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('tutorial', tutorialCallback)
        })

    }

    incFlower() {
        //Later add parameter in this function and check which flower player picked
        this.flower1++;
        this.flower1Count.text = this.flower1;
    }

    stopScene() {
        this.scene.stop();
    }

    update (t, dt) {
        if (this.tutorialQueue.length > 0) {
            this.tutorialText.visible = true
            this.tutorialText.text = this.tutorialQueue[0].message
            this.tutorialQueue[0].update(t, dt, this.tutorialQueueNext)
        } else { 
            this.tutorialText.visible = false
        }
    }
}
