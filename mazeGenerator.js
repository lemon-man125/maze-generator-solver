class MazeGenerator {
  constructor(rows, cols, res, grid) {
    this.rows = rows;
    this.cols = cols;
    this.res = res;

    this.stack = [];

    this.grid = grid;

    this.finished = false;

    this.current = this.grid[0][0];
    this.current.visited = true;
  }

  update() {
    if (this.finished) return;
    const next = getNeighbor(this.current.neighbors);
    if (!next) {
      if (this.stack.length < 1) {
        for (const row of this.grid) {
          for (const cell of row) {
            cell.bounceHighlight();
          }
        }
        this.finished = true;
        this.current = null;
        return; // noLoop();
      }
      this.current = this.stack.pop();
      return;
    }
    next.visited = true;

    this.stack.push(this.current);

    removeWalls(this.current, next);
    this.current = next;
  }

  show() {
    for (const row of this.grid) {
      for (const cell of row) {
        //console.log("showing");
        cell.show();
      }
    }
  }
}
