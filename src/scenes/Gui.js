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

        //placeholder for flower images
        this.add.rectangle(25, game.config.height - 87, 64, 64, 0xffffff).setOrigin(0,0);
        this.add.rectangle(133, game.config.height - 87, 64, 64, 0xffffff).setOrigin(0,0);
        this.add.rectangle(241, game.config.height - 87, 64, 64, 0xffffff).setOrigin(0,0);

        //this is the counter, maybe should add more space in the GUI
        let textConfig = {
            fontFamily: 'Courier',
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
    }

    incFlower() {
        //Later add parameter in this function and check which flower player picked
        this.flower1++;
        this.flower1Count.text = this.flower1;
    }

    stopScene() {
        this.scene.stop();
    }
}