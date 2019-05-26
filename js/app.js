// Default values
let playerStartGrid = { row:5, column:2 };
let levelElement = document.getElementById('level');
let level = 1;
let livesElement = document.getElementById('lives');
let lives = 5;

// Enemies our player must avoid
class Enemy {
    constructor(grid, speed) {
        this.position = gridToPosition(grid); //Position is the enemy's pixel coordinates from the top left
        this.speed = speed; //Number of pixels enemy moves per frame
        this.sprite = 'images/enemy-bug.png'; //Enemy's picture
    }
}

// Update the enemy's position. required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.position.x += this.speed * dt;
    if (this.position.x > 502) {
        this.position.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
                  this.position.x,
                  this.position.y);
};

// Now write your own player class
class Player {
    constructor (grid) {
        this.timeInWater = 0; //The number of frames or ticks spent in water
        this.grid = grid; //Position of the player in the grid
        this.position = gridToPosition(grid); //Position is the player's pixel coordinates from the top left
        this.sprite = 'images/char-princess-girl.png'; //Player's picture
    }
}
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function() {
    if (player.grid.row === 0) {  //If the player is in the water
        player.timeInWater++;
        if (player.timeInWater > 10) { //After 10 frames in water, level increases
            player.grid = {row:5,column:2};
            level += 1;
            levelElement.innerText = level;
            player.position = gridToPosition(player.grid);
            player.timeInWater = 0;
            //Accelerates speed after every level
            let numEnemies = allEnemies.length;
            for (i=0; i < numEnemies; i++) {
                let enemy = allEnemies[i];
                enemy.speed += 30;
            }
            if (level === 10) { //When player has reached the water 10 times, he or she wins
                alert('You won!');
                reset();
            }
        }
    }
};

//Render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
                  this.position.x,
                  this.position.y);
};

Player.prototype.handleInput = function(key) {
    if (player.timeInWater == 0) {
        switch(key) {
            case 'left':
                player.grid.column = Math.max(0,player.grid.column - 1);
                player.position = gridToPosition(player.grid);
                break;
            case 'right':
                player.grid.column = Math.min(4,player.grid.column + 1);
                player.position = gridToPosition(player.grid);
                break;
            case 'up':
                player.grid.row--;
                player.position = gridToPosition(player.grid);
                break;
            case 'down':
                player.grid.row = Math.min(5,player.grid.row + 1);
                player.position = gridToPosition(player.grid);
                break;
        }
    }
}

// Place all enemy objects in an array called allEnemies
/**
 * Speed is set to a number between 50 and 250
 */
let allEnemies = [];
allEnemies.push(new Enemy({row:3,column:-1}, 50 + (Math.random() * 200)));
allEnemies.push(new Enemy({row:2,column:-1}, 50 + Math.random() * 200));
allEnemies.push(new Enemy({row:1,column:-1}, 50 + Math.random() * 200));
// Place the player object in a variable called player
const player = new Player(playerStartGrid);
alert('Try to reach the water 10 times to win the game! Good luck!');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * Converts a pixel position to a grid position .
 * @param {*} position
 */
function positionToGrid(position) {
    return { row:    Math.round((position.y + 15) / 80),
             column: Math.round(position.x / 100) };
}

/**
 * Converts a grid position to a pixel position.
 * @param {*} grid
 */
function gridToPosition(grid) {
    return {x:grid.column * 100,
            y:grid.row * 80 - 15};
}

/**
 * Checks for collisions every frame at the end of update.
 */
function checkCollisions() {
    let numEnemies = allEnemies.length;

    for (i=0; i < numEnemies; i++) {
        let enemy = allEnemies[i];
        let enemyGrid = positionToGrid(enemy.position);
        //if true, there's been a collision
        if (enemyGrid.row == player.grid.row &&
            enemyGrid.column == player.grid.column) {
            player.grid = {row:5,column:2};
            player.position = gridToPosition(player.grid);
            lives--;
            livesElement.innerText = lives;
            if (lives === 0) {
                reset();
            }
        }
    }
}

function reset() {
    level = 1;
    levelElement.innerText = level;
    lives = 5;
    livesElement.innerText = lives;
    allEnemies = [];
    allEnemies.push(new Enemy({row:3,column:-1}, 50 + (Math.random() * 150)));
    allEnemies.push(new Enemy({row:2,column:-1}, 50 + Math.random() * 200));
    allEnemies.push(new Enemy({row:1,column:-1}, 50 + Math.random() * 200));
    player.grid.row = 5;
    player.grid.column = 2;
    player.position = gridToPosition(player.grid);
}
