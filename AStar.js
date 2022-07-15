class AStar {
  constructor(rows, cols, w, h, grid) {
    this.grid = grid;
    this.openSet = [];
    this.closedSet = [];
    this.start = this.grid[0][0];
    this.end = this.grid[rows - 1][cols - 1];
    this.openSet.push(this.start);
    this.path = [];
    this.rows = rows;
    this.cols = cols;
    this.res = w || h;
    this.current = this.start;
  }

  update() {
    this.current = this.openSet[0];
    brains: if (this.openSet.length > 0) {
      for (const city of this.openSet) {
        if (city.f > this.current.f) continue;
        this.current = city;
      }

      if (this.current === this.end) {
        console.log("DONE!");
        noLoop();
        break brains;
      }

      this.openSet.splice(this.openSet.indexOf(this.current), 1);
      this.closedSet.push(this.current);
      this.current.evaluateNeighbors(this.grid);

      for (const neighbor of this.current.neighbors) {
        if (wallBetween(this.current, neighbor)) continue;
        if (this.closedSet.includes(neighbor)) continue;
        const tempG = this.current.g + heuristic(neighbor, this.current);
        let newPath = false;
        if (!this.openSet.includes(neighbor)) {
          neighbor.g = tempG;
          this.openSet.push(neighbor);
          newPath = true;
        } else {
          const prev = neighbor.g;
          neighbor.g = min(neighbor.g, tempG);
          if (neighbor.g != prev) newPath = true;
        }

        if (!newPath) continue;
        neighbor.h = heuristic(neighbor, this.end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = this.current;
      }
    } else {
    }
  }

  show() {
    //clear();
    // for (const row of this.grid) {
    //   for (const city of row) {
    //     city.show(color(255));
    //   }
    // }
    if (drawDebug) {
      console.log("running");
      for (const city of this.closedSet) {
        city.show(color(255, 0, 0));
      }

      for (const city of this.openSet) {
        city.show(color(0, 255, 0));
      }
    }
    if (showRiver) return;
    this.path = [];
    let temp = this.current;
    this.path.push(temp);
    while (temp.previous) {
      this.path.push(temp.previous);
      temp = temp.previous;
    }
    push();
    stroke(255, 0, 150);
    noFill();
    strokeWeight(this.res / 4);
    beginShape();
    for (const city of this.path) {
      vertex(city.pos.x + this.res / 2, city.pos.y + this.res / 2);
    }
    endShape();
    pop();
  }
}
