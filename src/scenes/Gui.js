class Gui extends Phaser.Scene {
    constructor() {
        super("GUI");
    }

    create(props) {
        this.totalFlowers = props.totalFlowers
        this.flowerTiles = props.flowerTiles
        this.flowers = ['dandelion', 'lupine', 'daisy']
        this.flowerCounts = this.flowers.map(() => 0) // set this to 2 if you want to test winning
        this.flowerTexts = this.flowers.map(() => null)

        //this is the counter, maybe should add more space in the GUI
        let textConfig = {
            fontFamily: 'Consolas',
            fontSize: '32px',
            fixedWidth: 0
        }

        const spacing = 128
        this.flowers.forEach((flower, i) => {
            /* Background. */
            this.add.rectangle(
                16 + spacing * i, game.config.height - 90, 120, 70, 0x000000
            ).setOrigin(0,0).setAlpha(0.5);

            /* Icon. */
            this.add.image(
                46 + spacing * i,
                game.config.height - 55,
                flower
            ).setOrigin(0.5);

            /* Text. */
            this.flowerTexts[i] = this.add.text(
                98 + spacing * i,
                game.config.height - 55,
                this.flowerCounts[i] + '/' + this.totalFlowers[i],
                textConfig
            ).setOrigin(0.5);
        })

        events.on('update-flower', this.incFlower, this);
        events.on('stopGUI', this.stopScene, this)

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            events.off('update-flower', this.incFlower, this);
            events.off('stopGUI', this.stopScene, this);
        })

        /* Text for showing tutorial info to the player. */
        this.tutorialText = this.add.text(
            game.config.width / 2,
            200,
            'Tutorial Text',
            textConfig
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

    incFlower({ tile }) {
        const index = this.flowerTiles.indexOf(tile.index)
        this.flowerCounts[index] += 1
        this.flowerTexts[index].text = (
            this.flowerCounts[index] + '/' +
            this.totalFlowers[index]
        )
        for(var i in this.flowers) {
            if(this.flowerCounts[i] < 3) return;
        }
        //do end screen stuff here
        console.log('player has won');
        //maybe do some kind of animation of the monster catching up to player b4 going to the end video
        //like let monster catch up to player after getting last flower then go to the end cutscene
        events.emit('win');
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
