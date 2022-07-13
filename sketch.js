let mazeGenerator;

let astar;

const drawDebug = false;

let rows, cols;

let grid;

const res = 10;

function setup() {
  createCanvas(800, 800);

  rows = height / res;
  cols = width / res;

  grid = Array(rows)
    .fill()
    .map((_, i) =>
      Array(cols)
        .fill()
        .map((_, j) => new Cell(i, j, res))
    );
  grid.forEach((row) => row.forEach((cell) => cell.evaluateNeighbors(grid)));
  astar = new AStar(rows, cols, res, res, grid);
  mazeGenerator = new MazeGenerator(rows, cols, res, grid);

  console.log(grid);

  //frameRate(5);
}

function draw() {
  background(51);

  for (let i = 0; i < 100; i++) {
    mazeGenerator.update();
  }
  mazeGenerator.show();

  if (!mazeGenerator.finished) return;
  //frameRate(5);
  //console.log("yay");
  astar.update();
  astar.show();
}

function removeWalls(a, b) {
  const x = b.col - a.col;
  const y = b.row - a.row;

  if (x === 1) {
    delete a.walls.right;
    delete b.walls.left;
    return;
  }
  if (x === -1) {
    delete a.walls.left;
    delete b.walls.right;
    return;
  }
  if (y === 1) {
    delete a.walls.bottom;
    delete b.walls.top;
    return;
  }
  if (y === -1) {
    delete a.walls.top;
    delete b.walls.bottom;
    return;
  }
}

function getNeighbor(arr) {
  const neighbors = arr.slice().filter((cell) => !cell.visited);

  return random(neighbors);
}

function heuristic(start, end) {
  return dist(start.row, start.col, end.row, end.col);
  //return abs(start.col - end.col) + abs(start.row - end.row);
}

function wallBetween(a, b) {
  const x = b.col - a.col;
  const y = b.row - a.row;
  if (x === 1) return "right" in a.walls || "left" in b.walls;
  if (x === -1) return "left" in a.walls || "right" in b.walls;
  if (y === 1) return "bottom" in a.walls || "top" in b.walls;
  if (y === -1) return "top" in a.walls || "bottom" in b.walls;
}
