// eslint-disable-next-line no-unused-vars
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(p) {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  add(p) {
    this.x = this.x + p.x;
    this.y = this.y + p.y;
  }
}
