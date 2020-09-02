var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
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
var fishingZone;

var cursors;
var spacebarHeld = false;

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
    key: 'pondBite',
    frames: this.anims.generateFrameNumbers('pond', {start: 3, end: 4}),
    frameRate: 5,
    repeat: 4
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  if (player.state != "fishing") {
    // movement is allowed
    if (cursors.up.isDown) {
      player.setVelocity(0, -160);

      player.anims.play('up', true);
    } else if (cursors.down.isDown) {
      player.setVelocity(0, 160);

      player.anims.play('down', true);
    } else if (cursors.left.isDown) {
      player.setVelocity(-160, 0);

      player.setFlipX(false);
      player.anims.play('sideways', true);
    } else if (cursors.right.isDown) {
      player.setVelocity(160, 0);

      player.setFlipX(true);
      player.anims.play('sideways', true);
    } else {
      // if the above keys are being pressed, the user shouldn't be moving
      player.setVelocity(0, 0);

      player.anims.pause();
    }
  }

  if (cursors.space.isDown && (this.physics.world.overlap(player, fishingZone)) && spacebarHeld === false) {
    spacebarHeld = true;
    console.log("Fishing!")

    if (player.state === "fishing") {
      // The player is currently fishing
      if (pond.anims.getCurrentKey() === "pondBite") {
        // there's a catchable fish!
        // first, create a fish object
        fish = this.physics.add.sprite(pond.getCenter().x, pond.getCenter().y, 'fishA', 4).setOrigin(0.5, 0.5).setScale(3).refreshBody();
        // then animate it up to the top of the player's body
        var tween = this.tweens.add({
          targets: fish,
          x: player.getTopCenter().x,
          y: player.getTopCenter().y,
          ease: 'Linear',
          completeDelay: 1000,
          onComplete: function () {
            fish.destroy();
            player.state = "normal";

            let data = {element: "barium"};

            // POST new fish here
            fetch("https://konoffcarnivalgames-8311725.hs-sites.com/_hcms/api/deals", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ fish: Phaser.Math.Between(1, 100)})
            }).then(res => {
              return res.json()
            }).then(data => {
              console.log(data);
            });
          }
        });

        // now we'll show the player celebrate
        player.anims.play('caughtFish', true);

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

      pond.anims.chain('pondBite');

      pond.anims.stopAfterDelay(Phaser.Math.Between(2000,4000));

      pond.on('animationcomplete-pondBite', finishedFishing);
      pond.anims.chain('pondFishing');

      player.state = "fishing";
    }

  } else if (cursors.space.isUp) {
    spacebarHeld = false;
  }
}

function finishedFishing (animation, frame, gameObject)
{
  if (player.state === 'fishing') {
    // stop the current animation
    pond.anims.stopAfterDelay(Phaser.Math.Between(2000,4000)); // random

    // add a new animation
    pond.anims.chain('pondBite');
    pond.anims.chain('pondFishing');

  }
}
