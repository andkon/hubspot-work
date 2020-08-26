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
var player;

var game = new Phaser.Game(config);

function preload ()
{
	// this gets called once at the very beginning when `game` is instantiated
  this.load.image('ground', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/map.png');
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

  // create player
  player = this.physics.add.sprite(100, 450, 'player').setScale(2).refreshBody();
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'sideways',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', {start: 8, end: 10}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'cast',
    frames: [ {key: 'player', frame: 3}],
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('player', {start: 4, end: 6}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'caughtFish',
    frames: [{key: 'player', frame: 13}],
    frameRate: 20,
    repeat: -1
  });

}

function update ()
{
	// the game loop calls `update` constantly
}
