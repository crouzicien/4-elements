class Scene1 extends Phaser.Scene {
    player;
    cursors;
    platforms;
    jumpInProgress = false
    velocityPlayer = {
        current: 0,
        right: 250,
        left: -250,
        doubleJump : ()=> {
            if(this.velocityPlayer.doubleJumpDone) return
            this.velocityPlayer.doubleJumpDone = true

            this.player.setVelocityY(-500);
        },
        doubleJumpDone : false
    };

    statePlayer = {
        inLoading : false,
        current : 0,
        list : ['yellow', 'blue', 'green', 'red'],
        switchNext : ()=> {
            if(this.statePlayer.inLoading)  return
            this.statePlayer.inLoading = true
            this.statePlayer.current += 1
            if(this.statePlayer.current > 3) this.statePlayer.current = 0

            this.player.anims.play(this.statePlayer.list[this.statePlayer.current]);
            setTimeout(()=> this.statePlayer.inLoading = false, 100)
        }
    }



    constructor() {
        super("theGame")
    }


    preload() {
        this.load.image('blocss', 'assets/coco.png');
        this.load.spritesheet('dude', 'assets/coco.png', { frameWidth: 64, frameHeight: 64 });
        this.load.tilemapCSV('map', 'assets/map.csv');
    }
    create() {

        this.map = this.make.tilemap({ key: 'map', tileWidth: 64, tileHeight: 64 });
        var tiles = this.map.addTilesetImage("blocss");
        this.layerMap = this.map.createDynamicLayer(0, tiles);

        this.map.setCollision([0, 7, 3]);


        this.player = this.physics.add.sprite(64, 64, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setPosition(50, 1550)

        this.anims.create({
            key: 'blue',
            frames: [{ key: 'dude', frame: 10 }],
            frameRate: 20,
        });
        this.anims.create({
            key: 'yellow',
            frames: [{ key: 'dude', frame: 11 }],
            frameRate: 20,
        });
        this.anims.create({
            key: 'green',
            frames: [{ key: 'dude', frame: 24 }],
            frameRate: 20,
        });
        this.anims.create({
            key: 'red',
            frames: [{ key: 'dude', frame: 25 }],
            frameRate: 20,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.up = this.input.keyboard.addKey('Z');
        this.cursors.down = this.input.keyboard.addKey('S');
        this.cursors.left = this.input.keyboard.addKey('Q');
        this.cursors.right = this.input.keyboard.addKey('D');
        this.cursors.space = this.input.keyboard.addKey('space');



        // Camera
        this.cameras.main.setBounds(0, 0, 6400, 1920);
        this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
        this.cameras.main.setZoom(0.8)

        this.physics.world.setBounds(0, 0, 6400, 1920, true, true, true, true);
        this.physics.add.collider(this.player, this.layerMap);


        this.player.anims.play(this.statePlayer.list[this.statePlayer.current]);
        console.log(this.player.body)


    }

    update() {
        // console.log(this.player.body.velocity)

        if(this.statePlayer.current == 2 && !this.player.body.onFloor() && this.player.body.velocity.y >0) {
            this.physics.world.gravity.y = 100
        }
        else this.physics.world.gravity.y = 900

        if (this.cursors.left.isDown) {
            let velo 
            if(this.statePlayer.current == 0)velo = -350 
            else velo = -250 

            this.player.setVelocityX(velo);
            if (!this.player.body.onFloor()) {
                this.velocityPlayer.current = velo
            }
        }
        else if (this.cursors.right.isDown) {
            let velo 
            if(this.statePlayer.current == 0)velo = 350 
            else velo = 250 

            this.player.setVelocityX(velo);
            if (!this.player.body.onFloor()) {
                this.velocityPlayer.current = velo
            }
        }
        else this.player.setVelocityX(0);


        // Reset Vélocité droite gauche en l'aire
        if(this.player.body.onFloor()) {
            this.velocityPlayer.current = 0
            this.velocityPlayer.doubleJumpDone = false
        }

        // Velocité droite gauche en l'aire
        if (Math.abs(this.velocityPlayer.current.toFixed(2)) > 0.1) {
            this.velocityPlayer.current *=0.99
            this.player.setVelocityX(this.velocityPlayer.current);
        }

        // Saut
        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.jumpInProgress = true
            setTimeout(()=> this.jumpInProgress = false, 500)
            this.player.setVelocityY(-500);
        }
        if (this.cursors.up.isDown && this.statePlayer.current == 2 && !this.player.body.onFloor() && !this.velocityPlayer.doubleJumpDone && !this.jumpInProgress) {
            this.velocityPlayer.doubleJump()
        }


        // Switch
        if(this.cursors.space.isDown ) {
            this.statePlayer.switchNext()
        }
    }
}
