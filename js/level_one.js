class LevelOne extends Phaser.Scene {
	constructor() {
		super('level_one');
	}

	preload() {
		this.load.image('bg', 'assets/background.jpg');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.audio('background_music', 'assets/music/background_1.mp3');
        this.load.atlas('player1', 'assets/miku.png', 'assets/miku_sprites_map_hash_a.json');
        this.load.atlas('player2', 'assets/rin.png', 'assets/rin_sprites_map_hash.json');
	}

	create() {
        this.cameras.main.setBounds(0, 0, 1600 * 4, 800);
        this.physics.world.setBounds(0, 0, 1600 * 4, 800);

        background_music = this.sound.add("background_music", { loop: true });
        background_music.play();

        game = this;

        //  A simple background for our game
        this.add.image(800, 400, 'bg');
        this.add.image(2400, 400, 'bg');
        this.add.image(4000, 400, 'bg');
        this.add.image(5600, 400, 'bg');

        // Player 1 animations
        initPlayer1Animations();

        // Player 2 animations
        initPlayer2Animations();

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        platforms.create(600, 670, 'ground').setAlpha(0).setScale(3).refreshBody();
        platforms.create(1800, 670, 'ground').setAlpha(0).setScale(3).refreshBody();
        platforms.create(3000, 670, 'ground').setAlpha(0).setScale(3).refreshBody();
        platforms.create(4200, 670, 'ground').setAlpha(0).setScale(3).refreshBody();
        platforms.create(5400, 670, 'ground').setAlpha(0).setScale(3).refreshBody();
        platforms.create(6600, 670, 'ground').setAlpha(0).setScale(3).refreshBody();

        //  Now let's create some ledges
        platforms.create(600, 500, 'ground');
        platforms.create(50, 400, 'ground');
        platforms.create(600, 250, 'ground');
        platforms.create(800, 250, 'ground');
        platforms.create(1000, 100, 'ground');
        platforms.create(1500, 250, 'ground').setScale(1.7).refreshBody();
        platforms.create(2500, 500, 'ground');
        platforms.create(2800, 400, 'ground');
        platforms.create(3000, 250, 'ground').setScale(1.1).refreshBody();
        platforms.create(3600, 200, 'ground').setScale(1.5).refreshBody();
        platforms.create(4500, 350, 'ground').setScale(1.6).refreshBody();
        platforms.create(5300, 500, 'ground').setScale(1.3).refreshBody();
        platforms.create(5800, 400, 'ground');

        // The player and its settings
        player = this.physics.add.sprite(100, 450, 'player1_texture');
        player2 = this.physics.add.sprite(200, 450, 'player2');

        //  Player physics properties. Give the little guy a slight bounce.
        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keys = this.input.keyboard.addKeys('A,W,S,D');

        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
            key: 'star',
            repeat: 90,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function(child) {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        bombs = this.physics.add.group({
            key: 'bomb',
            repeat: 45,
            bounce: 1,
            setXY: { x: 12, y: 0, stepX: 250 }
        });

        bombs.children.iterate(function(child) {
            child.setBounce(Phaser.Math.FloatBetween(0.1, 1));
            child.setCollideWorldBounds(true);
            child.setVelocity(Phaser.Math.Between(-200, 200), 20);
            child.allowGravity = false;
        });

        //  The score
        scoreText = this.add.text(16, 50, 'score: 0', { fontSize: '32px', fill: '#000' });
        scoreText.setScrollFactor(0);

        // Next level
        this.add.text(5800, 300, 'SIGUIENTE NIVEL >>>', { fontSize: '36px', fill: '#000' });

        //  Collide the players and the stars with the platforms
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(player2, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.overlap(player2, stars, collectStar, null, this);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
        this.physics.add.collider(player2, bombs, hitBomb, null, this);

        player.anims.play('__idle', true);
        player2.anims.play('idle_p2', true);

        this.cameras.main.startFollow(player);
	}

	update() {
        if (gameOver) {
            return;
        }

        if (player.x >= 6300) {
            this.scene.switch('level_two');
            background_music.stop();
            return;
        }

        /*var medianX = (player.body.x > player2.body.x) ? (player.body.x - player2.body.x) : (player2.body.x - player.body.x);
        var medianY = (player.body.y > player2.body.y) ? (player.body.y - player2.body.y) : (player2.body.y - player.body.y);
        this.cameras.main.centerOn(medianX, medianY);*/
    
        if (cursors.left.isDown && !isJumping) {
            isRunning = true;
            player.flipX = true;
            player.setVelocityX(-260);
            player.anims.play('right', true);
        } else if (cursors.right.isDown && !isJumping) {
            isRunning = true;
            player.flipX = false;
            player.setVelocityX(260);
            player.anims.play('right', true);
        } else if (cursors.left.isDown) {
            player.flipX = true;
            player.setVelocityX(-260);
        } else if (cursors.right.isDown) {
            player.flipX = false;
            player.setVelocityX(260);
        } else {
            if (isRunning && !isJumping) {
                isRunning = false;
                player.anims.play('__idle', true);
                player.setVelocityX(0);
            }
        }

        if (player.body.touching.down) {
            isJumping = false;
        }
    
        if (cursors.up.isDown && player.body.touching.down) {
            isJumping = true;
            player.setVelocityY(-330);
            player.anims.play('jump', false);
        } 
        
        if (player.body.touching.down && !isRunning && !isJumping) {
            isJumping = false;
            player.anims.play('__idle', true);
        }

        if ((player.body.velocity.y > 0) && !player.body.touching.down) {
            player.anims.play('falling', true);
        }

        // Player 2
        if (keys.A.isDown && !isJumpingP2) {
            isRunningP2 = true;
            player2.flipX = true;
            player2.setVelocityX(-260);
            player2.anims.play('run_p2', true);
        } else if (keys.D.isDown && !isJumpingP2) {
            isRunningP2 = true;
            player2.flipX = false;
            player2.setVelocityX(260);
            player2.anims.play('run_p2', true);
        } else if (keys.A.isDown) {
            player2.flipX = true;
            player2.setVelocityX(-260);
        } else if (keys.D.isDown) {
            player2.flipX = false;
            player2.setVelocityX(260);
        } else {
            if (isRunningP2 && !isJumpingP2) {
                isRunningP2 = false;
                player2.anims.play('idle_p2', true);
                player2.setVelocityX(0);
            }
        }

        if (player2.body.touching.down) {
            isJumpingP2 = false;
        }
    
        if (keys.W.isDown && player2.body.touching.down) {
            isJumpingP2 = true;
            player2.setVelocityY(-330);
            player2.anims.play('jump_p2', false);
        } 
        
        if (player2.body.touching.down && !isRunningP2 && !isJumpingP2) {
            isJumpingP2 = false;
            player2.anims.play('idle_p2', true);
        }

        if ((player2.body.velocity.y > 0) && !player2.body.touching.down) {
            player2.anims.play('falling_p2', true);
        }
	}
}

var player;
var player2;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var keys;
var isRunning = false;
var isJumping = false;
var isRunningP2 = false;
var isJumpingP2 = false;
var game;
var background_music;
var platformWidth = 200;

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    /*if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }*/
}

function hitBomb(__player, bomb) {
    this.physics.pause();

    __player.setTint(0xff0000);

    if (__player == player2) {
        player2.anims.play('death_p2');
    } else {
        player.anims.play('death');
    }

    gameOver = true;
}

function initPlayer1Animations() {
    game.anims.create({
        key: '__idle',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'idle', 
            start: 1, 
            end: 20
        }),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'right',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'running', 
            start: 1, 
            end: 8
        }),
        frameRate: 13,
        repeat: -1
    });

    game.anims.create({
        key: 'jump',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'jump', 
            start: 1, 
            end: 5
        }),
        frameRate: 20,
        repeat: 0
    });

    game.anims.create({
        key: 'falling',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'falling', 
            start: 1, 
            end: 2
        }),
        frameRate: 5,
        repeat: -1
    });

    game.anims.create({
        key: '__dash',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'dash', 
            start: 1, 
            end: 1
        }),
        frameRate: 4
    });

    game.anims.create({
        key: 'death',
        frames: game.anims.generateFrameNames('player1', {
            prefix: 'death', 
            start: 1, 
            end: 3
        }),
        frameRate: 4
    });
}

function initPlayer2Animations() {
    game.anims.create({
        key: 'idle_p2',
        frames: game.anims.generateFrameNames('player2', {
            prefix: 'idle', 
            start: 1, 
            end: 20
        }),
        frameRate: 10,
        repeat: -1
    });

    game.anims.create({
        key: 'run_p2',
        frames: game.anims.generateFrameNames('player2', {
            prefix: 'running', 
            start: 1, 
            end: 8
        }),
        frameRate: 13,
        repeat: -1
    });

    game.anims.create({
        key: 'jump_p2',
        frames: game.anims.generateFrameNames('player2', {
            prefix: 'jump', 
            start: 1, 
            end: 5
        }),
        frameRate: 20,
        repeat: 0
    });

    game.anims.create({
        key: 'falling_p2',
        frames: game.anims.generateFrameNames('player2', {
            prefix: 'falling', 
            start: 1, 
            end: 2
        }),
        frameRate: 5,
        repeat: 0
    });

    game.anims.create({
        key: 'death_p2',
        frames: game.anims.generateFrameNames('player2', {
            prefix: 'death', 
            start: 2, 
            end: 4
        }),
        frameRate: 4
    });
}

export default LevelOne;