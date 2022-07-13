class Wall {
  constructor(ax, ay, bx, by) {
    this.a = createVector(ax, ay);
    this.b = createVector(bx, by);
  }

  show() {
    stroke(255);
    //console.log(this.a.x, this.a.y, this.b.x, this.b.y);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
