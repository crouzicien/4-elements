const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    physics : {
        default : 'arcade',
        arcade : {
            gravity:{
                y : 900
            }
        }
    },
    scene: [Scene1]
}



const game = new Phaser.Game(config)


let player
