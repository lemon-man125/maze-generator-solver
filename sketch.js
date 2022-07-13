let mazeGenerator;

let astar;

let running = false;

let drawDebug;

let rows, cols;

let grid;

let res = 0;

let multiply;

let showVisited;

let bestHeuristic;

function setup() {
  createCanvas(800, 800);

  background(51);

  const wrapper = document.querySelector(".wrapper");
  const resInput = document.querySelector(".res");
  const debugInput = document.querySelector(".debug");
  const bestHeuristicInput = document.querySelector(".heuristic");
  const multiplyInput = document.querySelector(".multiply");
  const showVisitedInput = document.querySelector(".showVisited");
  const startButton = document.querySelector(".start");

  resInput.value = getItem("res") || "40";
  debugInput.checked = getItem("debug") || false;
  bestHeuristicInput.checked = getItem("bestHeuristic") || false;
  multiplyInput.value = getItem("multiply") || "1";
  showVisitedInput.checked = getItem("showVisited") || false;

  startButton.addEventListener("click", () => {
    res = parseInt(resInput.value);
    drawDebug = debugInput.checked;
    bestHeuristic = bestHeuristicInput.checked;
    multiply = parseInt(multiplyInput.value);
    showVisited = showVisitedInput.checked;
    console.log(res, drawDebug, bestHeuristic, multiply, showVisited);

    storeItem("res", res.toString());
    storeItem("debug", drawDebug);
    storeItem("bestHeuristic", bestHeuristic);
    storeItem("multiply", multiply);
    storeItem("showVisited", showVisited);

    wrapper.style.display = "none";
    ready();
    running = true;
  });
}

function ready() {
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
}

function draw() {
  if (!running) return;
  background(51);

  for (let i = 0; i < multiply; i++) {
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
  if (bestHeuristic) return abs(start.col - end.col) + abs(start.row - end.row);
  return dist(start.row, start.col, end.row, end.col);
}

function wallBetween(a, b) {
  const x = b.col - a.col;
  const y = b.row - a.row;
  if (x === 1) return "right" in a.walls || "left" in b.walls;
  if (x === -1) return "left" in a.walls || "right" in b.walls;
  if (y === 1) return "bottom" in a.walls || "top" in b.walls;
  if (y === -1) return "top" in a.walls || "bottom" in b.walls;
}
