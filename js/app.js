// Default values
let playerStartGrid = {row:5,column:2};

// Enemies our player must avoid

class Enemy {
    constructor(grid, speed) {
        this.position = gridToPosition(grid);
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png';
    }
}

// Update the enemy's position. required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
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
        this.grid = grid;
        this.position = gridToPosition(grid);
        this.sprite = 'images/char-princess-girl.png';
    }
}
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function() {
};

//Render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
                  this.position.x,
                  this.position.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
allEnemies.push(new Enemy({row:3,column:-1}, 50 + Math.random() * 150));
//allEnemies.push(new Enemy({row:2,column:-1}, 50 + Math.random() * 200));
//allEnemies.push(new Enemy({row:1,column:-1}, Math.random() * 200));
console.log(allEnemies[0]);
// Place the player object in a variable called player
const player = new Player(playerStartGrid);

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
            player.grid = playerStartGrid;
            player.position = gridToPosition(playerStartGrid);
        }
    }
}