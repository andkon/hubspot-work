
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

var player;
var cursors;
var pond;
var pondDwellers = [];
var pondGroup;
var fishingZone;
var spaceDown = false;

var fishes;

var game = new Phaser.Game(config);

function preload ()
{
  // `this` refers not to the game object - but the scene!
  this.load.image('ground', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/atlas.png');

  this.load.spritesheet('fishA', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/FishA.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('fishB', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/FishB.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('fishC', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/FishC.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('eelA', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/EelA.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('eelB', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/EelB.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('eelC', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/EelC.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('eelD', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/EelD.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('worm', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/WormG.png', { frameWidth: 16, frameHeight: 16});
  this.load.spritesheet('tile', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/tile.png', { frameWidth: 16, frameHeight: 16});

  pondDwellers.push('fishA','fishB','fishC','eelA','eelB','eelC','eelD','worm');

  this.load.spritesheet('player', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/hero.png', { frameWidth: 16, frameHeight: 24});
  this.load.spritesheet('pond', 'https://f.hubspotusercontent20.net/hubfs/8311725/assets/pond.png', { frameWidth: 54, frameHeight: 39});
}

function create ()
{
  var background = this.add.tileSprite(400, 300, 800, 600, "tile");

  this.add.image(400, 300, 'ground').setScale(2);

  player = this.physics.add.sprite(100, 450, 'player').setScale(2).refreshBody();
  player.setCollideWorldBounds(true);
  // player.setBodySize(10, 18, true);

  // create pond
  pondGroup = this.physics.add.staticGroup();

  pond = pondGroup.create(390, 420, 'pond', 0).setScale(2).refreshBody();

  this.physics.add.collider(player, pondGroup);

  fishingZone = this.add.zone(pond.x, pond.y, pond.width + 2, pond.height).setScale(2);
  this.physics.world.enable(fishingZone);

  this.anims.create({
    key: 'sideways',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2}),
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
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', {start: 8, end: 10}),
    frameRate: 10,
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

  // pond animation
  this.anims.create({
    key: 'pondFishing',
    frames: this.anims.generateFrameNumbers('pond', {start: 1, end: 2}),
    frameRate: 1,
    repeat: -1
  });

  this.anims.create({
    key: 'pondStill',
    frames: [ {key: 'pond', frame: 0}],
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'pondTug',
    frames: this.anims.generateFrameNumbers('pond', {start: 3, end: 4}),
    frameRate: 5,
    repeat: 4
  });

  fishes = this.physics.add.staticGroup();

  // input events
  cursors = this.input.keyboard.createCursorKeys();
  cursors.space.emitOnRepeat = false;

}

function update ()
{
  if (cursors.left.isDown) {
    player.setVelocityX(-160, 0);

    player.setFlipX(false);
    player.anims.play('sideways', true);
  } else if (cursors.right.isDown) {
    player.setVelocity(160, 0);

    player.setFlipX(true);
    player.anims.play('sideways', true);
  } else if (cursors.up.isDown) {
    player.setVelocity(0, -160);

    player.anims.play('up', true);
  } else if (cursors.down.isDown) {
    player.setVelocity(0, 160);

    player.anims.play('down', true);
  } else if (cursors.space.isDown && (this.physics.world.overlap(player, fishingZone)) && spaceDown === false) {
    spaceDown = true;

    if (player.state === "fishing") {
      // The player is currently fishing

      if (pond.anims.getCurrentKey() === "pondTug") {
        // there's a catchable fish

        // first, create a fish object
        fish = fishes.create(pond.getCenter().x, pond.getCenter().y, pondDwellers[Math.floor(Math.random() * pondDwellers.length)], 4).setOrigin(0.5, 0.5).setScale(3).refreshBody();
        console.log(pondDwellers);
        // put it right at the center of the pond
        // then animate it up to the top of the player's body
        var tween = this.tweens.add({
          targets: fish,
          x: player.getTopCenter().x,
          y: player.getTopCenter().y,
          ease: 'Linear',
          completeDelay: 1000,
          onComplete: function () {
            // POST new fish here
            fish.destroy();
          }
        });

        // now we'll show the player celebrate
        player.anims.play('caughtFish', true);
        player.state = "normal";

        // we'll clear the pond's animation chain and reset everything
        pond.anims.stop();
        pond.anims.play('pondStill');
      } else {
        // just stop fishing
        player.anims.play('sideways', true);

        pond.anims.play('pondStill', true);

        player.state = "normal";
      }
    } else {
      // The player should begin fishing!
      player.anims.play('cast', true);

      pond.anims.play('pondFishing');
      pond.anims.stopAfterDelay(Phaser.Math.Between(2000,4000)); // random

      console.log(pond.anims.nextAnimsQueue);
      pond.anims.chain('pondTug');
      pond.on('animationcomplete-pondTug', finishedFishing);
      pond.anims.chain('pondFishing');

      player.state = "fishing";
    }
  } else if (cursors.space.isUp) {
    // has released the spacebar
    player.setVelocity(0, 0);
    spaceDown = false;
    player.anims.pause();
  } else {
    // if the above keys are being pressed, the user shouldn't be moving
    player.setVelocity(0, 0);

    player.anims.pause();
  }

}

function finishedFishing (animation, frame, gameObject)
{
  if (player.state === 'fishing') {
    // stop the current animation
    pond.anims.stopAfterDelay(Phaser.Math.Between(2000,4000)); // random

    // add a new animation
    pond.anims.chain('pondTug');
    pond.on('animationcomplete-pondTug', finishedFishing);
    pond.anims.chain('pondFishing');

  }
}
