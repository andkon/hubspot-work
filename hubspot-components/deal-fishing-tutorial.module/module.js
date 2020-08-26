var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var pond;
var pondGroup;

var game = new Phaser.Game(config);

function preload ()
{
	// this gets called once at the very beginning when `game` is instantiated
  this.load.image('ground', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/atlas.png');
	this.load.spritesheet('pond', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/pond.png', { frameWidth: 54, frameHeight: 39});
	this.load.spritesheet('tile', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/tile.png', { frameWidth: 16, frameHeight: 16});

	this.load.spritesheet('fishA', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/FishA.png', { frameWidth: 16, frameHeight: 16});

	this.load.spritesheet('player', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/hero.png', { frameWidth: 16, frameHeight: 24});
}

function create ()
{
	// this gets called once, after `preload` is finished
	// anything loaded in `preload` is guaranteed to be accessible here
  this.add.tileSprite(400, 300, 800, 600, "tile");

  this.add.image(400, 300, 'ground').setScale(2);

  // create pond
  pondGroup = this.physics.add.staticGroup();

  pond = pondGroup.create(390, 420, 'pond', 0).setScale(2).refreshBody();

}

function update ()
{
	// the game loop calls `update` constantly
}
