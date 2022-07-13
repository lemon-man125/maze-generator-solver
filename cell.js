class Cell {
  constructor(i, j, res) {
    this.row = i;
    this.col = j;
    this.res = res;
    this.pos = createVector(j * this.res, i * this.res);
    this.walls = {};
    this.visited = false;
    this.neighbors = [];
    this.animating = false;
    this.highlightSize = this.res;
    this.animationDesired = null;

    this.walls.top = new Wall(
      this.pos.x,
      this.pos.y,
      this.pos.x + this.res,
      this.pos.y
    );

    this.walls.right = new Wall(
      this.pos.x + this.res,
      this.pos.y,
      this.pos.x + this.res,
      this.pos.y + this.res
    );
    this.walls.bottom = new Wall(
      this.pos.x + this.res,
      this.pos.y + this.res,
      this.pos.x,
      this.pos.y + this.res
    );
    this.walls.left = new Wall(
      this.pos.x,
      this.pos.y + this.res,
      this.pos.x,
      this.pos.y
    );
  }

  bounceHighlight() {
    if (this.highlightSize < 1) return;
    this.animating = true;
    this.animationDesired = this.res + 10;
    this.highlightSize = lerp(this.highlightSize, this.animationDesired, 0.2);
    if (this.highlightSize !== this.animationDesired) return;
    this.animationDesired = 0;
    this.highlightSize = lerp(this.highlightSize, this.animatingDesired, 0.2);
    if (this.highlightSize == this.animationDesired) this.animating = false;
  }

  show(col) {
    const keys = Object.keys(this.walls);
    for (const key of keys) {
      //console.log("showing");
      this.walls[key].show();
    }

    if (this.visited && !mazeGenerator.finished && showVisited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(this.pos.x, this.pos.y, this.res);
    }

    if (mazeGenerator.finished && col) {
      noStroke();
      fill(col);
      rect(this.pos.x, this.pos.y, this.res);
    }

    if (mazeGenerator.current != this) return;
    noStroke();
    fill(0, 255, 0, 150);
    rect(this.pos.x, this.pos.y, this.highlightSize);
  }

  evaluateNeighbors(grid) {
    this.neighbors = [];
    //console.log(grid);
    for (let i = this.row - 1; i < this.row + 2; i++) {
      for (let j = this.col - 1; j < this.col + 2; j++) {
        if (i < 0 || i >= rows || j < 0 || j >= cols) continue;
        //console.log("step1");
        if (grid[i][j] == this) continue;
        //console.log("step2");
        if (abs(this.row - i) == 1 && abs(this.col - j) == 1) continue;
        //console.log("step3");
        this.neighbors.push(grid[i][j]);
      }
    }
  }
}
