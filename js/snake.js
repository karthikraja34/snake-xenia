
class Game {
  /**
   * 
   * @param {Canvas.context} context Context of the canvas
   */
  start(context) {
    window.canvas = context.canvas
    this.context = context;
    this.snake = new Snake(context);
    this.score = new Score();
    this.apple = new Apple(context, { x: 320, y: 320 });
    this.apple.spawn();
    this.snake.setCollision(this.apple, () => {
      this.score.increment();
      this.apple.spawn();
      
    })
    this.snake.setOnGameOver(() => {
      this.snake.reset();
      alert(`Game over. Your score is ${this.score.getScore()}`)
      this.score.reset();
      this.state = 'PAUSED'
    })
    this.initializeKeyboardControls();
    this.state = "STARTED"
    this.loop();
  }

  initializeKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      const LEFT_ARROW = "ArrowLeft";
      const UP_ARROW = "ArrowUp";
      const RIGHT_ARROW = "ArrowRight";
      const DOWN_ARROW = "ArrowDown";
      const SPACE = "Space";
      console.log("key : ", e.code)
      switch(e.code) {
        case LEFT_ARROW:
          this.snake.moveLeft();
          break;
        case RIGHT_ARROW: 
          this.snake.moveRight()
          break;
        case UP_ARROW: 
          this.snake.moveUp()
          break
        case DOWN_ARROW:
          this.snake.moveDown()
          break
        case SPACE:
          console.log("space")
          this.state = 'STARTED'
          this.loop();
          break
      }
    });
  }

  stop() {
    this.state = 'STOPPED'
  }

  loop() {
    if (this.state != 'STARTED') {
      return;
    }
    requestAnimationFrame(this.loop.bind(this));
    if (++this.count < 5) {
      return;
    }
    this.count = 0;
    this.snake.move();
    this.apple.draw();
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Snake {
  constructor(context, x_pos = 150, y_pos = 150) {
    this.context = context;
    this.x = x_pos;
    this.y = y_pos;
    this.cells = [];
    this.maxCells = 4
    this.dx = 0;
    this.dy = 0;
  }

  setCollision(collisionObject, callback) {
    this.collisionObject = collisionObject;
    this.onCollision = callback;
  }

  drawPart(position) {
    this.context.fillStyle = "lightblue";
    this.context.strokeStyle = "blue";
    this.context.fillRect(position.x, position.y, 10, 10);
    this.context.strokeRect(position.x, position.y, 10, 10);
  }

  setOnGameOver(onGameOver) {
    this.onGameOver = onGameOver;
  }

  draw() {
    this.cells.forEach((snakePart) => {
      this.drawPart(snakePart);
    });
  }

  changeDirection(horizontal = 0, vertical = 0) {
    this.dx = horizontal;
    this.dy = vertical;
  }

  moveLeft() {
    if (this.dx === 0) {
      this.dx = -10
      this.dy = 0
    }
  }

  moveRight() {
    if (this.dx === 0) {
      this.dx = 10
      this.dy = 0
    }
  }

  moveUp() {
    if (this.dy === 0) {
      this.dx = 0
      this.dy = -10
    }
  }

  moveDown() {
    if (this.dy === 0) {
      this.dx = 0
      this.dy = 10
    }
  }

  move() {
    this.clear();
    this.x += this.dx;
    this.y += this.dy;
    this.cells.unshift({x: this.x, y: this.y});

    if (this.cells.length > this.maxCells) {
      this.cells.pop();
    }

    if (this.x < 0) {
      this.x = canvas.width - 10;
    }
    else if (this.x >= canvas.width) {
      this.x = 0; 
    }

    // wrap snake position vertically on edge of screen
    if (this.y < 0) {
      this.y = canvas.height - 10;
    }
    else if (this.y >= canvas.height) {
      this.y = 0;
    }

    this.cells.forEach((cell, index) => {
      if (cell.x === this.collisionObject.x && cell.y === this.collisionObject.y) {
        this.maxCells++;
        this.onCollision();
      }

      for (let i = index + 1; i < this.cells.length && this.cells.length > 4; i++) {
          if (cell.x === this.cells[i].x && cell.y === this.cells[i].y) {
            this.onGameOver();
          }
      }

    })

    this.draw();
  }

  reset() {
    this.x = 150;
    this.y = 150;
    this.cells = [];
    this.maxCells = 4
    this.dx = 0;
    this.dy = 0;
  }

  clear() {
    const canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }
}


class Apple {
  constructor(context, {x, y}) {
    this.context = context;
    this.x = x;
    this.y = y;
  }

  draw() {
    this.context.fillStyle = "red";
    this.context.fillRect(this.x, this.y, 10, 10);
  }

  spawn() {
    this.x = getRandomInt(0, 25) * 10;
    this.y = getRandomInt(0, 25) * 10;
    this.draw();
  }
}


class Score {
  constructor() {
    this.score = 0;
  }

  increment() {
    this.score += 1
  }

  reset() {
    this.score = 0;
  }

  getScore() {
    return this.score
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  let game = new Game();
  game.start(context);
});
