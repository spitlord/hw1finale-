var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('win', 'assets/win.png');
    game.load.image('lose', 'assets/lose.png');    
    game.load.image('button', 'assets/againbutton.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('star', 'assets/starsheet1.png', 24, 22);
    game.load.image('bar', 'assets/health.png');
    game.load.spritesheet('dude', 'assets/dudedeath.png', 32, 48);
    game.load.spritesheet ('bad', 'assets/baddie.png', 32 ,32);

}
var winText;
var baddie;
var healthbar;
var player;
var cursors;
var star;
var stars;
var score;
var scoreText;
var immune;
var win;
var hitPlatform;
var hitBaddie;
var baddiePlatform;
var baddiePlatform1;
var immuneBreakFree
var starPlatform;
var button;
var break1;
var break2;
var boolButton;



    


function create() {
    immuneBreakFree = false;
    score = 0;
    win = false;
    break1 = false;
    break2 = false;

    immune = false;
    health = 5;

    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    baddie    = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    baddie.enableBody = true;

    
        scoreText = game.add.text(20, 20, 's c o r e: 0', { fontSize: '32px', fill: '#50A' });



    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    
    var bad = baddie.create(100, 50,'bad');
    bad = baddie.create(game.world.width - 50, 340,'bad');
    bad = baddie.create(game.world.width - 160, 340, 'bad');
    bad = baddie.create(game.world.width - 290, 340, 'bad');
    bad = baddie.create(game.world.width - 450, game.world.height - 100, 'bad');
    baddie.setAll('body.gravity.y', 400);
    baddie.setAll('body.collideWorldBounds', true);

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    
    makePlayer();



    //  Finally some stars to collect
    //  We will enable physics for any star that is created in this group

    
    healthbar = game.add.group(); 


    for (var x = 0; x < 5; x++) {
    var aaa = healthbar.create(15+38*x, 5, 'bar');            
    }

    makeStars();
    
    

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
}

function update() {
    
    if (boolButton) {
        boolButton = false;
        restart();
    }
    


    
    //  Collide the player and the stars with the platforms
    hitPlatform = game.physics.arcade.collide(player, platforms);
    hitBaddie = game.physics.arcade.overlap(baddie, player);
    starPlatform = game.physics.arcade.collide(stars, platforms);


    for (var i = 0; i < 6; i++) {
    baddiePlatform = game.physics.arcade.collide(baddie.children[i], platforms);
    if (baddiePlatform && baddie.children[i].body.touching.down ) {
            var a = Math.random();
            if (a < 0.5) a = 1;
            else a = -1;
        if (baddie.children[i].position.x < 300) {
            baddie.getAt(i).body.velocity.y = Math.round(-150-300*Math.random());
            baddie.getAt(i).body.velocity.x = Math.round(500*Math.random());
            if (baddie.getAt(i).body.velocity.x < 0) {
                baddie.getAt(i).frame = 3;
            }
                
        }
        else if (baddie.children[i].position.x > (game.world.width - 300)) {
            baddie.getAt(i).body.velocity.y = Math.round(-150-300*Math.random());
            baddie.getAt(i).body.velocity.x = Math.round(-500*Math.random());
    }   
        else {
            baddie.getAt(i).body.velocity.y = Math.round(-150-300*Math.random());
            baddie.getAt(i).body.velocity.x = Math.round(a*500*Math.random());
        }
    }
    }
    
    
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    

    if (cursors.left.isDown && health != 0 && !win)
    {

        player.body.velocity.x = -250;
        player.animations.play('left');


    }
    else if (cursors.right.isDown && health != 0 && !win)
    {
        //  Move to the right
        player.body.velocity.x = 250;
        player.animations.play('right');


    }
    else if (health != 0 && !win)
    {
        player.animations.stop();
        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform && health != 0)
    {

        player.body.velocity.y = -450;

    }
    

    if (immune && immuneBreakFree) {
        game.time.events.repeat(4000, 1, immuneGone, this);
        immuneBreakFree = false;
    }

    if (hitBaddie && !immune) {
        if (health > 0) health--; 
        
        stars.setAll('frame', Math.round(3*Math.random()));
        stars.setAll('angle', Math.random()*360);
        
        healthbar.getAt(health).visible = false;
        immune = true;
        immuneBreakFree = true;
    }    
    
    

    if(health == 0 && !break2 ) {
        break2 = true;
        player.animations.play('death', 5, false, true);
        
        winText = game.add.sprite(0,60,'lose');
        player.kill();
        button = game.add.sprite(400, 310, 'button');
        button.inputEnabled = true;
        button.input.useHandCursor = true;

        button.events.onInputDown.add(destroyy, this);
        
        
    }
    
    if (win && !break1) {    
        break1 = true;
        player.kill();
        winText = game.add.sprite(0,0,'win');
        button = game.add.sprite(400, 310, 'button');
        button.inputEnabled = true;
       
        button.input.useHandCursor = true;
        button.events.onInputDown.add(destroyy, this);
       
       



    }
    
}
    
    
    
function restart(sprite) {
    
    score = 0;
    
    health = 5;
    win = false;
    immuneBreakFree = false;
    immune = false;
    break1 = false;
    break2 = false;
    makePlayer();
    healthbar.setAll('visible', true);

    
    baddie.getAt(0).position.x = 50; 
    baddie.getAt(0).position.y = 20;
    baddie.getAt(1).position.x = 150; 
    baddie.getAt(1).position.y = 20;
    baddie.getAt(2).position.x = 200; 
    baddie.getAt(2).position.y = 30;
    baddie.getAt(3).position.x = 300; 
    baddie.getAt(3).position.y = 20;
    baddie.getAt(4).position.x = 400; 
    baddie.getAt(4).position.y = 20;
        makeStars();

    
    
  


    
}    
    
function makePlayer() {
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.animations.add('death', [9, 10, 11, 12, 13, 14], 3, true);
}
    
    
function makeStars () {
    stars = game.add.group();
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
      
        star = stars.create(30+i * 60, 0, 'star', 0);
        star.body.gravity.y = 300;
        star.body.bounce.y = 0.8 + Math.random() * 0.2;

    }
        stars.setAll('body.collideWorldBounds', true);

}    
function immuneGone() {
    immune = false;    
}
    
    

function destroyy (sprite) {
    stars.destroy();
    sprite.destroy();
    winText.destroy();
    boolButton = true;
}
    
function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.setText('s c o r e: ' + score);
    if (score == 120) win = true;

}

